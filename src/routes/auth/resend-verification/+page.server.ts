import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { sendVerificationEmail, generateVerificationToken, generateVerificationExpiry } from '$lib/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // If user is already logged in, redirect to dashboard
  const sessionToken = cookies.get('session');
  if (sessionToken) {
    throw redirect(303, '/dashboard');
  }
  
  return {};
};

export const actions: Actions = {
  resend: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email') as string;

    if (!email) {
      return fail(400, {
        error: 'Email is required',
        email: ''
      });
    }

    try {
      // Find user by email
      const userResult = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          emailVerified: users.emailVerified,
          password: users.password
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (userResult.length === 0) {
        // Don't reveal if email exists or not for security
        return {
          success: true,
          message: 'If an account with this email exists and is unverified, a verification email has been sent.'
        };
      }

      const user = userResult[0];

      // Check if email is already verified
      if (user.emailVerified) {
        return {
          success: true,
          message: 'This email address is already verified. You can login normally.'
        };
      }

      // Determine the provider based on password field
      let provider: 'google' | 'github' | 'local' = 'local';
      if (user.password === 'oauth_google') {
        provider = 'google';
      } else if (user.password === 'oauth_github') {
        provider = 'github';
      }

      // Generate new verification token
      const verificationToken = generateVerificationToken();
      const verificationExpires = generateVerificationExpiry();

      // Update user with new verification token
      await db
        .update(users)
        .set({
          verificationToken,
          verificationExpires,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      // Send verification email
      await sendVerificationEmail(user.email, user.name, verificationToken, provider);

      return {
        success: true,
        message: 'A new verification email has been sent to your email address. Please check your inbox and spam folder.'
      };

    } catch (error) {
      console.error('Resend verification error:', error);
      return fail(500, {
        error: 'Failed to send verification email. Please try again later.',
        email
      });
    }
  }
};
