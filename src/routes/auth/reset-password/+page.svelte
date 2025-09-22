<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let data;
  export let form;
  
  let loading = false;
  let showMessage = false;
  let messageTimer: ReturnType<typeof setTimeout> | null = null;
  let password = '';
  let confirmPassword = '';
  let showPassword = false;
  let showConfirmPassword = false;

  // Handle success/error messages
  $: if (browser && form?.success) {
    showMessage = true;
    if (messageTimer) {
      clearTimeout(messageTimer);
    }
    messageTimer = setTimeout(() => {
      showMessage = false;
      // Redirect to login after showing success message
      setTimeout(() => {
        goto('/signup/login?message=Password reset successful! Please sign in with your new password.');
      }, 2000);
    }, 3000);
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

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function toggleConfirmPasswordVisibility() {
    showConfirmPassword = !showConfirmPassword;
  }
</script>

<div class="reset-password-container">
  <div class="reset-password-box">
    <div class="header">
      <h2 class="title">🔑 Reset Your Password</h2>
      <p class="subtitle">Enter your new password below</p>
      {#if data.valid}
        <div class="user-info">
          <p>Resetting password for: <strong>{data.email}</strong></p>
        </div>
      {/if}
    </div>
    
    <!-- Success Message -->
    {#if form?.success}
      <div class="success-message" class:fade-out={!showMessage}>
        <div class="success-icon">✅</div>
        <p>{form.message}</p>
        <div class="redirect-info">
          <p>Redirecting to login page...</p>
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

      {#if data.valid}
        <form 
          method="POST" 
          action="?/resetPassword&token={data.token}" 
          class="reset-password-form"
          use:enhance={() => {
            loading = true;
            return async ({ update }) => {
              await update();
              loading = false;
            };
          }}
        >
          <div class="form-group">
            <label for="password">New Password</label>
            <div class="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                bind:value={password}
                placeholder="Enter your new password (min 6 characters)"
                autocomplete="new-password"
                required
                disabled={loading}
                minlength="6"
              />
              <button 
                type="button" 
                class="password-toggle"
                on:click={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <div class="password-input-container">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                bind:value={confirmPassword}
                placeholder="Confirm your new password"
                autocomplete="new-password"
                required
                disabled={loading}
                minlength="6"
              />
              <button 
                type="button" 
                class="password-toggle"
                on:click={toggleConfirmPasswordVisibility}
                disabled={loading}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div class="password-requirements">
            <p><strong>Password Requirements:</strong></p>
            <ul>
              <li class:valid={password.length >= 6}>At least 6 characters</li>
              <li class:valid={password === confirmPassword && password.length > 0}>Passwords match</li>
            </ul>
          </div>

          <button class="reset-btn" type="submit" disabled={loading || password !== confirmPassword || password.length < 6}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      {:else}
        <div class="invalid-token">
          <div class="error-icon">❌</div>
          <h3>Invalid or Expired Token</h3>
          <p>The password reset link is invalid or has expired.</p>
          <div class="actions">
            <a href="/auth/forgot-password" class="request-new-link">Request New Reset Link</a>
            <a href="/signup/login" class="back-to-login">Back to Login</a>
          </div>
        </div>
      {/if}

      <div class="help-text">
        <p>Remember your password?</p>
        <a href="/signup/login" class="login-link">Sign in instead</a>
      </div>
    {/if}
  </div>
</div>

<style>
  .reset-password-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/background.svg') no-repeat center center fixed;
    background-size: cover;
    padding: 20px;
  }

  .reset-password-box {
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
    margin: 0 0 1rem 0;
  }

  .user-info {
    background: #e3f2fd;
    border: 1px solid #bbdefb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 1rem;
  }

  .user-info p {
    margin: 0;
    color: #1976d2;
    font-size: 0.95rem;
  }

  .reset-password-form {
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

  .password-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-input-container input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1.5px solid #bbb;
    font-size: 1rem;
    outline: none;
    background: #f9f8ff;
    transition: all 0.18s;
  }

  .password-input-container input:focus {
    border: 1.5px solid #6c47ff;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.1);
  }

  .password-input-container input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .password-toggle {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background 0.18s;
  }

  .password-toggle:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.1);
  }

  .password-toggle:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .password-requirements {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 0.5rem;
  }

  .password-requirements p {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #495057;
  }

  .password-requirements ul {
    margin: 0;
    padding-left: 1.2rem;
    list-style: none;
  }

  .password-requirements li {
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
    position: relative;
  }

  .password-requirements li::before {
    content: '❌';
    position: absolute;
    left: -1.2rem;
  }

  .password-requirements li.valid {
    color: #28a745;
  }

  .password-requirements li.valid::before {
    content: '✅';
  }

  .reset-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    background: #28a745;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    margin-top: 0.5rem;
  }

  .reset-btn:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .redirect-info {
    font-size: 0.9rem;
    color: #0c5460;
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

  .invalid-token {
    text-align: center;
    padding: 2rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 0.5rem;
    color: #721c24;
  }

  .invalid-token h3 {
    margin: 1rem 0 0.5rem 0;
    color: #721c24;
  }

  .invalid-token p {
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  .request-new-link, .back-to-login {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.18s;
  }

  .request-new-link {
    background: #dc3545;
    color: white;
  }

  .request-new-link:hover {
    background: #c82333;
    transform: translateY(-1px);
  }

  .back-to-login {
    background: #6c757d;
    color: white;
  }

  .back-to-login:hover {
    background: #5a6268;
    transform: translateY(-1px);
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

  @media (max-width: 500px) {
    .reset-password-box {
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

    .actions {
      flex-direction: column;
    }
  }
</style>
