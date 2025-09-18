<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';

  export let data: PageData;
  export let form: ActionData;

  let isEditing = false;
  let loading = false;
  let showMessage = false;
  
  // Get user data from server
  let name = data.user.name;
  let email = data.user.email;
  let password = "********"; // Always show asterisks for security
  let joinedDate = new Date(data.user.createdAt).toLocaleDateString();
  let status = data.user.status;

  let tempName = name;
  let tempEmail = email;
  let tempPassword = "";

  function handleEdit() {
    isEditing = true;
    tempName = name;
    tempEmail = email;
    tempPassword = ""; // Clear password field for new input
  }

  function handleCancel() {
    isEditing = false;
    tempName = name;
    tempEmail = email;
    tempPassword = "";
  }

  // Update local state when form submission succeeds
  // Auto-hide success/error messages after 2 seconds
  $: if (browser && (form?.success || form?.error)) {
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 2000);
  }

  $: if (form?.success) {
    name = tempName;
    email = tempEmail;
    isEditing = false;
    loading = false;
  }

  // Reset loading state if there's an error
  $: if (form?.error) {
    loading = false;
  }

  // Get status class for styling
  function getStatusClass(status: string) {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }
</script>

<div class="center-container">
  <div class="profile-rectangle">
    <!-- Success/Error Messages -->
    {#if form?.success && showMessage}
      <div class="message success-message auto-hide" class:fade-out={!showMessage}>
        <i class="icon">✓</i>
        {form.message}
      </div>
    {/if}

    {#if form?.error && showMessage}
      <div class="message error-message auto-hide" class:fade-out={!showMessage}>
        <i class="icon">⚠</i>
        {form.error}
      </div>
    {/if}
    <div class="dashboard-header">
      <h1>User Profile</h1>
      <a href="/logout" class="logout-btn">Logout</a>
    </div>

    <form method="POST" action="?/updateProfile" use:enhance={() => {
      loading = true;
      return async ({ result, update }) => {
        await update();
      };
    }}>
      <div class="dialogue-box">
        <h2>Name</h2>
        {#if isEditing}
          <input class="input-field" type="text" name="name" bind:value={tempName} required />
        {:else}
          <p>{name}</p>
        {/if}
      </div>
      <div class="dialogue-box">
        <h2>Email</h2>
        {#if isEditing}
          <input class="input-field" type="email" name="email" bind:value={tempEmail} required />
        {:else}
          <p>{email}</p>
        {/if}
      </div>
      <div class="dialogue-box">
        <h2>Password</h2>
        {#if isEditing}
          <input 
            class="input-field" 
            type="password" 
            name="password"
            bind:value={tempPassword}
            placeholder="Enter new password (leave empty to keep current)"
            autocomplete="new-password"
          />
        {:else}
          <p>{password}</p>
        {/if}
      </div>
    <div class="dialogue-box">
      <h2>Status</h2>
      <p>
        <span class="status-badge {getStatusClass(status)}">
          {status}
        </span>
      </p>
    </div>
    <div class="dialogue-box">
      <h2>Member Since</h2>
      <p>{joinedDate}</p>
    </div>
      
      {#if isEditing}
        <div class="button-group">
          <button type="submit" class="edit-btn save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" class="edit-btn cancel-btn" on:click={handleCancel}>
            Cancel
          </button>
        </div>
      {:else}
        <button type="button" class="edit-btn" on:click={handleEdit}>
          Edit
        </button>
      {/if}
    </form>
  </div>
</div>

<style>
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h1 {
    text-align: center;
    color: rgb(36, 30, 59);
    margin: 0;
    flex: 1;
  }

  .logout-btn {
    background: #dc3545;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s;
    border: none;
    cursor: pointer;
  }

  .logout-btn:hover {
    background: #c82333;
  }
  .center-container {
    min-height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    background: url('/background.svg') ;
    overflow: hidden;
   
  }
  .profile-rectangle {
    background: #fff;
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    padding: 2.5rem 2rem 2rem 2rem;
    min-width: 380px;
    max-width: 440px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  .dialogue-box {
    background: #f5f5f7;
    border-radius: 1rem;
    padding: 1.2rem 1rem 0.8rem 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .dialogue-box h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.2rem 0;
    color: #333;
  }
  .dialogue-box p {
    margin: 0;
    color: #444;
    font-size: 1rem;
    word-break: break-all;
  }
  .input-field {
    padding: 0.5rem 0.7rem;
    border-radius: 0.5rem;
    border: 1px solid #bbb;
    font-size: 1rem;
    outline: none;
    background: #fff;
    color: #222;
    margin-top: 0.1rem;
  }
  .edit-btn {
    width:300px;
    margin-top: 1.2rem;
    padding: 0.7rem 0;
    border: none;
    border-radius: 0.7rem;
    background: #22223b;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
    letter-spacing: 0.03em;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .edit-btn:hover {
    background: rgb(50, 50, 87);
  }

  .edit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Message Styles */
  .message {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 0.9rem;
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

  .auto-hide {
    transition: opacity 0.3s ease-out;
  }

  .fade-out {
    opacity: 0;
  }

  .icon {
    font-size: 1rem;
    font-weight: bold;
  }

  /* Status Badge */
  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .status-active {
    background: #d4edda;
    color: #155724;
  }

  .status-inactive {
    background: #f8d7da;
    color: #721c24;
  }

  /* Button Group */
  .button-group {
    display: flex;
    gap: 0.8rem;
    margin-top: 1.2rem;
  }

  .save-btn {
    background: #28a745;
    flex: 1;
  }

  .save-btn:hover {
    background: #1e7e34;
  }

  .cancel-btn {
    background: #6c757d;
    flex: 1;
  }

  .cancel-btn:hover {
    background: #545b62;
  }
</style>
