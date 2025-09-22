<script lang="ts">
  import ChatContainer from './ChatContainer.svelte';
  import { browser } from '$app/environment';
  
  let isOpen = false;
  let messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }> = [];
  
  let isLoading = false;
  let error: string | null = null;
  
  function toggleChat() {
    isOpen = !isOpen;
  }
  
  function closeChat() {
    isOpen = false;
  }
  
  async function handleSend(event: CustomEvent<{ message: string }>) {
    const userMessage = event.detail.message;
    
    // Add user message to chat
    messages = [...messages, { role: 'user', content: userMessage }];
    
    // Add loading assistant message and keep its index for streaming updates
    messages = [...messages, { role: 'assistant', content: '' }];
    const assistantIndex = messages.length - 1;
    
    isLoading = true;
    error = null;
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // exclude the placeholder assistant message
          messages: messages.slice(0, -1),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantMessage += parsed.content;
                  // Update the single assistant message instead of pushing new ones
                  messages = messages.map((m, i) => i === assistantIndex ? { ...m, content: assistantMessage } : m);
                }
              } catch (e) {
                // Ignore parsing errors for malformed JSON
              }
            }
          }
        }
      }
      
    } catch (err) {
      console.error('Chat error:', err);
      console.error('Error details:', (err as Error).message);
      error = `Failed to get response from AI: ${(err as Error).message || 'Unknown error'}. Please check your API key and try again.`;
      
      // Remove the loading message on error
      messages = messages.filter((_, i) => i !== assistantIndex);
    } finally {
      isLoading = false;
    }
  }
  
  function clearChat() {
    messages = [];
    error = null;
  }
</script>

<!-- Floating Chat Widget -->
<div class="floating-chat-widget">
  <!-- Chat Overlay -->
  {#if isOpen}
    <div class="chat-overlay">
      <div class="chat-window">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-header-content">
            <div class="chat-avatar">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div class="chat-header-text">
              <h3 class="chat-title">AI Assistant</h3>
              <p class="chat-subtitle">Powered by Gemini</p>
            </div>
          </div>
          <div class="chat-header-actions">
            <button on:click={clearChat} class="chat-action-btn" title="Clear chat">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            <button on:click={closeChat} class="chat-action-btn" title="Close chat">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Chat Content -->
        <div class="chat-content">
          <ChatContainer 
            {messages} 
            {isLoading} 
            {error}
            on:send={handleSend}
          />
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Floating Button -->
  <button 
    class="floating-chat-button {isOpen ? 'active' : ''}"
    on:click={toggleChat}
    title={isOpen ? 'Close chat' : 'Open AI chat'}
  >
    {#if isOpen}
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    {:else}
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    {/if}
  </button>
</div>

<style>
  .floating-chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }

  .floating-chat-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .floating-chat-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
  }

  .floating-chat-button.active {
    background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    box-shadow: 0 4px 20px rgba(220, 53, 69, 0.4);
  }

  .floating-chat-button.active:hover {
    box-shadow: 0 6px 25px rgba(220, 53, 69, 0.6);
  }

  .floating-chat-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  .floating-chat-button:hover::before {
    transform: translateX(100%);
  }

  .chat-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 20px;
    z-index: 999;
  }

  .chat-window {
    width: 380px;
    height: 500px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .chat-header {
    background: #1a1a2e;
    color: #ffffff;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #0f3460;
  }

  .chat-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chat-avatar {
    width: 32px;
    height: 32px;
    background: #3b82f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-title {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: #ffffff;
  }

  .chat-subtitle {
    font-size: 11px;
    margin: 0;
    color: #e5e7eb;
  }

  .chat-header-actions {
    display: flex;
    gap: 8px;
  }

  .chat-action-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: #0f3460;
    color: #ffffff;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .chat-action-btn:hover {
    background: #16213e;
    color: #ffffff;
  }

  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 480px) {
    .floating-chat-widget {
      bottom: 15px;
      right: 15px;
    }

    .floating-chat-button {
      width: 56px;
      height: 56px;
    }

    .chat-overlay {
      padding: 10px;
    }

    .chat-window {
      width: calc(100vw - 20px);
      height: calc(100vh - 20px);
      max-height: 450px;
    }
  }

  /* Tablet */
  @media (max-width: 768px) and (min-width: 481px) {
    .chat-window {
      width: 350px;
      height: 450px;
    }
  }
</style>
