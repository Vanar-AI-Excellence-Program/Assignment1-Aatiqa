<script lang="ts">

  import { enhance } from '$app/forms';
  export let form;
  let loading = false;

</script>

<div class="login-container">
  <div class="login-box">
    <h2 class="login-title">Sign In</h2>
    
    <!-- Error Message -->
    {#if form?.error}
      <div class="error-message">
        <p>{form.error}</p>
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
  @media (max-width: 500px) {
    .login-box {
      min-width: 0;
      max-width: 98vw;
      padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    }
  }
</style>
