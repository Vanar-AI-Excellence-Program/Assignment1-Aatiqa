<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
  
  let loading = false;
</script>

<svelte:head>
  <title>Resend Verification Email - Your App</title>
</svelte:head>

<div class="resend-container">
  <div class="resend-card">
    <div class="header">
      <div class="icon">📧</div>
      <h1>Resend Verification Email</h1>
      <p>Enter your email address to receive a new verification link</p>
    </div>

    {#if form?.success}
      <div class="success-message">
        <div class="success-icon">✅</div>
        <p>{form.message}</p>
        <div class="success-actions">
          <a href="/signup/login" class="login-link">🔑 Go to Login</a>
        </div>
      </div>
    {:else}
      <form 
        method="POST" 
        action="?/resend"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            await update();
            loading = false;
          };
        }}
      >
        {#if form?.error}
          <div class="error-message">
            <span class="error-icon">⚠️</span>
            {form.error}
          </div>
        {/if}

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form?.email ?? ''}
            placeholder="Enter your email address"
            required
            autocomplete="email"
          />
        </div>

        <button type="submit" class="resend-btn" disabled={loading}>
          {loading ? '📤 Sending...' : '📧 Send Verification Email'}
        </button>
      </form>

      <div class="help-section">
        <h3>Need help?</h3>
        <ul>
          <li>Check your spam/junk folder</li>
          <li>Make sure you entered the correct email address</li>
          <li>Verification emails expire after 24 hours</li>
        </ul>
      </div>
    {/if}

    <div class="footer-links">
      <a href="/signup" class="footer-link">🔙 Back to Signup</a>
      <a href="/signup/login" class="footer-link">🔑 Login Instead</a>
    </div>
  </div>
</div>

<style>
  .resend-container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/background.svg') no-repeat center center fixed;
    background-size: cover;
    padding: 20px;
  }

  .resend-card {
    background: white;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(108,71,255,0.08);
    padding: 2.5rem 2rem;
    max-width: 500px;
    width: 100%;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }

  h1 {
    color: #22223b;
    margin: 0 0 10px 0;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .header p {
    color: #666;
    margin: 0;
    font-size: 1rem;
  }

  .success-message {
    text-align: center;
    background: #eafaf1;
    border: 1px solid #a9dfbf;
    border-radius: 0.4rem;
    padding: 25px;
    margin-bottom: 20px;
  }

  .success-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .success-message p {
    color: #27ae60;
    margin: 0 0 20px 0;
    font-size: 1.1rem;
    line-height: 1.5;
  }

  .success-actions {
    margin-top: 20px;
  }

  .login-link {
    display: inline-block;
    background: #22223b;
    color: white;
    padding: 12px 25px;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: background 0.18s;
  }

  .login-link:hover {
    background: #1a1a2e;
  }

  .error-message {
    background: #ffeaea;
    border: 1px solid #f5b7b1;
    color: #c0392b;
    padding: 15px;
    border-radius: 0.4rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .error-icon {
    font-size: 1.2rem;
  }

  .form-group {
    margin-bottom: 25px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 600;
  }

  input[type="email"] {
    width: 100%;
    padding: 15px;
    border: 1.5px solid #bbb;
    border-radius: 0.5rem;
    font-size: 1rem;
    background: #f9f8ff;
    transition: border 0.18s;
    box-sizing: border-box;
    outline: none;
  }

  input[type="email"]:focus {
    border: 1.5px solid #6c47ff;
    background: #fff;
  }

  .resend-btn {
    width: 100%;
    background: #22223b;
    color: white;
    border: none;
    padding: 15px;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
    margin-bottom: 25px;
  }

  .resend-btn:hover:not(:disabled) {
    background: #1a1a2e;
  }

  .resend-btn:disabled {
    background: #b9aaff;
    cursor: not-allowed;
  }

  .help-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 25px;
  }

  .help-section h3 {
    color: #22223b;
    margin: 0 0 15px 0;
    font-size: 1.1rem;
  }

  .help-section ul {
    margin: 0;
    padding-left: 20px;
    color: #666;
  }

  .help-section li {
    margin-bottom: 5px;
  }

  .footer-links {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    border-top: 1px solid #e1e5e9;
    padding-top: 20px;
  }

  .footer-link {
    color: #6c47ff;
    text-decoration: none;
    padding: 8px 16px;
    border: 1px solid #6c47ff;
    border-radius: 0.5rem;
    transition: all 0.18s ease;
    font-size: 0.9rem;
  }

  .footer-link:hover {
    background: #6c47ff;
    color: white;
  }

  @media (max-width: 600px) {
    .resend-card {
      padding: 30px 20px;
    }

    h1 {
      font-size: 1.5rem;
    }

    .footer-links {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
