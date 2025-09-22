<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;

  let redirectTimer = 5;
  let timerInterval: number;

  onMount(() => {
    if (data.success) {
      // Start countdown timer for redirect
      timerInterval = setInterval(() => {
        redirectTimer--;
        if (redirectTimer <= 0) {
          clearInterval(timerInterval);
          goto('/dashboard');
        }
      }, 1000);
    }

    // Cleanup timer on component destroy
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  });

  function redirectNow() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    goto('/dashboard');
  }

  function requestNewVerification() {
    goto('/auth/resend-verification');
  }
</script>

<svelte:head>
  <title>Email Verification - Your App</title>
</svelte:head>

<div class="verification-container">
  <div class="verification-card">
    {#if data.success}
      <!-- Success State -->
      <div class="success-content">
        <div class="success-icon">✅</div>
        <h1>Email Verified Successfully!</h1>
        <p class="success-message">{data.message}</p>
        
        {#if data.userName}
          <p class="welcome-text">Welcome, <strong>{data.userName}</strong>!</p>
        {/if}
        
        <div class="redirect-info">
          <p>You'll be redirected to your dashboard in <strong>{redirectTimer}</strong> seconds.</p>
          <button class="redirect-btn" on:click={redirectNow}>
            🚀 Go to Dashboard Now
          </button>
        </div>
      </div>
    {:else}
      <!-- Error State -->
      <div class="error-content">
        <div class="error-icon">❌</div>
        <h1>Verification Failed</h1>
        <p class="error-message">{data.message}</p>
        
        {#if data.expired}
          <div class="expired-info">
            <p>Your verification link has expired. Don't worry, we can send you a new one!</p>
            <button class="resend-btn" on:click={requestNewVerification}>
              📧 Request New Verification Email
            </button>
          </div>
        {/if}
        
        <div class="help-links">
          <a href="/signup" class="help-link">🔙 Back to Signup</a>
          <a href="/signup/login" class="help-link">🔑 Login Instead</a>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .verification-container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/background.svg') no-repeat center center fixed;
    background-size: cover;
    padding: 20px;
  }

  .verification-card {
    background: white;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(108,71,255,0.08);
    padding: 2.5rem 2rem;
    text-align: center;
    max-width: 500px;
    width: 100%;
  }

  .success-content, .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .success-icon, .error-icon {
    font-size: 4rem;
    margin-bottom: 10px;
  }

  h1 {
    color: #22223b;
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .success-message, .error-message {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }

  .welcome-text {
    background: #eafaf1;
    color: #27ae60;
    border: 1px solid #a9dfbf;
    padding: 15px 25px;
    border-radius: 0.4rem;
    font-size: 1.1rem;
    margin: 10px 0;
  }

  .redirect-info {
    background: #f8f9fa;
    padding: 25px;
    border-radius: 10px;
    border: 2px dashed #dee2e6;
  }

  .redirect-info p {
    margin: 0 0 15px 0;
    color: #495057;
    font-size: 1rem;
  }

  .redirect-btn {
    background: #22223b;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }

  .redirect-btn:hover {
    background: #1a1a2e;
  }

  .expired-info {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
  }

  .expired-info p {
    color: #856404;
    margin: 0 0 15px 0;
  }

  .resend-btn {
    background: #6c47ff;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }

  .resend-btn:hover {
    background: #5a3ad1;
  }

  .help-links {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .help-link {
    color: #6c47ff;
    text-decoration: none;
    padding: 10px 20px;
    border: 2px solid #6c47ff;
    border-radius: 0.5rem;
    transition: all 0.18s ease;
    font-weight: 500;
  }

  .help-link:hover {
    background: #6c47ff;
    color: white;
  }

  @media (max-width: 600px) {
    .verification-card {
      padding: 30px 20px;
    }

    h1 {
      font-size: 1.5rem;
    }

    .success-icon, .error-icon {
      font-size: 3rem;
    }

    .help-links {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
