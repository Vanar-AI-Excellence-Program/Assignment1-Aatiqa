<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  
  export let form;

  let loading = false;
  let successMessage = '';
  let redirectTimer: ReturnType<typeof setTimeout> | null = null;

  // Check for account inactive error from URL params
  $: accountInactiveError = $page.url.searchParams.get('error') === 'account_inactive';

  // Use the correct path for login page (no trailing slash)
  function goToSignIn() {
    console.log('goToSignIn called, navigating to /signup/login');
    goto('/signup/login');
  }

  // Ensure redirect to dashboard after successful signup
  $: if (browser && form?.success && form?.shouldRedirect) {
    // Clear any previous timer to avoid multiple redirects
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    redirectTimer = setTimeout(() => {
      window.location.href = '/dashboard/user';
    }, 2000);
  }
</script>

<div class="signup-container">
  <div class="signup-box">
    <h2 class="signup-title">Sign Up</h2>
    
    <!-- Success Message -->
    {#if form?.success}
      <div class="success-message">
        <p>{form.message}</p>
        {#if form.shouldRedirect}
          <!-- Show loading indicator while redirecting -->
          <div class="redirect-loading">
            <div class="spinner"></div>
            <p>Taking you to your dashboard...</p>
          </div>
        {:else}
          <button type="button" on:click={goToSignIn} class="login-link-btn">
            Go to Login
          </button>
        {/if}
      </div>
    {:else}
      <!-- Error Message -->
      {#if form?.error}
        <div class="error-message">
          <p>{form.error}</p>
        </div>
      {/if}

      {#if accountInactiveError}
        <div class="error-message">
          <p>Your account has been deactivated. Please contact support for assistance.</p>
        </div>
      {/if}

      <form 
        method="POST" 
        action="?/signup" 
        class="signup-form"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
      >
        <label for="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form?.name ?? ''}
          placeholder="Enter your name"
          autocomplete="name"
          required
        />

        <label for="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form?.email ?? ''}
          placeholder="Enter your email"
          autocomplete="email"
          required
        />

        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password (min 6 characters)"
          autocomplete="new-password"
          required
        />

        <button class="signup-btn" type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    {/if}
    <div class="signin-link">
      Already have an Account?&nbsp;
      <a href="/signup/login" class="signin-action">Sign In</a>
    </div>
  </div>
</div>

<style>
  .signup-container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Set the background image from assets/background.jpg (adjust path as needed) */
    background: url('/background.svg') no-repeat center center fixed;
    background-size: cover;
  }
  .signup-box {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(108,71,255,0.08);
    padding: 2.5rem 2rem 2rem 2rem;
    min-width: 340px;
    max-width: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.2rem;
  }
  .signup-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: #22223b;
    margin-bottom: 1.2rem;
    letter-spacing: 0.01em;
  }
  .signup-form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .signup-form label {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.1rem;
  }
  .signup-form input {
    padding: 0.5rem 0.8rem;
    border-radius: 0.5rem;
    border: 1.5px solid #bbb;
    font-size: 1rem;
    outline: none;
    background: #f9f8ff;
    transition: border 0.18s;
  }
  .signup-form input:focus {
    border: 1.5px solid #6c47ff;
    background: #fff;
  }
  .signup-btn {
    margin-top: 0.7rem;
    padding: 0.6rem 0;
    border-radius: 0.5rem;
    border: none;
    background: #22223b;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }
  .signup-btn:disabled {
   background:rgb(46, 46, 82);
    cursor: not-allowed;
  }

  .error-message {
    color: #c0392b;
    background: #ffeaea;
    border: 1px solid #f5b7b1;
    border-radius: 0.4rem;
    padding: 0.8rem;
    font-size: 0.98rem;
    margin-bottom: 1rem;
  }

  .success-message {
    color: #27ae60;
    background: #eafaf1;
    border: 1px solid #a9dfbf;
    border-radius: 0.4rem;
    padding: 1rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .success-message p {
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .login-link-btn {
   background: #22223b;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 0.4rem;
    cursor: pointer;
    font-size: 0.95rem;
    transition: background-color 0.3s ease;
  }

  .login-link-btn:hover {
   background: #22223b;
    margin-bottom: 0.2rem;
    text-align: center;
  }

  .redirect-loading {
    text-align: center;
    margin-top: 1rem;
  }

  .redirect-loading p {
    color: #27ae60;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #27ae60;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .signin-link {
    margin-top: 1.1rem;
    text-align: center;
    font-size: 1rem;
    color: #444;
  }
  .signin-action {
    color: #6c47ff;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.18s;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
  }
  .signin-action:hover {
    color: #4b2bb3;
    text-decoration: underline;
  }
  @media (max-width: 500px) {
    .signup-box {
      min-width: 0;
      max-width: 98vw;
      padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    }
  }
</style>
