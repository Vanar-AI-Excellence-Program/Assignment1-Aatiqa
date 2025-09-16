<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleSignup() {
    error = '';
    loading = true;
    // Dummy signup logic, replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!name || !email || !password) {
      error = 'Please fill in all fields.';
      loading = false;
      return;
    }
    // Here you would send data to backend
    // For now, just redirect to dashboard or login
    goto('/dashboard/user');
  }

  function goToSignIn() {
    goto('/signup/login/');
  }
</script>

<div class="signup-container">
  <div class="signup-box">
    <h2 class="signup-title">Sign Up</h2>
    <form on:submit|preventDefault={handleSignup} class="signup-form">
      <label for="name">Name</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        placeholder="Enter your name"
        autocomplete="name"
        required
      />

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
        autocomplete="new-password"
        required
      />

      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <button class="signup-btn" type="submit" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
    <div class="signin-link">
      Already have an Account?&nbsp;
      <span class="signin-action" on:click={goToSignIn}>Sign In</span>
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
    background: url('/src/lib/assets/background.jpg') no-repeat center center fixed;
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
    color: #6c47ff;
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
    background: #6c47ff;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }
  .signup-btn:disabled {
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
