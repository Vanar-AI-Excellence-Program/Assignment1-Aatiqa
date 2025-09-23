<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let menuItems = [
    { name: "My Profile", path: "/dashboard/admin/" },
    { name: "Users Info", path: "/dashboard/admin/users" },
    { name: "Settings", path: "/dashboard/admin/settings" }
  ];

  let currentUserId: number | null = null;
  let isAuthenticated = false;

  // Check authentication status and detect user changes
  async function checkAuthStatus() {
    if (!browser) return;
    
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        const authData = await response.json();
        const newIsAuthenticated = authData.isAuthenticated;
        const newUserId = authData.userId || null;
        
        // Check if user has changed (different userId or authentication status changed)
        const userChanged = (currentUserId !== newUserId) || (isAuthenticated !== newIsAuthenticated);
        
        // If user changed or not authenticated, redirect to login
        if (!newIsAuthenticated) {
          goto('/signup/login');
          return;
        }
        
        // If user changed (different admin logged in), reload the page to clear cached data
        if (userChanged && currentUserId !== null) {
          window.location.reload();
          return;
        }
        
        // Update current state
        isAuthenticated = newIsAuthenticated;
        currentUserId = newUserId;
      } else {
        // Auth check failed, redirect to login
        goto('/signup/login');
      }
    } catch (err) {
      console.error('Failed to check auth status:', err);
      // On error, redirect to login
      goto('/signup/login');
    }
  }

  // Initial auth check and periodic monitoring
  onMount(() => {
    checkAuthStatus();
    
    // Check auth status every 30 seconds to detect user changes
    const interval = setInterval(checkAuthStatus, 30000);
    
    return () => clearInterval(interval);
  });
</script>

<style>
  .admin-layout-container {
    height: calc(85vh - 104px); /* Full height minus navbar (64px) and footer space (40px) */
    margin-top: 64px; /* height of navbar */
    width: 100vw;
    max-width: 1200px; /* scale width, adjust as needed */
    margin-left: auto;
    margin-right: auto;
    display: flex;
    background: transparent;
    box-sizing: border-box;
    overflow: hidden; /* Prevent scrolling at layout level */
   
  }
  @media (max-width: 1300px) {
    .admin-layout-container {
      max-width: 100vw;
    }
  }
  .admin-sidebar {
    width: 256px;
    min-width: 200px;
    background: #22223b;
    color: #fff;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    border-radius: 1.2rem 0 0 1.2rem;
    box-shadow: 2px 0 12px rgba(0,0,0,0.07);
  }
  .admin-sidebar h2 {
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: #f7fafc;
    letter-spacing: 0.01em;
  }
  .admin-sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 1.2rem;
    display: flex;
    flex-direction: column;
  }
  .admin-sidebar a {
    color: #e0e0e0;
    text-decoration: none;
    font-size: 1.08rem;
    font-weight: 500;
    padding: 0.5rem 0.7rem;
    border-radius: 0.5rem;
    transition: background 0.15s, color 0.15s;
    display: block;
  }
  .admin-sidebar a:hover {
    color: #ffd600;
    background: #38385a;
  }
  .admin-main-content {
    flex: 1;
    padding: 2.5rem 2rem;
    background: #f5f5f7;
    border-radius: 0 1.2rem 1.2rem 0;
    min-width: 0;
    overflow: hidden; /* Prevent overflow in main content */
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 900px) {
    .admin-layout-container {
      flex-direction: column;
      height: calc(100vh - 84px); /* Maintain fixed height on mobile */
      margin-top: 56px;
      max-width: 100vw;
      overflow: hidden; /* Ensure no scrolling on mobile */
    }
    .admin-sidebar {
      width: 100vw;
      min-width: unset;
      border-radius: 0;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 2rem;
      padding: 1.2rem 0.7rem;
      box-shadow: none;
    }
    .admin-sidebar h2 {
      display: none;
    }
    .admin-sidebar ul {
      flex-direction: row;
      gap: 1.2rem;
    }
    .admin-main-content {
      border-radius: 0;
      padding: 1.2rem 0.5rem;
    }
  }
</style>

<div class="admin-layout-container">
  <!-- Sidebar -->
  <aside class="admin-sidebar">
    <h2>Admin Dashboard</h2>
    <ul>
      {#each menuItems as item}
        <li>
          <a href={item.path}>
            {item.name}
          </a>
        </li>
      {/each}
    </ul>
  </aside>

  <!-- Main content -->
  <main class="admin-main-content">
    <slot /> <!-- Admin pages will render here -->
  </main>
</div>
