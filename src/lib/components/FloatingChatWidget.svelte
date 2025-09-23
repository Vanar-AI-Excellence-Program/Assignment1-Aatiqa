<script lang="ts">
  import ChatContainer from './ChatContainer.svelte';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  
  let isOpen = false;
  let messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }> = [];
  
  let isLoading = false;
  let error: string | null = null;
  let currentConversationId: number | null = null;
  let currentBranchId: string = 'main';
  let conversations: Array<{
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
  }> = [];
  let conversationBranches: Array<{
    id: number;
    conversationId: number;
    branchId: string;
    branchName: string;
    parentMessageId: number | null;
    isMainBranch: boolean;
    createdAt: string;
  }> = [];
  let isAuthenticated = false;
  let userId: number | null = null;
  
  async function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      await checkAuthStatus();
      if (isAuthenticated && conversations.length === 0) {
        loadConversations();
      }
    }
  }

  // Check if user is authenticated
  async function checkAuthStatus() {
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        const authData = await response.json();
        const newIsAuthenticated = authData.isAuthenticated;
        const newUserId = authData.userId || null;
        
        // Check if user has changed (different userId or authentication status changed)
        const userChanged = (userId !== newUserId) || (isAuthenticated !== newIsAuthenticated);
        
        // Update authentication status and userId
        isAuthenticated = newIsAuthenticated;
        userId = newUserId;
        
        // Clear data if user changed or user is not authenticated
        if (userChanged || !isAuthenticated) {
          conversations = [];
          currentConversationId = null;
          messages = [];
          error = null;
        }
      }
    } catch (err) {
      console.error('Failed to check auth status:', err);
      isAuthenticated = false;
      userId = null;
      conversations = [];
      currentConversationId = null;
      messages = [];
      error = null;
    }
  }
  
  function closeChat() {
    isOpen = false;
  }

  // Load user's conversations (only for authenticated users)
  async function loadConversations() {
    if (!isAuthenticated) {
      conversations = [];
      return;
    }
    
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        conversations = await response.json();
      } else if (response.status === 401) {
        error = 'Please log in to access chat history';
        isAuthenticated = false;
        conversations = [];
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      conversations = [];
    }
  }

  // Load messages for a specific conversation and branch (only for authenticated users)
  async function loadConversation(conversationId: number, branchId: string = 'main') {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages?branchId=${branchId}`);
      if (response.ok) {
        const conversationMessages = await response.json();
        messages = conversationMessages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          id: msg.id // Add message ID for forking
        }));
        currentConversationId = conversationId;
        currentBranchId = branchId;
        
        // Load branches for this conversation
        await loadConversationBranches(conversationId);
      } else if (response.status === 401) {
        isAuthenticated = false;
        conversations = [];
        currentConversationId = null;
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
      error = 'Failed to load conversation';
    }
  }

  // Load branches for a conversation
  async function loadConversationBranches(conversationId: number) {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/branches`);
      if (response.ok) {
        conversationBranches = await response.json();
      }
    } catch (err) {
      console.error('Failed to load conversation branches:', err);
    }
  }

  // Fork conversation from a specific message
  async function forkConversation(messageId: number, branchName?: string) {
    if (!isAuthenticated || !currentConversationId) {
      return;
    }
    
    try {
      const response = await fetch(`/api/conversations/${currentConversationId}/fork`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          branchName: branchName || `Branch from message ${messageId}`
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        // Switch to the new branch
        await loadConversation(currentConversationId, result.branchId);
      }
    } catch (err) {
      console.error('Failed to fork conversation:', err);
      error = 'Failed to fork conversation';
    }
  }

  // Switch to a different branch
  async function switchBranch(branchId: string) {
    if (!isAuthenticated || !currentConversationId) {
      return;
    }
    
    await loadConversation(currentConversationId, branchId);
  }

  // Start a new conversation
  function startNewConversation() {
    messages = [];
    currentConversationId = null;
    error = null;
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
          conversationId: currentConversationId,
          branchId: currentBranchId,
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
                if (parsed.conversationId) {
                  currentConversationId = parsed.conversationId;
                  // Reload conversations to include the new one (only for authenticated users)
                  if (isAuthenticated) {
                    loadConversations();
                  }
                } else if (parsed.content) {
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
    startNewConversation();
  }

  // Function to clear all chat data (called on logout)
  export function clearAllChatData() {
    messages = [];
    conversations = [];
    conversationBranches = [];
    currentConversationId = null;
    currentBranchId = 'main';
    isAuthenticated = false;
    userId = null;
    error = null;
  }

  // Periodically check auth status to handle logout/user changes from other tabs
  onMount(() => {
    const interval = setInterval(async () => {
      if (isOpen) {
        const wasAuthenticated = isAuthenticated;
        const wasUserId = userId;
        await checkAuthStatus();
        
        // If user was authenticated but now isn't, or user changed, clear data
        if ((wasAuthenticated && !isAuthenticated) || (wasUserId !== userId)) {
          clearAllChatData();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  });
</script>

<!-- Floating Chat Widget -->
<div class="floating-chat-widget">
  <!-- Chat Overlay -->
  {#if isOpen}
    <div class="chat-overlay">
      <div class="chat-window {!isAuthenticated ? 'guest-mode' : ''}">
        <div class="chat-layout {!isAuthenticated ? 'no-sidebar' : ''}">
          <!-- Conversation Sidebar (only for authenticated users) -->
          {#if isAuthenticated}
            <div class="conversation-sidebar">
              <div class="sidebar-header">
                <h4 class="sidebar-title">Chat History</h4>
                <button on:click={startNewConversation} class="new-chat-btn" title="New conversation">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
              <div class="conversation-list">
                {#each conversations as conversation (conversation.id)}
                  <button 
                    class="conversation-item {currentConversationId === conversation.id ? 'active' : ''}"
                    on:click={() => loadConversation(conversation.id)}
                    title={conversation.title}
                  >
                    <div class="conversation-title">{conversation.title || 'New Chat'}</div>
                    <div class="conversation-date">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                {/each}
                {#if conversations.length === 0}
                  <div class="no-conversations">No chat history yet</div>
                {/if}
              </div>
              
              <!-- Branch Selector -->
              {#if currentConversationId && conversationBranches.length > 1}
                <div class="branch-selector">
                  <div class="branch-header">
                    <h5 class="branch-title">Branches</h5>
                  </div>
                  <div class="branch-list">
                    {#each conversationBranches as branch (branch.branchId)}
                      <button 
                        class="branch-item {currentBranchId === branch.branchId ? 'active' : ''}"
                        on:click={() => switchBranch(branch.branchId)}
                        title={branch.branchName}
                      >
                        <div class="branch-name">{branch.branchName}</div>
                        <div class="branch-icon">
                          {#if branch.isMainBranch}
                            🌟
                          {:else}
                            🌿
                          {/if}
                        </div>
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          <!-- Main Chat Area -->
          <div class="main-chat">
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
                  <p class="chat-subtitle">
                    {#if isAuthenticated}
                      Powered by Gemini • Chat history saved
                    {:else}
                      Powered by Gemini • Guest mode
                    {/if}
                  </p>
                </div>
              </div>
              <div class="chat-header-actions">
                <button on:click={clearChat} class="chat-action-btn" title="New chat">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
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
                {isAuthenticated}
                {currentConversationId}
                {forkConversation}
                on:send={handleSend}
              />
            </div>
          </div>
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
    width: 600px;
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

  /* Adjust width for guest users without sidebar */
  .chat-window.guest-mode {
    width: 380px;
  }

  .chat-layout {
    display: flex;
    height: 100%;
  }

  .conversation-sidebar {
    width: 200px;
    background: #f8f9fa;
    border-right: 1px solid #e9ecef;
    display: flex;
    flex-direction: column;
  }

  .sidebar-header {
    padding: 12px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f1f3f4;
  }

  .sidebar-title {
    font-size: 12px;
    font-weight: 600;
    color: #495057;
    margin: 0;
  }

  .new-chat-btn {
    width: 24px;
    height: 24px;
    border: none;
    background: #6c757d;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .new-chat-btn:hover {
    background: #5a6268;
  }

  .conversation-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .conversation-item {
    width: 100%;
    padding: 8px;
    margin-bottom: 4px;
    border: none;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    border: 1px solid transparent;
  }

  .conversation-item:hover {
    background: #e9ecef;
    border-color: #dee2e6;
  }

  .conversation-item.active {
    background: #007bff;
    color: white;
    border-color: #0056b3;
  }

  .conversation-title {
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .conversation-date {
    font-size: 10px;
    color: #6c757d;
  }

  .conversation-item.active .conversation-date {
    color: rgba(255, 255, 255, 0.8);
  }

  .no-conversations {
    text-align: center;
    color: #6c757d;
    font-size: 11px;
    padding: 20px;
  }

  .branch-selector {
    border-top: 1px solid #e9ecef;
    padding: 8px;
    margin-top: 8px;
  }

  .branch-header {
    padding: 4px 8px;
    margin-bottom: 8px;
  }

  .branch-title {
    font-size: 10px;
    font-weight: 600;
    color: #495057;
    margin: 0;
  }

  .branch-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .branch-item {
    width: 100%;
    padding: 6px 8px;
    border: none;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    border: 1px solid transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .branch-item:hover {
    background: #e9ecef;
    border-color: #dee2e6;
  }

  .branch-item.active {
    background: #28a745;
    color: white;
    border-color: #1e7e34;
  }

  .branch-name {
    font-size: 10px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .branch-icon {
    font-size: 12px;
    margin-left: 4px;
  }

  .main-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
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
