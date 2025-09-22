import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users, admin, sessions } from '../../db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Get session token from cookies
  const sessionToken = cookies.get('session');
  
  if (!sessionToken) {
    // No session, redirect to signup
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

    // Check if user is an admin first
    const adminResult = await db
      .select({
        id: admin.id
      })
      .from(admin)
      .where(eq(admin.id, userId))
      .limit(1);

    if (adminResult.length > 0) {
      // User is an admin, redirect to admin dashboard
      throw redirect(303, '/dashboard/admin');
    }

    // User not found in admin table, check if they are a regular user
    const userResult = await db
      .select({
        id: users.id,
        status: users.status
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length > 0) {
      // User found in users table
      // Check if user account is active
      if (userResult[0].status !== 'active') {
        // User account is inactive, redirect to signup with message
        cookies.delete('session', { path: '/' });
        throw redirect(303, '/signup?error=account_inactive');
      }
      
      // User is a regular user, redirect to user dashboard
      throw redirect(303, '/dashboard/user');
    }

    // User not found in either table, invalid session
    cookies.delete('session', { path: '/' });
    throw redirect(303, '/signup');

  } catch (err: any) {
    console.error('Dashboard routing error:', err);
    
    // If it's already a redirect, re-throw it
    if (err?.status === 303) {
      throw err;
    }
    
    // For other errors, redirect to signup
    cookies.delete('session', { path: '/' });
    throw redirect(303, '/signup');
  }
};
