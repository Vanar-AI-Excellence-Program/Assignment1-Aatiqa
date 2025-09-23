<script lang="ts">
  export let message: {
    role: 'user' | 'assistant';
    content: string;
    id?: number;
  };
  export let isLoading: boolean = false;
  export let canFork: boolean = false;
  export let onFork: ((messageId: number, branchName?: string) => Promise<void>) | null = null;

  let showForkPrompt = false;
  let branchName = '';

  async function handleFork() {
    if (!onFork || !message.id) return;
    
    if (branchName.trim()) {
      await onFork(message.id, branchName.trim());
      showForkPrompt = false;
      branchName = '';
    } else {
      await onFork(message.id);
      showForkPrompt = false;
    }
  }

  function cancelFork() {
    showForkPrompt = false;
    branchName = '';
  }
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
      
      <!-- Fork Button -->
      {#if canFork && !isLoading}
        <div class="flex items-center gap-2 mt-2">
          <button 
            class="fork-button"
            on:click={() => showForkPrompt = true}
            title="Fork conversation from this point"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Fork
          </button>
          
          <!-- Timestamp -->
          <span class="text-xs text-gray-400">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      {:else if !canFork}
        <!-- Timestamp - Outside the bubble -->
        <span class="text-xs text-gray-400 mt-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      {/if}
     
    </div>  
  </div>

  <!-- Fork Prompt Modal -->
  {#if showForkPrompt}
    <div class="fork-modal-overlay" on:click={cancelFork}>
      <div class="fork-modal" on:click|stopPropagation>
        <h4 class="fork-modal-title">Create New Branch</h4>
        <p class="fork-modal-description">Fork the conversation from this message to explore different paths.</p>
        
        <div class="fork-input-group">
          <label for="branch-name">Branch Name (Optional):</label>
          <input 
            id="branch-name"
            type="text" 
            bind:value={branchName}
            placeholder="Enter branch name..."
            class="fork-input"
          />
        </div>
        
        <div class="fork-modal-actions">
          <button class="fork-cancel-btn" on:click={cancelFork}>Cancel</button>
          <button class="fork-confirm-btn" on:click={handleFork}>Create Branch</button>
        </div>
      </div>
    </div>
  {/if}
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

  .fork-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    color: #6b7280;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fork-button:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .fork-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
  }

  .fork-modal {
    background: white;
    border-radius: 12px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  }

  .fork-modal-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #1f2937;
  }

  .fork-modal-description {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 16px 0;
  }

  .fork-input-group {
    margin-bottom: 20px;
  }

  .fork-input-group label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 4px;
  }

  .fork-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .fork-input:focus {
    border-color: #3b82f6;
  }

  .fork-modal-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .fork-cancel-btn, .fork-confirm-btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fork-cancel-btn {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .fork-cancel-btn:hover {
    background: #e5e7eb;
  }

  .fork-confirm-btn {
    background: #3b82f6;
    color: white;
    border: 1px solid #3b82f6;
  }

  .fork-confirm-btn:hover {
    background: #2563eb;
  }
</style>
