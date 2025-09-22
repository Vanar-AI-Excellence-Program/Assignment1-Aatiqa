import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users, admin } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '$lib/session';
import { exchangeGitHubCode } from '$lib/auth';
import { sendVerificationEmail, generateVerificationToken, generateVerificationExpiry } from '$lib/email';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  try {
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    const context = url.searchParams.get('state') || 'signup'; // Check if it's login or signup

    if (error) {
      console.error('GitHub OAuth error:', error);
      const redirectUrl = context === 'login' ? '/signup/login?error=github_cancelled' : '/signup?error=github_cancelled';
      throw redirect(303, redirectUrl);
    }

    if (!code) {
      const redirectUrl = context === 'login' ? '/signup/login?error=github_failed' : '/signup?error=github_failed';
      throw redirect(303, redirectUrl);
    }

    // Exchange code for user info
    const githubUser = await exchangeGitHubCode(code, context as 'signup' | 'login');

    if (!githubUser.email || !githubUser.name) {
      const redirectUrl = context === 'login' ? '/signup/login?error=github_incomplete' : '/signup?error=github_incomplete';
      throw redirect(303, redirectUrl);
    }

    // Check if user exists in admin table first
    const existingAdmin = await db
      .select()
      .from(admin)
      .where(eq(admin.email, githubUser.email))
      .limit(1);

    if (existingAdmin.length > 0) {
      // Admin found, create session and redirect to admin dashboard
      const adminId = existingAdmin[0].id;
      await createSession(adminId, cookies);
      throw redirect(303, '/dashboard/admin');
    }

    // Check if user already exists in users table
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, githubUser.email))
      .limit(1);

    let userId: number;

    if (context === 'login') {
      // LOGIN CONTEXT: User must already exist
      if (existingUser.length === 0) {
        throw redirect(303, '/signup/login?error=not_registered');
      }

      const user = existingUser[0];
      
      // Check if user account is active
      if (user.status !== 'active') {
        throw redirect(303, '/signup/login?error=account_inactive');
      }

      // Check if email is verified
      if (!user.emailVerified) {
        throw redirect(303, '/signup/login?message=Please verify your email before logging in. Check your inbox for the verification link.');
      }

      userId = user.id;
    } else {
      // SIGNUP CONTEXT: Create new user or show error if exists
      if (existingUser.length === 0) {
        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationExpires = generateVerificationExpiry();

        // Create new user (unverified)
        const newUser = await db
          .insert(users)
          .values({
            name: githubUser.name,
            email: githubUser.email,
            password: 'oauth_github', // Special marker for OAuth users
            status: 'active',
            emailVerified: false, // Require verification even for OAuth
            verificationToken,
            verificationExpires,
          })
          .returning({ id: users.id });

        userId = newUser[0].id;

        // Send verification email
        try {
          await sendVerificationEmail(githubUser.email, githubUser.name, verificationToken, 'github');
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          // Continue with signup but notify user
        }

        // Redirect to verification pending page instead of creating session
        throw redirect(303, `/auth/verification-pending?email=${encodeURIComponent(githubUser.email)}&provider=github`);
      } else {
        // User already exists, redirect to signup with message
        throw redirect(303, '/signup?error=user_already_exists');
      }
    }

    // Create session
    await createSession(userId, cookies);

    // Redirect to dashboard (let the smart router handle user vs admin)
    throw redirect(303, '/dashboard');

  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    
    // If it's already a redirect, re-throw it
    if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
      throw error;
    }
    
    const context = url.searchParams.get('state') || 'signup';
    const redirectUrl = context === 'login' ? '/signup/login?error=github_failed' : '/signup?error=github_failed';
    throw redirect(303, redirectUrl);
  }
};
