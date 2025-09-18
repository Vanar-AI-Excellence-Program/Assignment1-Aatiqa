<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';

  export let data: PageData;
  export let form: ActionData;

  let isEditing = false;
  let loading = false;
  let showMessage = false;
  

  // Current values
  let name = data.admin.name;
  let email = data.admin.email;
  let password = "********"; // Always show placeholder for password
  let joinedDate = new Date(data.admin.createdAt).toLocaleDateString();

  // Temp values for editing
  let tempName = name;
  let tempEmail = email;
  let tempPassword=password;

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


  // Auto-hide success/error messages after 2 seconds
  $: if (browser && (form?.success || form?.error)) {
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    }, 2000);
  }

  // When server form returns success
  $: if (form?.success) {
    name = tempName;
    email = tempEmail;
    isEditing = false;
  }
</script>

<div class="admin-profile-rectangle">
  <div class="admin-header">
    <h1 class="admin-title">Admin Profile 👑</h1>
    <a href="/logout" class="logout-btn">Logout</a>
  </div>

  {#if form?.success && showMessage}
    <div class="success-message auto-hide" class:fade-out={!showMessage}>
      <p>{form.message}</p>
    </div>
  {/if}
  {#if form?.error && showMessage}
    <div class="error-message auto-hide" class:fade-out={!showMessage}>
      <p>{form.error}</p>
    </div>
  {/if}

  <form
    method="POST"
    action="?/updateProfile"
    use:enhance={() => {
      loading = true;
      return async ({ update }) => {
        await update();
        loading = false;
      };
    }}
  >
    <div class="admin-dialogue-box">
      <h2>Name</h2>
      {#if isEditing}
        <input class="admin-input-field" type="text" name="name" bind:value={tempName} required />
      {:else}
        <p>{name}</p>
      {/if}
    </div>

    <div class="admin-dialogue-box">
      <h2>Email</h2>
      {#if isEditing}
        <input class="admin-input-field" type="email" name="email" bind:value={tempEmail} required />
      {:else}
        <p>{email}</p>
      {/if}
    </div>

     <div class="admin-dialogue-box">
       <h2>Password</h2>
       {#if isEditing}
         <input
           class="admin-input-field" 
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

    {#if isEditing}
      <div class="button-group">
        <button type="submit" class="admin-edit-btn save-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" class="admin-edit-btn cancel-btn" on:click={handleCancel}>
          Cancel
        </button>
      </div>
    {/if}
  </form>

  {#if !isEditing}
    <button 
      type="button" 
      class="admin-edit-btn" 
      on:click={() => {
        isEditing = true;
        tempName = name;
        tempEmail = email;
        tempPassword = "";
      }}
    >
      Edit
    </button>
  {/if}
</div>


<style>
  .admin-dashboard-container {
    min-height: 65vh;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 0;
    margin-right: 0;
    background: transparent;
    overflow: hidden;
    width: 100%;
    max-width: 100vw;
    border: 2px solid #6c47ff;
    box-sizing: border-box;
  }
  .admin-profile-rectangle {
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
    margin: auto;
  }
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;
  }

  .admin-title {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #333;
    flex: 1;
    text-align: center;
  }

  .logout-btn {
    background: #dc3545;
    color: white;
    padding: 10px 18px;
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
  .admin-dialogue-box {
    background: #f5f5f7;
    border-radius: 1rem;
    border: 1px solid rgba(34, 21, 21, 0.04);
    padding: 1.2rem 1rem 0.8rem 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .admin-dialogue-box h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.2rem 0;
    color: #333;
  }
  .admin-dialogue-box p {
    margin: 0;
    color: #444;
    font-size: 1rem;
    word-break: break-all;
  }
  .admin-input-field {
    padding: 0.5rem 0.7rem;
    border-radius: 0.5rem;
    border: 1px solid #bbb;
    font-size: 1rem;
    outline: none;
    background: #fff;
    color: #222;
    margin-top: 0.1rem;
  }
  .admin-edit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.2rem auto 0 auto;
    padding: 0.7rem 0;
    border: none;
    border-radius: 0.7rem;
    background: #6c47ff;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
    letter-spacing: 0.03em;
    text-align: center;
    width: 60%; 
  }
  .admin-edit-btn:hover {
    background: #4b2fcf;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .save-btn {
    background: #28a745;
  }

  .save-btn:hover {
    background: #218838;
  }

  .save-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .cancel-btn {
    background: #6c757d;
  }

  .cancel-btn:hover {
    background: #545b62;
  }

  .success-message {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: 0.5rem;
    padding: 0.8rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 0.5rem;
    padding: 0.8rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .auto-hide {
    transition: opacity 0.3s ease-out;
  }

  .fade-out {
    opacity: 0;
  }
  @media (max-width: 900px) {
    .admin-dashboard-container {
      margin-left: 0;
      justify-content: center;
      width: 100vw;
      max-width: 100vw;
    }
    .admin-profile-rectangle {
      min-width: 100vw;
      max-width: 100vw;
      width: 100vw;
    }
  }
</style>
