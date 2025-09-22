<script lang="ts">
  export let message: {
    role: 'user' | 'assistant';
    content: string;
  };
  export let isLoading: boolean = false;
</script>

{#if message.role === 'user'}
  <!-- User Message - Dark blue/purple bubble on the right -->
  <div class="flex justify-end mb-4 user-message-bubble">
    <div class="max-w-[85%] flex flex-col items-end">
      <!-- Message Bubble -->
      <div class="px-4 py-3 shadow-sm text-white" style="background-color: #1e1b4b !important; color: white !important; border-radius: 20px;">
        {#if isLoading}
          <div class="flex items-center space-x-2 text-white">
            <div class="flex space-x-1">
              <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
            <span class="text-xs">typing...</span>
          </div>
        {:else}
          <p class="text-white text-sm whitespace-pre-wrap leading-relaxed" style="color: white !important;">{message.content}</p>
        {/if}
      </div>
      
    </div>
      <!-- Timestamp - Outside the bubble -->
      <span class="text-xs text-gray-400 mt-1 self-end text-right pr-1">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
  </div>
{:else}
  <!-- AI Message - Light grey bubble on the left -->
  <div class="flex justify-start mb-4 ai-message-bubble">
    <div class="max-w-[85%] flex flex-col items-start">
      <!-- AI Message Bubble -->
      <div class="px-4 py-3 shadow-sm bg-gray-200" style="border-radius: 20px;">
        {#if isLoading}
          <div class="flex items-center space-x-2 text-gray-900">
            <div class="flex space-x-1">
              <div class="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
            <span class="text-xs">typing...</span>
          </div>
        {:else}
          <p class="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        {/if}
      </div>
     
    </div>  
  </div>
   <!-- Timestamp - Outside the bubble -->
      <span class="text-xs text-gray-400 mt-1">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
{/if}

<style>
  .user-message-bubble div {
    background-color: #1e1b4b !important;
    color: white !important;
    margin-top:5px;
    margin-right:5px;
    margin-bottom:5px;
    border-radius:25px;
  }
  
  .user-message-bubble p {
    margin-left:5px;
    min-width:150px;
    text-align:center;
    color: white !important;
  }
  
  .ai-message-bubble div {
    background-color: #e5e7eb !important;
    margin-left:5px;
    min-height:0;
    min-width:150px;
    margin-bottom:5px;
    color: #111827 !important;
    border-radius:25px;
  }
  
  .ai-message-bubble p {
    color: #111827 !important;
    margin-left:5px;
  }
</style>
