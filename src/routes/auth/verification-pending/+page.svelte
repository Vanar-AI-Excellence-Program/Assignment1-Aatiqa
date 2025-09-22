<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  const providerInfo = {
    google: {
      name: 'Google',
      color: '#4285f4',
      icon: '🔍'
    },
    github: {
      name: 'GitHub', 
      color: '#333',
      icon: '🐙'
    },
    local: {
      name: 'Local',
      color: '#6c757d',
      icon: '📧'
    }
  };

  const currentProvider = providerInfo[data.provider] || providerInfo.local;
</script>

<svelte:head>
  <title>Email Verification Required - Your App</title>
</svelte:head>

<div class="pending-container">
  <div class="pending-card">
    <div class="header">
      <div class="provider-icon" style="background-color: {currentProvider.color}">
        {currentProvider.icon}
      </div>
      <h1>Email Verification Required</h1>
      <div class="provider-badge" style="background-color: {currentProvider.color}">
        Via {currentProvider.name}
      </div>
    </div>

    <div class="content">
      <div class="email-info">
        <h2>📧 Check Your Email</h2>
        <p>We've sent a verification email to:</p>
        <div class="email-display">
          <strong>{data.email}</strong>
        </div>
      </div>

      <div class="instructions">
        <h3>What to do next:</h3>
        <ol>
          <li>
            <span class="step-icon">📬</span>
            <div>
              <strong>Check your inbox</strong>
              <p>Look for an email from us with the subject "Verify your email address"</p>
            </div>
          </li>
          <li>
            <span class="step-icon">🗂️</span>
            <div>
              <strong>Check spam/junk folder</strong>
              <p>Sometimes emails end up there by mistake</p>
            </div>
          </li>
          <li>
            <span class="step-icon">🔗</span>
            <div>
              <strong>Click the verification link</strong>
              <p>This will verify your email and complete your registration</p>
            </div>
          </li>
        </ol>
      </div>

      <div class="help-section">
        <h3>Need help?</h3>
        <div class="help-actions">
          <a href="/auth/resend-verification" class="resend-btn">
            📤 Resend Verification Email
          </a>
          
        </div>
      </div>

      <div class="security-note">
        <div class="security-icon">🔒</div>
        <div>
          <strong>Why verify your email?</strong>
          <p>Email verification helps secure your account and ensures you can recover your password if needed.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .pending-container {
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/background.svg') no-repeat center center fixed;
    background-size: cover;
    padding: 20px;
  }

  .pending-card {
    background: white;
    border-radius: 1.2rem;
    box-shadow: 0 4px 18px rgba(108,71,255,0.08);
    max-width: 600px;
    width: 100%;
    overflow: hidden;
  }

  .header {
    text-align: center;
    padding: 40px 40px 20px 40px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }

  .provider-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    margin: 0 auto 20px auto;
  }

  h1 {
    color: #22223b;
    margin: 0 0 15px 0;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .provider-badge {
    display: inline-block;
    color: white;
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .content {
    padding: 30px 40px;
  }

  .email-info {
    text-align: center;
    margin-bottom: 20px;
  }

  .email-info h2 {
    color: #22223b;
    margin: 0 0 15px 0;
    font-size: 1.4rem;
  }

  .email-info p {
    color: #666;
    margin: 0 0 15px 0;
  }

  .email-display {
    background: #f9f8ff;
    border: 2px solid #6c47ff;
    border-radius: 0.5rem;
    padding: 15px;
    color: #6c47ff;
    font-size: 1.1rem;
    word-break: break-all;
  }

  .instructions {
    margin-bottom: 20px;
  }

  .instructions h3 {
    color: #22223b;
    margin: 0 0 20px 0;
    font-size: 1.2rem;
  }

  .instructions ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .instructions li {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
  }

  .step-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .instructions li strong {
    color: #22223b;
    display: block;
    margin-bottom: 5px;
  }

  .instructions li p {
    color: #666;
    margin: 0;
    font-size: 0.9rem;
  }

  .help-section {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 20px;
  }

  .help-section h3 {
    color: #856404;
    margin: 0 0 5px 0;
    font-size: 1.1rem;
  }

  .help-actions {
    text-align: center;
  }

  .resend-btn {
    display: inline-block;
    background: #6c47ff;
    color: white;
    padding: 15px 30px;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    margin-bottom: 5px;
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
  }

  .help-link {
    color: #6c47ff;
    text-decoration: none;
    padding: 8px 16px;
    border: 1px solid #6c47ff;
    border-radius: 0.5rem;
    transition: all 0.18s ease;
    font-size: 0.9rem;
  }

  .help-link:hover {
    background: #6c47ff;
    color: white;
  }

  .security-note {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      background: #d1ecf1;
      border: 1px solid #bee5eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 40px;
    }

  .security-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .security-note strong {
    color: #0c5460;
    display: block;
    margin-bottom: 5px;
  }

  .security-note p {
    color: #0c5460;
    margin: 0;
    font-size: 0.9rem;
  }

  @media (max-width: 600px) {
    .pending-card {
      margin: 10px;
    }

    .header, .content {
      padding: 30px 20px;
    }

    h1 {
      font-size: 1.5rem;
    }

    .help-links {
      flex-direction: column;
      align-items: center;
    }

    .instructions li {
      flex-direction: column;
      text-align: center;
      gap: 10px;
    }

    .security-note {
      flex-direction: column;
      text-align: center;
      gap: 10px;
    }
  }
</style>
