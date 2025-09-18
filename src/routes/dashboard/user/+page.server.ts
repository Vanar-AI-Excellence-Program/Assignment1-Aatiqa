import { error, redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users, sessions } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Get session token from cookies
  const sessionToken = cookies.get('session');
  
  if (!sessionToken) {
    throw redirect(303, '/signup');
  }

  try {
    // Get session and verify it exists
    const sessionResult = await db
      .select({
        userId: sessions.userId
      })
      .from(sessions)
      .where(eq(sessions.token, sessionToken))
      .limit(1);

    if (sessionResult.length === 0) {
      // Invalid session, redirect to signup
      cookies.delete('session', { path: '/' });
      throw redirect(303, '/signup');
    }

    const userId = sessionResult[0].userId;

    if (!userId) {
      throw redirect(303, '/signup');
    }

    // Get user data from the users table
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      // User not found, redirect to signup
      cookies.delete('session', { path: '/' });
      throw redirect(303, '/signup');
    }

    return {
      user: userResult[0]
    };

  } catch (err: any) {
    console.error('User dashboard load error:', err);
    
    // If it's already a redirect, re-throw it
    if (err?.status === 303) {
      throw err;
    }
    
    // For other errors, redirect to signup
    throw redirect(303, '/signup');
  }
};

export const actions: Actions = {
  updateProfile: async ({ request, cookies }) => {
    const sessionToken = cookies.get('session');
    
    if (!sessionToken) {
      throw redirect(303, '/signup');
    }

    try {
      // Verify session and get user ID
      const sessionResult = await db
        .select({
          userId: sessions.userId
        })
        .from(sessions)
        .where(eq(sessions.token, sessionToken))
        .limit(1);

      if (sessionResult.length === 0) {
        throw redirect(303, '/signup');
      }

      const userId = sessionResult[0].userId;

      if (!userId) {
        throw redirect(303, '/signup');
      }

      // Get form data
      const data = await request.formData();
      const name = data.get('name') as string;
      const email = data.get('email') as string;
      const password = data.get('password') as string;

      if (!name || !email) {
        return fail(400, {
          error: 'Name and email are required',
          name,
          email
        });
      }

      // Check if email is already taken by another user
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== userId) {
        return fail(400, {
          error: 'Email is already taken by another user',
          name,
          email
        });
      }

      // Prepare update data
      const updateData: any = {
        name,
        email,
        updatedAt: new Date()
      };

      // Only update password if it's provided
      if (password && password.trim() !== '') {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 12);
        updateData.password = hashedPassword;
      }

      // Update user profile
      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      return {
        success: true,
        message: 'Profile updated successfully!'
      };

    } catch (err: any) {
      console.error('Profile update error:', err);
      return fail(500, {
        error: 'Failed to update profile. Please try again.'
      });
    }
  }
};
