import { error, redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { admin, sessions, users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Get session token from cookies
  const sessionToken = cookies.get('session');
  
  if (!sessionToken) {
    throw redirect(303, '/signup/login');
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
      // Invalid session, redirect to login
      cookies.delete('session', { path: '/' });
      throw redirect(303, '/signup/login');
    }

    const userId = sessionResult[0].userId;

    if (!userId) {
      throw redirect(303, '/signup/login');
    }

    // First check if user exists in users table - if they do, they are NOT an admin
   const userCheck = await db
      .select({
        id: users.id
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userCheck.length > 0) {
      // User exists in users table, they are NOT an admin - redirect to user dashboard
      throw redirect(303, '/dashboard/user');
    }

    // Get admin data
    const adminResult = await db
      .select({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      })
      .from(admin)
      .where(eq(admin.id, userId))
      .limit(1);

    if (adminResult.length === 0) {
      // User is not an admin, redirect to user dashboard
      throw redirect(303, '/dashboard/user');
    }

    return {
      admin: adminResult[0]
    };

  } catch (err: any) {
    console.error('Admin dashboard load error:', err);
    
    // If it's already a redirect, re-throw it
    if (err?.status === 303) {
      throw err;
    }
    
    // For other errors, redirect to login
    throw redirect(303, '/signup/login');
  }
};

export const actions: Actions = {
  updateProfile: async ({ request, cookies }) => {
    const sessionToken = cookies.get('session');
    
    if (!sessionToken) {
      throw redirect(303, '/signup/login');
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
        throw redirect(303, '/signup/login');
      }

      const userId = sessionResult[0].userId;

      if (!userId) {
        throw redirect(303, '/signup/login');
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

      // Prepare update data
      const updateData: any = {
        name,
        email,
        updatedAt: new Date()
      };

      // Only update password if it's provided and not the placeholder
      if (password && password !== '********') {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 12);
        updateData.password = hashedPassword;
      }

      // Update admin profile
      await db
        .update(admin)
        .set(updateData)
        .where(eq(admin.id, userId));

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
