<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let disabled: boolean = false;
  export let placeholder: string = 'Type your message...';
  
  const dispatch = createEventDispatcher<{
    send: { message: string };
  }>();
  
  let message = '';
  let textarea: HTMLTextAreaElement;
  
  function handleSubmit() {
    if (message.trim() && !disabled) {
      dispatch('send', { message: message.trim() });
      message = '';
      // Reset textarea height
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
  
  function adjustHeight() {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }
</script>

<div class="px-3 py-2 bg-gray-800 border-t border-gray-700">
  <!-- Input field with integrated send button -->
  <div class="relative flex items-center bg-gray-700 rounded-lg focus-within:ring-1 focus-within:ring-purple-500">
    <textarea
      bind:this={textarea}
      bind:value={message}
      on:keydown={handleKeydown}
      on:input={adjustHeight}
      {placeholder}
      {disabled}
      class="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 disabled:cursor-not-allowed text-base"
      rows="1"
      style="min-height: 48px; max-height: 120px;"
    ></textarea>
    
    <!-- Send Button integrated on the right -->
    <div class="flex items-center pr-2">
      <button
        on:click={handleSubmit}
        {disabled}
        class="w-8 h-8 rounded-full hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        style="background: #22223b;"
      >
        <img src="/up_arrow.svg" alt="Send" class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
