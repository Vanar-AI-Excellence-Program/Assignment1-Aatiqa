// Google OAuth utility functions
export function getGoogleAuthUrl(context: 'signup' | 'login' = 'signup'): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
  }
  
  const redirectUri = `${process.env.ORIGIN || 'http://localhost:5173'}/auth/callback/google`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: context // Pass context as state parameter
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string, context: 'signup' | 'login' = 'signup') {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth environment variables are not set');
  }
  
  const redirectUri = `${process.env.ORIGIN || 'http://localhost:5173'}/auth/callback/google`;

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenData.error}`);
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(`User info fetch failed: ${userData.error}`);
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    };
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
}

// GitHub OAuth utility functions
export function getGitHubAuthUrl(context: 'signup' | 'login' = 'signup'): string {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  
  if (!clientId) {
    throw new Error('GITHUB_CLIENT_ID environment variable is not set');
  }
  
  const redirectUri = `${process.env.ORIGIN || 'http://localhost:5173'}/auth/callback/github`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'user:email',
    state: context // Pass context as state parameter
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGitHubCode(code: string, context: 'signup' | 'login' = 'signup') {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth environment variables are not set');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      throw new Error(`Token exchange failed: ${tokenData.error || 'Unknown error'}`);
    }

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error(`User info fetch failed: ${userData.message || 'Unknown error'}`);
    }

    // Get user email (GitHub might not provide email in the user endpoint)
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const emailData = await emailResponse.json();
    const primaryEmail = emailData.find((email: any) => email.primary)?.email || userData.email;

    return {
      id: userData.id.toString(),
      email: primaryEmail,
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      username: userData.login,
    };
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    throw error;
  }
}
