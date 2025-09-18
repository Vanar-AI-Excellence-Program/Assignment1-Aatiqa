<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';

  export let data: PageData;
  export let form: ActionData;

  let loading = false;
  let updatingUserId: number | null = null;
  let showSuccessMessage = false;

  // Function to handle status update
  function handleStatusUpdate(userId: number, newStatus: string) {
    updatingUserId = userId;
    loading = true;
  }

  // Update local user status when form submission succeeds
  $: if (form?.success && form?.userId && form?.newStatus) {
    // Find and update the user in local data
    const userIndex = data.users.findIndex(user => user.id === form.userId);
    if (userIndex !== -1) {
      data.users[userIndex].status = form.newStatus;
    }
    loading = false;
    updatingUserId = null;
    
    // Show success message and hide it after 3 seconds
    showSuccessMessage = true;
    setTimeout(() => {
      showSuccessMessage = false;
    }, 3000);
  }

  // Reset loading state if there's an error
  $: if (form?.error) {
    loading = false;
    updatingUserId = null;
  }

  // Get status class for styling
  function getStatusClass(status: string) {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  // Get button class based on status and loading state
  function getButtonClass(userId: number, buttonType: 'activate' | 'deactivate') {
    const isLoading = updatingUserId === userId;
    if (buttonType === 'activate') {
      return isLoading ? 'btn-activate loading' : 'btn-activate';
    } else {
      return isLoading ? 'btn-deactivate loading' : 'btn-deactivate';
    }
  }
</script>

<div class="settings-container">
  <div class="settings-header">
    <h1>User Settings</h1>
    <p class="settings-subtitle">Manage user accounts and permissions</p>
  </div>

  <!-- Success/Error Messages -->
  {#if form?.success && showSuccessMessage}
    <div class="message success-message fade-in">
      <i class="icon">✓</i>
      {form.message}
    </div>
  {/if}

  {#if form?.error}
    <div class="message error-message">
      <i class="icon">⚠</i>
      {form.error}
    </div>
  {/if}

  <!-- User Status Management -->
  <div class="settings-section">
    <h2>User Status Management</h2>
    <p class="section-description">Activate or deactivate user accounts</p>

    <div class="users-grid">
      {#each data.users as user}
        <div class="user-card">
          <h3 class="user-name">{user.name}</h3>
          <span class="status-badge {getStatusClass(user.status)}">
            {user.status}
          </span>
          <div class="user-actions">
          
            <!-- Activate Button -->
            <form 
              method="POST" 
              action="?/updateUserStatus" 
              use:enhance={() => {
                handleStatusUpdate(user.id, 'active');
                return async ({ result, update }) => {
                  await update();
                };
              }}
              style="display: inline;"
            >
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value="active" />
              <button 
                type="submit" 
                class={getButtonClass(user.id, 'activate')}
                disabled={user.status === 'active' || updatingUserId === user.id}
              >
                {updatingUserId === user.id ? 'Updating...' : 'Activate'}
              </button>
            </form>

            <!-- Deactivate Button -->
            <form 
              method="POST" 
              action="?/updateUserStatus" 
              use:enhance={() => {
                handleStatusUpdate(user.id, 'inactive');
                return async ({ result, update }) => {
                  await update();
                };
              }}
              style="display: inline;"
            >
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="status" value="inactive" />
              <button 
                type="submit" 
                class={getButtonClass(user.id, 'deactivate')}
                disabled={user.status === 'inactive' || updatingUserId === user.id}
              >
                {updatingUserId === user.id ? 'Updating...' : 'Deactivate'}
              </button>
            </form>
          </div>
        </div>
      {/each}
    </div>

    {#if data.users.length === 0}
      <div class="no-users">
        <p>No users found in the system.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .settings-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    height: 100%; /* Use full height of parent */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevent whole page scrolling */
  }

  .settings-header {
    text-align: center;
    margin-bottom: 40px;
    flex-shrink: 0; /* Keep header fixed */
  }

  .settings-header h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 10px;
  }

  .settings-subtitle {
    color: #666;
    font-size: 1.1rem;
  }

  /* Message Styles */
  .message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    font-weight: 500;
    flex-shrink: 0; /* Keep messages fixed */
  }

  .success-message {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .icon {
    font-size: 1.2rem;
    font-weight: bold;
  }

  /* Fade-in animation for success message */
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Settings Section */
  .settings-section {
    background: white;
    border-radius: 12px;
    width:600px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 30px;
    flex: 1; /* Take remaining space */
    overflow-y: auto; /* Enable scrolling */
    min-height: 0; /* Allow flex item to shrink */
  }

  .settings-section h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 10px;
  }

  .section-description {
    color: #666;
    margin-bottom: 30px;
    font-size: 1rem;
  }

  /* Custom scrollbar for settings section */
  .settings-section::-webkit-scrollbar {
    width: 8px;
  }

  .settings-section::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .settings-section::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  .settings-section::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Users Grid */
  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .user-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 20px;
    align-items: center;
    transition: box-shadow 0.2s ease;
  }

  .user-card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }


  .user-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0;
    white-space: nowrap;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .status-active {
    background: #d4edda;
    color: #155724;
  }

  .status-inactive {
    background: #f8d7da;
    color: #721c24;
  }

  /* User Actions */
  .user-actions {
    display: flex;
    gap: 10px;
  }

  .btn-activate,
  .btn-deactivate {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 80px;
  }

  .btn-activate {
    background: #28a745;
    color: white;
  }

  .btn-activate:hover:not(:disabled) {
    background: #1e7e34;
  }

  .btn-activate:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .btn-deactivate {
    background: #dc3545;
    color: white;
  }

  .btn-deactivate:hover:not(:disabled) {
    background: #c82333;
  }

  .btn-deactivate:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .loading {
    opacity: 0.7;
    pointer-events: none;
  }

  /* No Users State */
  .no-users {
    text-align: center;
    padding: 60px 20px;
    color: #666;
  }

  .no-users p {
    font-size: 1.1rem;
    margin: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .settings-container {
      padding: 15px;
      height: 100%; /* Maintain full height on mobile */
    }

    .settings-header {
      margin-bottom: 20px;
    }

    .settings-header h1 {
      font-size: 2rem;
    }

    .settings-section {
      padding: 20px;
    }

    .users-grid {
      grid-template-columns: 1fr;
    }

    .user-card {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      gap: 15px;
      text-align: left;
    }

    .user-actions {
      justify-content: flex-start;
    }

    .btn-activate,
    .btn-deactivate {
      min-width: 70px;
      font-size: 0.8rem;
      padding: 6px 12px;
    }
  }
</style>