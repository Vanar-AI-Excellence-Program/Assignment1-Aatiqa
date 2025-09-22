import { fail, redirect, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '$lib/db';
import { users } from '../../../db/schema';
import type { ServerLoad, Actions, RequestEvent } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }: RequestEvent) => {
  const token = url.searchParams.get('token');
  console.log('Load function - Token received:', token);

  if (!token) {
    throw error(400, 'Invalid or missing reset token');
  }

  try {
    // Check if token exists and is not expired
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordResetToken: users.passwordResetToken,
        passwordResetExpires: users.passwordResetExpires,
        status: users.status
      })
      .from(users)
      .where(eq(users.passwordResetToken, token))
      .limit(1);

    if (userResult.length === 0) {
      // Token not found - could be expired, used, or invalid
      throw error(400, 'Invalid or expired reset token');
    }

    const user = userResult[0];

    // Check if token is expired
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw error(400, 'Reset token has expired');
    }

    // Check if user account is active
    if (user.status !== 'active') {
      throw error(400, 'Account is not active');
    }

    return {
      valid: true,
      email: user.email,
      name: user.name,
      token: token // Pass the token to the frontend
    };

  } catch (err: any) {
    console.error('Password reset token validation error:', err);
    
    // If it's already an error response, re-throw it
    if (err?.status) {
      throw err;
    }
    
    throw error(500, 'Failed to validate reset token');
  }
};

export const actions: Actions = {
  resetPassword: async ({ request, url }: RequestEvent) => {
    const token = url.searchParams.get('token');
    const data = await request.formData();
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;
    if (!token) {
      return fail(400, {
        
        error: 'Invalid or missing reset token'
      });
    }

    if (!password || !confirmPassword) {
      return fail(400, {
        error: 'Password and confirmation are required'
      });
    }

    if (password !== confirmPassword) {
      return fail(400, {
        error: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'Password must be at least 6 characters long'
      });
    }

    try {
      // Check if token exists and is not expired
      const userResult = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          passwordResetToken: users.passwordResetToken,
          passwordResetExpires: users.passwordResetExpires,
          status: users.status
        })
        .from(users)
        .where(eq(users.passwordResetToken, token))
        .limit(1);

      if (userResult.length === 0) {
        console.log('Invalid or expired reset token');
      }

      const user = userResult[0];

      // Check if token is expired
      if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        return fail(400, {
          error: 'Reset token has expired'
        });
      }

      // Check if user account is active
      if (user.status !== 'active') {
        return fail(400, {
          error: 'Account is not active'
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password and clear reset token
      await db
        .update(users)
        .set({
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      return {
        success: true,
        message: 'Password has been reset successfully! You can now sign in with your new password.'
      };

    } catch (err: any) {
      console.error('Password reset error:', err);
      return fail(500, {
        error: 'Failed to reset password. Please try again later.'
      });
    }
  }
};
