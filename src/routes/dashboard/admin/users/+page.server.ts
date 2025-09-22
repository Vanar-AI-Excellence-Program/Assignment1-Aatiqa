import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users, admin, sessions } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

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

    // Fetch all users data (name, status, email, createdAt)
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        status: users.status,
        createdAt: users.createdAt
      })
      .from(users)
      .orderBy(users.createdAt); // Order by creation date, newest first

    return {
      users: allUsers
    };

  } catch (err: any) {
    console.error('Users page load error:', err);
    
    // If it's already a redirect, re-throw it
    if (err?.status === 303) {
      throw err;
    }
    
    // For other errors, redirect to login
    throw redirect(303, '/signup/login');
  }
};
