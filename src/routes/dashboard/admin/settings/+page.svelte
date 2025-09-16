<script lang="ts">
  // Dummy data for users
  type User = {
    id: number;
    name: string;
    status: "Active" | "Inactive";
  };

  let users: User[] = [
    { id: 1, name: "Alice Johnson", status: "Active" },
    { id: 2, name: "Bob Smith", status: "Inactive" },
    { id: 3, name: "Charlie Brown", status: "Active" },
    { id: 4, name: "Diana Prince", status: "Inactive" }
  ];

  function setStatus(id: number, status: "Active" | "Inactive") {
    users = users.map(user =>
      user.id === id ? { ...user, status } : user
    );
  }
</script>

<h2 class="settings-heading"><b>User Status Management</b></h2>
<div class="settings-scroll-container">
  <div class="user-status-list">
    {#each users as user (user.id)}
      <div class="user-status-card">
        <span class="user-name">{user.name}</span>
        <div class="status-actions">
          <button
            class="status-btn activate"
            on:click={() => setStatus(user.id, "Active")}
            disabled={user.status === "Active"}
          >
            Activate
          </button>
          <button
            class="status-btn deactivate"
            on:click={() => setStatus(user.id, "Inactive")}
            disabled={user.status === "Inactive"}
          >
            Deactivate
          </button>
          <span class="user-status {user.status === 'Active' ? 'active' : 'inactive'}">
            {user.status}
          </span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .settings-heading {
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    margin-top: 1.2rem;
    margin-bottom: 1.5rem;
    letter-spacing: 0.02em;
    color: #333;
  }
  .settings-scroll-container {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    max-height: 55vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
    background: transparent;
    box-sizing: border-box;
    scrollbar-width: thin;
    scrollbar-color: #b9aaff #ece9fc;
  }
  .settings-scroll-container::-webkit-scrollbar {
    width: 8px;
    background: #ece9fc;
    border-radius: 8px;
  }
  .settings-scroll-container::-webkit-scrollbar-thumb {
    background: #b9aaff;
    border-radius: 8px;
  }
  .user-status-list {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: 1.5rem 0;
  }
  .user-status-card {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.08);
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    gap: 1.5rem;
  }
  .user-name {
    font-size: 1.15rem;
    font-weight: 600;
    color: #6c47ff;
    flex: 1;
    min-width: 0;
    word-break: break-all;
  }
  .status-actions {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  .status-btn {
    font-size: 1rem;
    font-weight: 500;
    padding: 0.35rem 1.1rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    outline: none;
  }
  .status-btn.activate {
    background: #e6fbe6;
    color: #1a7f1a;
    border: 1.5px solid #b6e6b6;
  }
  .status-btn.deactivate {
    background: #ffeaea;
    color: #c0392b;
    border: 1.5px solid #f5bcbc;
  }
  .status-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #f5f5f7;
    color: #aaa;
    border: 1.5px solid #ece9fc;
  }
  .user-status {
    font-size: 1rem;
    font-weight: 600;
    padding: 0.25rem 0.8rem;
    border-radius: 0.5rem;
    margin-left: 0.7rem;
    background: #e0e0e0;
    color: #444;
  }
  .user-status.active {
    background: #e6fbe6;
    color: #1a7f1a;
  }
  .user-status.inactive {
    background: #ffeaea;
    color: #c0392b;
  }
  @media (max-width: 600px) {
    .settings-scroll-container {
      max-width: 100vw;
      padding: 0 2vw 0 0;
    }
    .user-status-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.7rem;
      padding: 1rem 0.7rem;
    }
    .status-actions {
      gap: 0.5rem;
    }
  }
</style>
