<script lang="ts">
  // Dummy data for users; in future, this will come from the database
  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
  };

  let users: User[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "User",
      status: "Active"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@example.com",
      role: "Moderator",
      status: "Inactive"
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      role: "User",
      status: "Active"
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana.prince@example.com",
      role: "Admin",
      status: "Active"
    }
  ];
</script>

<h2 class="all-users-heading"><b>All User Info</b></h2>
<div class="all-users-outer-scroll">
  <div class="users-grid">
    {#each users as user (user.id)}
      <div class="user-card">
        <h3 class="user-name">{user.name}</h3>
        <p class="user-email">{user.email}</p>
        <div class="user-meta">
          <span class="user-role">{user.role}</span>
          <span class="user-status {user.status === 'Active' ? 'active' : 'inactive'}">{user.status}</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .all-users-heading {
    text-align: center;
    font-weight: bold;
    font-size: 2rem;
    margin-top: 1.2rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.02em;
    color: #333;
  }
  .all-users-outer-scroll {
    max-height: 55vh;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: #b9aaff #ece9fc;
  }
  .all-users-outer-scroll::-webkit-scrollbar {
    width: 8px;
    background: #ece9fc;
    border-radius: 8px;
  }
  .all-users-outer-scroll::-webkit-scrollbar-thumb {
    background: #b9aaff;
    border-radius: 8px;
  }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
    width: 100%;
    margin: 0 auto;
    padding: 1.5rem 0;
    overflow: visible;
  }
  .user-card {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(0,0,0,0.08);
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7rem;
    transition: box-shadow 0.18s;
    border: 1.5px solid #ece9fc;
  }
  .user-card:hover {
    box-shadow: 0 8px 32px rgba(108,71,255,0.13);
    border-color: #b9aaff;
  }
  .user-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 0.2rem 0;
  }
  .user-email {
    font-size: 1rem;
    color: #6c47ff;
    margin: 0 0 0.5rem 0;
    word-break: break-all;
  }
  .user-meta {
    display: flex;
    gap: 1.2rem;
    align-items: center;
    margin-top: 0.3rem;
  }
  .user-role {
    background: #f5f5f7;
    color: #6c47ff;
    font-size: 0.98rem;
    padding: 0.25rem 0.7rem;
    border-radius: 0.5rem;
    font-weight: 500;
  }
  .user-status {
    font-size: 0.98rem;
    font-weight: 600;
    padding: 0.25rem 0.7rem;
    border-radius: 0.5rem;
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
  @media (max-width: 700px) {
    .all-users-outer-scroll {
      max-height: 60vh;
    }
    .users-grid {
      grid-template-columns: 1fr;
      gap: 1.2rem;
      padding: 0.7rem 0;
    }
    .user-card {
      padding: 1.2rem 1rem;
    }
  }
</style>
