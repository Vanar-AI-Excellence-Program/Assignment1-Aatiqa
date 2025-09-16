<script lang="ts">
  let isEditing = false;
  let name = "Admin User";
  let email = "admin@example.com";
  let password = "********";

  let tempName = name;
  let tempEmail = email;
  let tempPassword = password;

  function handleEdit() {
    isEditing = true;
    tempName = name;
    tempEmail = email;
    tempPassword = password;
  }

  function handleSave() {
    name = tempName;
    email = tempEmail;
    password = tempPassword;
    isEditing = false;
    // Here you would typically send the updated data to your backend
  }
</script>

<div >
  <div class="admin-profile-rectangle">
    <h1 class="admin-title">Admin Profile 👑</h1>
    <div class="admin-dialogue-box">
      <h2>Name</h2>
      {#if isEditing}
        <input class="admin-input-field" type="text" bind:value={tempName} />
      {:else}
        <p>{name}</p>
      {/if}
    </div>
    <div class="admin-dialogue-box">
      <h2>Email</h2>
      {#if isEditing}
        <input class="admin-input-field" type="email" bind:value={tempEmail} />
      {:else}
        <p>{email}</p>
      {/if}
    </div>
    <div class="admin-dialogue-box">
      <h2>Password</h2>
      {#if isEditing}
        <input class="admin-input-field" type="password" bind:value={tempPassword} />
      {:else}
        <p>{password}</p>
      {/if}
    </div>
    <button class="admin-edit-btn" on:click={isEditing ? handleSave : handleEdit}>
      {isEditing ? 'Save' : 'Edit'}
    </button>
  </div>
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
    /* Added border to the container */
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
    /* Center the container horizontally and vertically */
    margin: auto;
  }
  .admin-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
    color: #333;
    text-align: center;
  }
  .admin-dialogue-box {
    background: #f5f5f7;
    border-radius: 1rem;
    padding: 1.2rem 1rem 0.8rem 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    margin-bottom: 0;
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
    margin-top: 1.2rem;
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
  }
  .admin-edit-btn:hover {
    background: #4b2fcf;
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
