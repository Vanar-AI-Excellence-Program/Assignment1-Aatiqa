<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  export let form;

  let loading = false;
  let successMessage = '';
  let redirectTimer: ReturnType<typeof setTimeout> | null = null;
  let showUserExistsError = false;
  let showOAuthError = false;

  // Check for various error types from URL params
  $: accountInactiveError = $page.url.searchParams.get('error') === 'account_inactive';
  $: userExistsError = $page.url.searchParams.get('error') === 'user_already_exists';
  $: oauthError = $page.url.searchParams.get('error')?.startsWith('oauth_') || $page.url.searchParams.get('error')?.startsWith('github_');
  $: oauthErrorMessage = getOAuthErrorMessage($page.url.searchParams.get('error'));

  function getOAuthErrorMessage(error: string | null): string {
    switch (error) {
      case 'oauth_failed':
        return 'Google signup failed. Please try again.';
      case 'oauth_cancelled':
        return 'Google signup was cancelled. Please try again.';
      case 'oauth_incomplete':
        return 'Google signup incomplete. Please ensure you grant all required permissions.';
      case 'github_failed':
        return 'GitHub signup failed. Please try again.';
      case 'github_cancelled':
        return 'GitHub signup was cancelled. Please try again.';
      case 'github_incomplete':
        return 'GitHub signup incomplete. Please ensure you grant all required permissions.';
      default:
        return '';
    }
  }

  // Handle auto-hide for "user already exists" error
  $: if (browser && userExistsError) {
    showUserExistsError = true;
    setTimeout(() => {
      showUserExistsError = false;
    }, 2000);
  }

  // Handle OAuth error highlighting
  let oauthTimer: ReturnType<typeof setTimeout> | null = null;
  
  // Highlight Google button when OAuth error occurs
  $: if (browser && oauthError && oauthErrorMessage && oauthErrorMessage.trim() !== '') {
    showOAuthError = true;
    
    // Clear any existing timer
    if (oauthTimer) {
      clearTimeout(oauthTimer);
    }
    
    // Stop highlighting after 5 seconds
    oauthTimer = setTimeout(() => {
      showOAuthError = false;
      oauthTimer = null;
    }, 5000);
  }

  // Ensure redirect to dashboard after successful signup
  $: if (browser && form?.success && form?.shouldRedirect) {
    // Clearing previous timer to avoid multiple redirects
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    
    successMessage = 'Account created successfully! Redirecting to dashboard...';
    redirectTimer = setTimeout(() => {
      goto('/dashboard/user');
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

      {#if userExistsError && showUserExistsError}
        <div class="error-message auto-hide" class:fade-out={!showUserExistsError}>
          <p>User already exists. Please sign in instead.</p>
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

      <!-- Divider -->
      <div class="divider">
        <span>or</span>
      </div>

      <!-- OAuth Signup Options -->
      <div class="oauth-container">
        <!-- Google OAuth Signup -->
        <form method="POST" action="?/googleSignup" class="oauth-form">
          <button type="submit" class="google-btn" class:highlight-google={showOAuthError && oauthError} disabled={loading}>
            <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <!-- GitHub OAuth Signup -->
        <form method="POST" action="?/githubSignup" class="oauth-form">
          <button type="submit" class="github-btn" disabled={loading}>
            <svg class="github-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </form>
      </div>
    {/if}
    <div class="signin-link">
      Already have an Account?&nbsp;
      <a href="/signup/login" class="signin-action">Sign In</a>
    </div>
  </div>
</div>

<style>
  .signup-container {
    min-height: 85vh;
    display: flex;
    align-items: center;
    justify-content: center;
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

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    color: #666;
    font-size: 0.9rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  .divider span {
    padding: 0 15px;
    background: white;
  }

  /* OAuth Container */
  .oauth-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }

  .oauth-form {
    margin: 0;
  }

  /* Google OAuth Button */
  .google-btn {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #dadce0;
    border-radius: 8px;
    background: white;
    color: #3c4043;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.2s ease;
  }

  .google-btn:hover:not(:disabled) {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-color: #c0c4c7;
  }

  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Highlight Google button when OAuth error occurs */
  .google-btn.highlight-google {
    border-color: #4285F4;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
    animation: subtle-pulse 2s ease-in-out infinite;
  }

  @keyframes subtle-pulse {
    0%, 100% { 
      box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
    }
    50% { 
      box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.4);
    }
  }

  .google-icon {
    flex-shrink: 0;
  }

  /* GitHub OAuth Button */
  .github-btn {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #30363d;
    border-radius: 8px;
    background: #24292f;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.2s ease;
  }

  .github-btn:hover:not(:disabled) {
    background: #32383f;
    border-color: #444c56;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .github-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .github-icon {
    flex-shrink: 0;
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

  .auto-hide {
    opacity: 1;
    transition: opacity 0.5s ease-out;
  }

  .auto-hide.fade-out {
    opacity: 0;
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
