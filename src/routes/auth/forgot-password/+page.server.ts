import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db';
import { users } from '../../../db/schema';
import { generatePasswordResetToken, generatePasswordResetExpiry, sendPasswordResetEmail } from '$lib/email';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export const actions: Actions = {
  requestReset: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    const email = data.get('email') as string;

    if (!email) {
      return fail(400, {
        error: 'Email is required',
        email: ''
      });
    }

    try {
      // Check if user exists
      const userResult = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          status: users.status,
          emailVerified: users.emailVerified
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (userResult.length === 0) {
        // Don't reveal if email exists or not for security
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        };
      }

      const user = userResult[0];

      // Check if user account is active
      if (user.status !== 'active') {
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        };
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return fail(400, {
          error: 'Please verify your email address before requesting a password reset.',
          email
        });
      }

      // Generate reset token and expiry
      const resetToken = generatePasswordResetToken();
      const resetExpires = generatePasswordResetExpiry();

      // Update user with reset token
      await db
        .update(users)
        .set({
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      // Send password reset email
      try {
        await sendPasswordResetEmail(user.email, user.name, resetToken);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        return fail(500, {
          error: 'Failed to send password reset email. Please try again later.',
          email
        });
      }

      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      };

    } catch (error) {
      console.error('Password reset request error:', error);
      return fail(500, {
        error: 'An error occurred. Please try again later.',
        email
      });
    }
  }
};
