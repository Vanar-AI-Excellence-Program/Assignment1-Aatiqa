# GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth for your Auth-App project.

## Prerequisites

- A GitHub account
- Your Auth-App project running locally

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/profile)
2. In the left sidebar, click **"Developer settings"**
3. Click **"OAuth Apps"**
4. Click **"New OAuth App"**

## Step 2: Configure Your OAuth App

Fill in the application details:

- **Application name**: `Auth-App` (or your preferred name)
- **Homepage URL**: `http://localhost:5173` (for development)
- **Application description**: `Authentication app with GitHub OAuth` (optional)
- **Authorization callback URL**: `http://localhost:5173/auth/callback/github`

Click **"Register application"**

## Step 3: Get Your Credentials

After creating the app, you'll see:

1. **Client ID** - Copy this value
2. **Client Secret** - Click "Generate a new client secret" and copy the generated secret

⚠️ **Important**: The client secret will only be shown once. Make sure to copy it immediately!

## Step 4: Update Your Environment Variables

Add the GitHub OAuth credentials to your `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:23Wahaj34@localhost:5432/authdb

# Google OAuth Configuration (if you have it)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Application Configuration
ORIGIN=http://localhost:5173
```

Replace `your_github_client_id_here` and `your_github_client_secret_here` with the actual values from GitHub.

## Step 5: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:5173/signup`

3. Click the **"Continue with GitHub"** button

4. You should be redirected to GitHub's authorization page

5. Click **"Authorize [Your App Name]"**

6. You should be redirected back to your app and automatically signed in

## Production Setup

When deploying to production:

### Update GitHub OAuth App Settings

1. Go back to your GitHub OAuth app settings
2. Update the **Homepage URL** to your production domain:
   ```
   https://yourdomain.com
   ```
3. Update the **Authorization callback URL** to:
   ```
   https://yourdomain.com/auth/callback/github
   ```

### Update Environment Variables

Update your production environment variables:

```env
ORIGIN=https://yourdomain.com
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

## Troubleshooting

### Common Issues:

1. **"The redirect_uri MUST match the registered callback URL for this application"**
   - Make sure the callback URL in GitHub settings exactly matches your app's callback URL
   - Check for trailing slashes, http vs https, and port numbers

2. **"Bad verification code"**
   - This usually means the authorization code has expired or been used already
   - Try the OAuth flow again

3. **"Application suspended"**
   - Your OAuth app might be suspended by GitHub
   - Check your GitHub notifications for any policy violations

4. **Environment variables not loading**
   - Make sure your `.env` file is in the project root
   - Restart your development server after changing environment variables
   - Ensure there are no quotes around the values in the .env file

### Debug Tips:

1. **Check Server Logs**: Look for detailed error messages in your server console
2. **Browser Console**: Check for any JavaScript errors
3. **Network Tab**: Monitor the OAuth redirect flow in your browser's developer tools
4. **GitHub OAuth App Settings**: Double-check all URLs and settings

### Test OAuth Flow:

You can test the OAuth flow manually:

1. Visit: `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:5173/auth/callback/github&scope=user:email`
2. Replace `YOUR_CLIENT_ID` with your actual client ID
3. This should redirect you through the OAuth flow

## Security Notes

- **Never commit your `.env` file** to version control
- **Keep your GitHub Client Secret secure** - never expose it in client-side code
- **Use different OAuth apps** for development and production environments
- **Regularly review your OAuth app permissions** in GitHub settings
- **Consider using GitHub's webhook secret** for additional security in production

## Scopes Used

This implementation requests the following GitHub scopes:

- `user:email` - Access to user's email addresses

This minimal scope ensures we can get the user's basic profile information and primary email address for account creation.

## Additional Features

You can enhance the GitHub OAuth integration by:

1. **Requesting additional scopes** like `read:user` for more profile information
2. **Storing GitHub username** alongside email and name
3. **Adding GitHub profile picture** support
4. **Implementing GitHub-specific features** like repository access (requires additional scopes)

## Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub OAuth Scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)
- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env-dynamic-private)
