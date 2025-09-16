<script lang="ts">
  import { goto } from '$app/navigation';
  import { signIn } from '@auth/sveltekit/client';


  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    error = '';
    loading = true;
    // Use auth.js signIn method
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    loading = false;

    // Custom error handling
    if (result?.error) {
      // If the backend sends a specific error for inactive user, handle it
      // We'll check for a known error string, otherwise show generic message
      if (
        result.error.toLowerCase().includes('inactive') ||
        result.error.toLowerCase().includes('disabled')
      ) {
        error = 'Your account has been disabled. Contact the organization.';
      } else {
        error = 'Either email or password is wrong.';
      }
    } else if (result?.status === 'inactive' || result?.user?.status === 'inactive') {
      // If the backend returns a status field for user
      error = 'Your account has been disabled. Contact the organization.';
    } else {
      // Redirect to dashboard on success
      goto('/dashboard/user');
    }
  }

  function goToSignUp() {
    goto('/signup');
  }
</script>

<div class="login-container">
  <div class="login-box">
    <h2 class="login-title">Sign In</h2>
    <form on:submit|preventDefault={handleLogin} class="login-form">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="Enter your email"
        autocomplete="email"
        required
      />

      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="Enter your password"
        autocomplete="current-password"
        required
      />

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <button class="login-btn" type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
    <div class="signup-link">
      Don't have an Account?&nbsp;
      <span class="signup-action" on:click={goToSignUp}>Sign Up</span>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/src/lib/assets/background.jpg') no-repeat center center fixed;
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
    color: #6c47ff;
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
    background: #6c47ff;
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
  .error-message {
    color: #c0392b;
    background: #ffeaea;
    border-radius: 0.4rem;
    padding: 0.4rem 0.7rem;
    font-size: 0.98rem;
    margin-bottom: 0.2rem;
    text-align: center;
  }
  .signup-link {
    margin-top: 1.1rem;
    text-align: center;
    font-size: 1rem;
    color: #444;
  }
  .signup-action {
    color: #6c47ff;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.18s;
  }
  .signup-action:hover {
    color: #4b2bb3;
    text-decoration: underline;
  }
  @media (max-width: 500px) {
    .login-box {
      min-width: 0;
      max-width: 98vw;
      padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    }
  }
</style>
