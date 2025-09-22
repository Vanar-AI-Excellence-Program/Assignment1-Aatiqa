import { error, redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users, admin, sessions } from '../../../../db/schema';
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

    // Verify user is an admin
    const adminResult = await db
      .select({
        id: admin.id
      })
      .from(admin)
      .where(eq(admin.id, userId))
      .limit(1);

    if (adminResult.length === 0) {
      // User is not an admin, redirect to user dashboard
      throw redirect(303, '/dashboard/user');
    }

    // Fetch all users data (only name and status for settings page)
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        status: users.status
      })
      .from(users)
      .orderBy(users.name); // Order by name alphabetically

    return {
      users: allUsers
    };

  } catch (err: any) {
    console.error('Settings page load error:', err);
    
    // If it's already a redirect, re-throw it
    if (err?.status === 303) {
      throw err;
    }
    
    // For other errors, redirect to login
    throw redirect(303, '/signup/login');
  }
};

export const actions: Actions = {
  updateUserStatus: async ({ request, cookies }) => {
    const sessionToken = cookies.get('session');
    
    if (!sessionToken) {
      throw redirect(303, '/signup/login');
    }

    try {
      // Verify admin session
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

      const adminId = sessionResult[0].userId;

      if (!adminId) {
        throw redirect(303, '/signup/login');
      }

      // First check if user exists in users table - if they do, they are NOT an admin
      const userCheck = await db
        .select({
          id: users.id
        })
        .from(users)
        .where(eq(users.id, adminId))
        .limit(1);

      if (userCheck.length > 0) {
        // User exists in users table, they are NOT an admin - redirect to user dashboard
        throw redirect(303, '/dashboard/user');
      }

      // Verify user is an admin
      const adminResult = await db
        .select({
          id: admin.id
        })
        .from(admin)
        .where(eq(admin.id, adminId))
        .limit(1);

      if (adminResult.length === 0) {
        throw redirect(303, '/dashboard/user');
      }

     // Get form data
      const data = await request.formData();
      const userId = parseInt(data.get('userId') as string);
      const newStatus = data.get('status') as string;

      if (!userId || !newStatus) {
        return fail(400, {
          error: 'User ID and status are required'
        });
      }

      // Validate status
      if (!['active', 'inactive'].includes(newStatus)) {
        return fail(400, {
          error: 'Invalid status. Must be active or inactive'
        });
      }

      // Update user status in database
      await db
        .update(users)
        .set({
          status: newStatus,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      // If user is being deactivated, delete all their active sessions
      if (newStatus === 'inactive') {
        await db
          .delete(sessions)
          .where(eq(sessions.userId, userId));
      }

      return {
        success: true,
        message: `User status updated to ${newStatus} successfully!${newStatus === 'inactive' ? ' User has been logged out from all devices.' : ''}`,
        userId,
        newStatus
      };

    } catch (err: any) {
      console.error('Status update error:', err);
      return fail(500, {
        error: 'Failed to update user status. Please try again.'
      });
    }
  }
};
