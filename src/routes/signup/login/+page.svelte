<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let form;
  let loading = false;
  let errorMessage = '';
  let showError = false;
  let showFormError = false;

  // Handle URL error parameters
  let errorTimer: ReturnType<typeof setTimeout> | null = null;
  
  onMount(() => {
    const error = $page.url.searchParams.get('error');
    const message = $page.url.searchParams.get('message');
    if (error) {
      errorMessage = getErrorMessage(error);
      showError = true;
      
      // Auto-hide error message after 2 seconds
      errorTimer = setTimeout(() => {
        showError = false;
        // Clear error message after fade animation completes
        setTimeout(() => {
          errorMessage = '';
          if (errorTimer) {
            clearTimeout(errorTimer);
            errorTimer = null;
          }
        }, 500); // Wait for fade animation to complete
      }, 2000);
    } else if (message) {
      errorMessage = message;
      showError = true;
      
      // Auto-hide message after 3 seconds for account deactivation
      errorTimer = setTimeout(() => {
        showError = false;
        setTimeout(() => {
          errorMessage = '';
          if (errorTimer) {
            clearTimeout(errorTimer);
            errorTimer = null;
          }
        }, 500);
      }, 3000);
    }
  });

  function getErrorMessage(error: string): string {
    switch (error) {
      case 'not_registered':
        return 'You are not registered. Please sign up first.';
      case 'account_inactive':
        return 'Your account is disabled. Please contact the admin.';
      case 'oauth_cancelled':
        return 'Google authentication was cancelled.';
      case 'oauth_failed':
        return 'Google authentication failed. Please try again.';
      case 'oauth_incomplete':
        return 'Google profile is incomplete. Please try again.';
      case 'github_cancelled':
        return 'GitHub authentication was cancelled.';
      case 'github_failed':
        return 'GitHub authentication failed. Please try again.';
      case 'github_incomplete':
        return 'GitHub profile is incomplete. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  // Auto-hide form error messages
  $: if (browser && form?.error) {
    showFormError = true;
    setTimeout(() => {
      showFormError = false;
    }, 2000);
  }
</script>

<div class="login-container">
  <div class="login-box">
    <h2 class="login-title">Sign In</h2>
    
    <!-- Error Messages -->
    {#if form?.error}
      <div class="error-message auto-hide" class:fade-out={!showFormError}>
        <p>{form.error}</p>
        {#if form?.showResendLink}
          <div class="resend-link-container">
            <a href="/auth/resend-verification" class="resend-link">
              📧 Resend Verification Email
            </a>
          </div>
        {/if}
      </div>
    {/if}
    
    {#if errorMessage}
      <div class="error-message auto-hide" class:fade-out={!showError}>
        <p>{errorMessage}</p>
      </div>
    {/if}
    
    {#if errorMessage}
      <div class="error-message auto-hide" class:fade-out={!showError}>
        <p>{errorMessage}</p>
      </div>
    {/if}

    <form 
      method="POST" 
      action="?/login" 
      class="login-form"
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          await update();
          loading = false;
        };
      }}
    >
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
        placeholder="Enter your password"
        autocomplete="current-password"
        required
      />

      <button class="login-btn" type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>

    <!-- Forgot Password Link -->
    <div class="forgot-password-link">
      <a href="/auth/forgot-password" class="forgot-link">Forgot your password?</a>
    </div>

    <!-- OAuth Login Options -->
    <div class="oauth-divider">
      <span>or</span>
    </div>

    <div class="oauth-buttons">
      <form method="POST" action="?/googleLogin" use:enhance>
        <button type="submit" class="oauth-btn google-btn">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </form>

      <form method="POST" action="?/githubLogin" use:enhance>
        <button type="submit" class="oauth-btn github-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Continue with GitHub
        </button>
      </form>
    </div>
    <div class="signup-link">
      Don't have an Account?&nbsp;
      <a href="/signup" class="signin-action">Sign Up</a>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/background.svg') no-repeat center center fixed;
    background-size: cover;
  }
  .login-box {
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
  .login-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color:#22223b;
    margin-bottom: 1.2rem;
    letter-spacing: 0.01em;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .login-form label {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.1rem;
  }
  .login-form input {
    padding: 0.5rem 0.8rem;
    border-radius: 0.5rem;
    border: 1.5px solid #bbb;
    font-size: 1rem;
    outline: none;
    background: #f9f8ff;
    transition: border 0.18s;
  }
  .login-form input:focus {
    border: 1.5px solid #6c47ff;
    background: #fff;
  }
  .login-btn {
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
  .login-btn:disabled {
    background: #b9aaff;
    cursor: not-allowed;
  }

  .forgot-password-link {
    text-align: center;
    margin-top: 1rem;
  }

  .forgot-link {
    color: #6c47ff;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.18s;
  }

  .forgot-link:hover {
    color: #4b2bb3;
    text-decoration: underline;
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

  .error-message p {
    margin: 0;
    margin-bottom: 0.2rem;
    text-align: center;
  }

  .auto-hide {
    opacity: 1;
    transition: opacity 0.5s ease-out;
  }

  .auto-hide.fade-out {
    opacity: 0;
  }

  .oauth-divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  .oauth-divider::before,
  .oauth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  .oauth-divider span {
    padding: 0 1rem;
    background: #fff;
  }

  .oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .oauth-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1.5px solid #ddd;
    background: #fff;
    color: #333;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    width: 100%;
  }

  .oauth-btn:hover {
    border-color: #bbb;
    background: #f8f9fa;
  }

  .google-btn:hover {
    border-color: #4285F4;
    background: #f8f9ff;
  }

  .github-btn:hover {
    border-color: #333;
    background: #f8f9fa;
  }
  .signup-link {
    margin-top: 1.1rem;
    text-align: center;
    font-size: 1rem;
    color: #22223b;
  }
  .signup-action {
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
  .signup-action:hover {
    color:#22223b;
    text-decoration: underline;
  }
  .resend-link-container {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #f5c6cb;
  }

  .resend-link {
    color: #0056b3;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 8px 16px;
    border: 2px solid #0056b3;
    border-radius: 5px;
    display: inline-block;
    transition: all 0.3s ease;
  }

  .resend-link:hover {
    background: #0056b3;
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 500px) {
    .login-box {
      min-width: 0;
      max-width: 98vw;
      padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    }
  }
</style>
