<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let form;
  let loading = false;
  let showMessage = false;
  let messageTimer: ReturnType<typeof setTimeout> | null = null;

  // Handle success/error messages
  $: if (browser && form?.success) {
    showMessage = true;
    if (messageTimer) {
      clearTimeout(messageTimer);
    }
    messageTimer = setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  $: if (browser && form?.error) {
    showMessage = true;
    if (messageTimer) {
      clearTimeout(messageTimer);
    }
    messageTimer = setTimeout(() => {
      showMessage = false;
    }, 5000);
  }

  onMount(() => {
    return () => {
      if (messageTimer) {
        clearTimeout(messageTimer);
      }
    };
  });
</script>

<div class="forgot-password-container">
  <div class="forgot-password-box">
    <div class="header">
      <h2 class="title">🔒 Forgot Password?</h2>
      <p class="subtitle">No worries! Enter your email and we'll send you a reset link.</p>
    </div>
    
    <!-- Success Message -->
    {#if form?.success}
      <div class="success-message" class:fade-out={!showMessage}>
        <div class="success-icon">✅</div>
        <p>{form.message}</p>
        <div class="back-to-login">
          <a href="/signup/login" class="login-link">← Back to Login</a>
        </div>
      </div>
    {:else}
      <!-- Error Message -->
      {#if form?.error}
        <div class="error-message" class:fade-out={!showMessage}>
          <div class="error-icon">⚠️</div>
          <p>{form.error}</p>
        </div>
      {/if}

      <form 
        method="POST" 
        action="?/requestReset" 
        class="forgot-password-form"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
      >
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form?.email ?? ''}
            placeholder="Enter your email address"
            autocomplete="email"
            required
            disabled={loading}
          />
        </div>

        <button class="reset-btn" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div class="help-text">
        <p>Remember your password?</p>
        <a href="/signup/login" class="login-link">Sign in instead</a>
      </div>
    {/if}
  </div>
</div>

<style>
  .forgot-password-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/background.svg') no-repeat center center fixed;
    background-size: cover;
    padding: 20px;
  }

  .forgot-password-box {
    background: #fff;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(108,71,255,0.08);
    padding: 2.5rem 2rem;
    min-width: 400px;
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }

  .header {
    text-align: center;
    margin-bottom: 1rem;
  }

  .title {
    font-size: 2rem;
    font-weight: 700;
    color: #22223b;
    margin-bottom: 0.5rem;
    letter-spacing: 0.01em;
  }

  .subtitle {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
  }

  .forgot-password-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }

  .form-group input {
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1.5px solid #bbb;
    font-size: 1rem;
    outline: none;
    background: #f9f8ff;
    transition: all 0.18s;
  }

  .form-group input:focus {
    border: 1.5px solid #6c47ff;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.1);
  }

  .form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .reset-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    background: #dc3545;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    margin-top: 0.5rem;
  }

  .reset-btn:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }

  .reset-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .success-message {
    text-align: center;
    padding: 2rem;
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 0.5rem;
    color: #155724;
  }

  .success-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .success-message p {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .error-message {
    text-align: center;
    padding: 1.5rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 0.5rem;
    color: #721c24;
  }

  .error-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .error-message p {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    line-height: 1.5;
  }

  .fade-out {
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }

  .help-text {
    text-align: center;
    margin-top: 1rem;
    color: #666;
    font-size: 0.95rem;
  }

  .help-text p {
    margin: 0 0 0.5rem 0;
  }

  .login-link {
    color: #6c47ff;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.18s;
  }

  .login-link:hover {
    color: #4b2bb3;
    text-decoration: underline;
  }

  .back-to-login {
    margin-top: 1rem;
  }

  .back-to-login .login-link {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #6c47ff;
    color: white;
    border-radius: 0.4rem;
    text-decoration: none;
    transition: background 0.18s;
  }

  .back-to-login .login-link:hover {
    background: #4b2bb3;
    text-decoration: none;
  }

  @media (max-width: 500px) {
    .forgot-password-box {
      min-width: 0;
      max-width: 98vw;
      padding: 1.5rem 1rem;
    }

    .title {
      font-size: 1.5rem;
    }

    .subtitle {
      font-size: 0.9rem;
    }
  }
</style>
