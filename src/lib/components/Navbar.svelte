<script lang="ts">
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  // Helper to check if we're on the home page
  const isHome = derived(page, $page => $page.url.pathname === '/');
</script>

<nav class="navbar">
  <div class="navbar-content">
    <div class="app-name">
      <img src="/src/lib/assets/safesign.svg" alt="App Logo" class="app-logo" />
      <span class="app-title">Auth-App</span>
     
    </div>
    <ul>
      <li class="nav-icon">
        <a href="/" class={$page.url.pathname === '/' ? 'active' : ''}>
          <img src="/src/lib/assets/home.svg" alt="Home" class="icon-img" />
          {#if $isHome}
            <span class="icon-label neon-purple icon-label-visible">Home</span>
          {:else}
            <span class="icon-label neon-purple">Home</span>
          {/if}
        </a>
      </li>
      <li class="nav-icon">
        <a href="/dashboard/user" class={$page.url.pathname.startsWith('/dashboard') ? 'active' : ''}>
          <img src="/src/lib/assets/dashboard.svg" alt="Dashboard" class="icon-img" />
          {#if $page.url.pathname.startsWith('/dashboard')}
            <span class="icon-label neon-purple icon-label-visible">Dashboard</span>
          {:else}
            <span class="icon-label neon-purple">Dashboard</span>
          {/if}
        </a>
      </li>
      <li class="nav-icon">
        <a href="/signup" class={$page.url.pathname === '/signup' ? 'active' : ''}>
          <img src="/src/lib/assets/signup.svg" alt="Signup" class="icon-img" />
          {#if $page.url.pathname === '/signup'}
            <span class="icon-label neon-purple icon-label-visible">Signup</span>
          {:else}
            <span class="icon-label neon-purple">Signup</span>
          {/if}
        </a>
      </li>
    </ul>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    min-width: 100vw;
    z-index: 1000;
    background: #333;
    padding: 0.5rem 0;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding-left: 1.2rem;
    padding-right: 2rem;
  }
  .app-name {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 2.3rem;
    font-weight: bold;
    letter-spacing: 1px;
    margin-left: 0;
    position: relative;
  }
  .app-logo {
    width: 2cm;
    height: 2cm;
    border-radius: 50%;
    object-fit: cover;
    background: white;
    margin-left: 0;
    margin-right: 0.5em;
  }
  .app-title {
    margin-left: 0;
    margin-right: 1px;
  }
  .logo-label.neon-purple {
    color: rgb(145, 138, 146);
    text-shadow: 0 0 5px rgb(145, 138, 146), 0 0 10px rgb(145, 138, 146), 0 0 20px rgb(145, 138, 146);
    margin-left: 0.7em;
    font-size: 1rem;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
  }
  .logo-label-visible {
    opacity: 1 !important;
    pointer-events: auto !important;
    position: static;
    margin-left: 0.7em;
    transform: none;
  }
  .app-name:hover .logo-label-hover,
  .app-name:focus-within .logo-label-hover {
    opacity: 1;
    pointer-events: auto;
  }
  .logo-label-hover {
    /* Only show on hover if not home */
    opacity: 0;
    pointer-events: none;
  }
  ul {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    margin: 0;
    padding: 0;
  }
  .nav-icon {
    display: flex;
    align-items: center;
    position: relative;
  }
  a {
    color: white;
    text-decoration: none;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.2em 0.5em;
    transition: color 0.2s;
  }
  a.active {
    font-weight: bold;
    border-bottom: 2px solid yellow;
  }
  .icon-img {
    width: 32px;
    height: 32px;
  }
  .icon-label.neon-purple {
    color: rgb(145, 138, 146);
    text-shadow: 0 0 5px rgb(145, 138, 146), 0 0 10px rgb(145, 138, 146), 0 0 20px rgb(145, 138, 146);
    margin-top: 0.3em;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
    font-size: 1rem;
    font-weight: 500;
  }
  .icon-label-visible {
    opacity: 1 !important;
    pointer-events: auto !important;
  }
  .nav-icon:hover .icon-label.neon-purple:not(.icon-label-visible),
  .nav-icon:focus-within .icon-label.neon-purple:not(.icon-label-visible) {
    opacity: 1;
    pointer-events: auto;
  }

  @media (max-width: 900px) {
    .navbar-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      padding-left: 0.7rem;
      padding-right: 0.7rem;
    }
    .app-name {
      font-size: 1.5rem;
    }
    .app-logo {
      width: 1.2cm;
      height: 1.2cm;
      margin-right: 0.4em;
    }
    ul {
      gap: 0.7rem;
    }
    .icon-img {
      width: 24px;
      height: 24px;
    }
  }

  :global(body) {
    padding-top: 4.5rem;
  }
</style>
