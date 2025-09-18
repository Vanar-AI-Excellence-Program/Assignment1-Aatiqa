<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  // Format date helper function
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get status badge class
  function getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }
</script>

<div class="users-container">
  <div class="users-header">
    <h1>Users Information</h1>
    <p class="users-subtitle">Manage and view all registered users</p>
  </div>

  <div class="users-stats">
    <div class="stat-card">
      <h3>Total Users</h3>
      <p class="stat-number">{data.users.length}</p>
    </div>
    <div class="stat-card">
      <h3>Active Users</h3>
      <p class="stat-number">{data.users.filter(user => user.status === 'active').length}</p>
    </div>
    <div class="stat-card">
      <h3>Inactive Users</h3>
      <p class="stat-number">{data.users.filter(user => user.status === 'inactive').length}</p>
    </div>
  </div>

  <div class="users-table-container">
    <table class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Joined Date</th>
        </tr>
      </thead>
      <tbody>
        {#each data.users as user}
          <tr>
            <td class="user-id">#{user.id}</td>
            <td class="user-name">{user.name}</td>
            <td class="user-email">{user.email}</td>
            <td class="user-status">
              <span class="status-badge {getStatusClass(user.status)}">
                {user.status}
              </span>
            </td>
            <td class="user-date">{formatDate(user.createdAt)}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if data.users.length === 0}
      <div class="no-users">
        <p>No users found in the database.</p>
      </div>
    {/if}
  </div>
</div>

<style>

  .users-container {
    width: 100%;
    height: 100%; /* Use full height of parent container */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevent whole page from scrolling */
    padding: 0; /* Remove padding since parent already has padding */
    position: relative; /* Ensure proper positioning context */
  }

  .users-header {
    text-align: center;
    margin-bottom: 30px;
    margin-top:0px;
    flex-shrink: 0; /* Don't shrink this section */
  }

  .users-header h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 10px;
  }

  .users-subtitle {
    color: #666;
    font-size: 1.1rem;
  }

  .users-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
    flex-shrink: 0; /* Don't shrink this section */
  }

  .stat-card {
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    text-align: center;
    border-left: 4px solid #6c47ff;
  }

  .stat-card h3 {
    margin: 0 0 15px 0;
    color: #666;
    font-size: 1rem;
    font-weight: 600;
  }

  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #6c47ff;
    margin: 0;
  }

  .users-table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border: 1px solid #e0e0e0;
    flex: 1; /* Take up remaining space */
    overflow-y: auto; /* Enable vertical scrolling */
    min-height: 0; /* Allow flex item to shrink below content size */
    max-height: 400px; /* Force a maximum height */
  }

  /* Custom scrollbar styling */
  .users-table-container::-webkit-scrollbar {
    width: 8px;
  }

  .users-table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .users-table-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  .users-table-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
  }

  .users-table th {
    background: #6c47ff;
    color: white;
    padding: 20px 15px;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .users-table td {
    padding: 18px 15px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: middle;
  }

  .users-table tbody tr:hover {
    background: #f8f9fa;
  }

  .user-id {
    font-weight: 600;
    color: #6c47ff;
  }

  .user-name {
    font-weight: 600;
    color: #333;
  }

  .user-email {
    color: #666;
  }

  .user-status {
    text-align: center;
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .status-active {
    background: #d4edda;
    color: #155724;
  }

  .status-inactive {
    background: #f8d7da;
    color: #721c24;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-default {
    background: #e2e3e5;
    color: #383d41;
  }

  .user-date {
    color: #666;
    font-size: 0.9rem;
  }

  .no-users {
    text-align: center;
    padding: 60px 20px;
    color: #666;
  }

  .no-users p {
    font-size: 1.1rem;
    margin: 0;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .users-container {
      padding: 0; /* Keep no padding, parent handles it */
      height: 100%; /* Use full height of parent */
    }

    .users-header {
      margin-bottom: 20px;
    }

    .users-header h1 {
      font-size: 2rem;
    }

    .users-stats {
      grid-template-columns: 1fr;
      margin-bottom: 20px;
    }

    .users-table-container {
      overflow-x: auto;
      overflow-y: auto;
    }

    .users-table {
      min-width: 600px;
    }

    .users-table th,
    .users-table td {
      padding: 12px 10px;
    }

    /* Mobile scrollbar styling */
    .users-table-container::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
  }
</style>