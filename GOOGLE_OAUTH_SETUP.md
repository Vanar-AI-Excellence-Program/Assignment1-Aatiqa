# Google OAuth Setup Guide

This guide will help you set up Google OAuth for your Auth-App project.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your Auth-App project running locally

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" dropdown in the top bar
3. Click "New Project"
4. Enter a project name (e.g., "Auth-App OAuth")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on "Google+ API" and click "Enable"
4. Also search for and enable "Google OAuth2 API"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - **App name**: Auth-App (or your preferred name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click "Save and Continue"
6. Skip "Scopes" for now (click "Save and Continue")
7. Skip "Test users" for now (click "Save and Continue")
8. Review and click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Enter a name (e.g., "Auth-App Web Client")
5. Under "Authorized redirect URIs", add:
   ```
   http://localhost:5173/auth/callback/google
   ```
6. Click "Create"
7. Copy the **Client ID** and **Client Secret** (you'll need these for your .env file)

## Step 5: Update Your Environment Variables

Create or update your `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:23Wahaj34@localhost:5432/authdb

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
ORIGIN=http://localhost:5173
```

Replace `your_actual_client_id_here` and `your_actual_client_secret_here` with the values you copied from Google Cloud Console.

## Step 6: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:5173/signup`

3. Click "Continue with Google" button

4. You should be redirected to Google's OAuth consent screen

5. After granting permissions, you should be redirected back to your app and logged in

## Production Setup

When deploying to production, make sure to:

1. Update the **Authorized redirect URIs** in Google Cloud Console to include your production domain:
   ```
   https://yourdomain.com/auth/callback/google
   ```

2. Update your production environment variables:
   ```env
   ORIGIN=https://yourdomain.com
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Make sure the redirect URI in Google Cloud Console exactly matches your callback URL
   - Check for trailing slashes or http vs https mismatches

2. **"invalid_client" error**
   - Verify your GOOGLE_CLIENT_ID is correct
   - Make sure there are no extra spaces or characters

3. **"access_denied" error**
   - User cancelled the OAuth flow
   - This is normal behavior when users don't grant permissions

4. **Environment variables not loading**
   - Make sure your `.env` file is in the project root
   - Restart your development server after changing environment variables
   - Check that variables don't have quotes around them

### Debug Tips:

1. Check the browser console for any JavaScript errors
2. Check your server logs for detailed error messages
3. Verify environment variables are loaded correctly by checking the server startup logs

## Security Notes

- Never commit your `.env` file to version control
- Keep your Google Client Secret secure and never expose it in client-side code
- Consider using different OAuth credentials for development and production
- Regularly review and rotate your OAuth credentials if needed

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env-dynamic-private)
