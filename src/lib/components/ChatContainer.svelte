<script lang="ts">
  import ChatMessage from './ChatMessage.svelte';
  import ChatInput from './ChatInput.svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }> = [];
  export let isLoading: boolean = false;
  export let error: string | null = null;
  
  const dispatch = createEventDispatcher<{
    send: { message: string };
  }>();
  
  let chatContainer: HTMLDivElement;
  
  // Auto-scroll to bottom when new messages arrive
  function scrollToBottom() {
    if (chatContainer) {
      try {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      } catch (error) {
        console.warn('Auto-scroll failed:', error);
      }
    }
  }
  
  // Ensure element is mounted before trying to scroll
  onMount(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  });
  
  // Watch for message changes and scroll
  $: if (messages.length > 0) {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      setTimeout(scrollToBottom, 50);
    });
  }
</script>

<div class="flex flex-col h-full bg-white">
  <!-- Chat Header -->
  <div class="flex-shrink-0 px-4 py-3 border-b" style="background: #16213e; border-color: #0f3460;">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
        </svg>
      </div>
      
    </div>
  </div>

  <!-- Error Message -->
  {#if error}
    <div class="flex-shrink-0 mx-3 mt-2 p-3 bg-red-50 border-l-4 border-red-400 rounded">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-700">{error}</p>
      </div>
    </div>
  {/if}

  <!-- Messages Container -->
  <div 
    bind:this={chatContainer}
    class="flex-1 overflow-y-auto px-3 py-2 min-h-0"
    style="max-height: 400px;"
  >
    {#if messages.length === 0}
      <!-- Welcome Message -->
      <div class="flex justify-center items-center h-full">
        <div class="text-center max-w-sm">
          <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-1">Hi! How can I help you today?</h3>
          <p class="text-xs text-gray-500">Ask me anything or start a conversation</p>
        </div>
      </div>
    {:else}
      <div class="space-y-3">
        {#each messages as message, index (message.content + index)}
          <ChatMessage {message} isLoading={isLoading && index === messages.length - 1 && message.role === 'assistant'} />
        {/each}
      </div>
    {/if}
  </div>

  <!-- Input Container -->
  <div class="flex-shrink-0">
    <ChatInput 
      {isLoading} 
      on:send={(e) => dispatch('send', e.detail)}
    />
  </div>
</div>

<style>
  .flex-1 {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
  }
  
  .flex-1::-webkit-scrollbar {
    width: 6px;
  }
  
  .flex-1::-webkit-scrollbar-track {
    background: #f7fafc;
    border-radius: 3px;
  }
  
  .flex-1::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }
  
  .flex-1::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
</style>
