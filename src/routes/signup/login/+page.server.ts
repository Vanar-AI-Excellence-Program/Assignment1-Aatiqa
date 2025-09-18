import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '$lib/db';
import { users, admin } from '../../../db/schema';
import { createSession } from '$lib/session';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export const actions: Actions = {
  login: async ({ request, cookies }: RequestEvent) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
      return fail(400, {
        error: 'Email and password are required',
        email
      });
    }

    // 1. Check in admin table
    let adminUser;
    try {
      adminUser = await db
        .select()
        .from(admin)
        .where(eq(admin.email, email))
        .limit(1);
        console.log(adminUser);    } catch (err: any) {
      console.error('Admin query error:', err);
      return fail(500, {
        error: 'Server error: Could not check admin credentials. Please try again later.',
        email
      });
    }

    if (adminUser.length > 0) {
        console.log("--------------------ADMIN USER FOUND--------------------");
        console.log('Admin user data:', adminUser[0]);
      // Check password
      const isMatch = await bcrypt.compare(password, adminUser[0].password);
      console.log('Password match:', isMatch);
      if (isMatch) {
        console.log('Admin login successful, creating session and redirecting...');
        // Create session for admin
        try {
          await createSession(adminUser[0].id, cookies);
          console.log('Admin session created successfully');
        } catch (sessionError) {
          console.error('Session creation error:', sessionError);
          // Continue with redirect even if session creation fails for debugging
          console.log('Session creation failed, but continuing with redirect for debugging');
        }
        console.log('Redirecting to /dashboard/admin');
        // Redirect to admin dashboard
        throw redirect(303, '/dashboard/admin');
      } else {
        return fail(400, {
          error: 'Invalid email or password',
          email
        });
      }
    }

    // 2. Check in users table
    let normalUser;
    try {
      normalUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    } catch (err: any) {
      console.error('User query error:', err);
      return fail(500, {
        error: 'Server error: Could not check user credentials. Please try again later.',
        email
      });
    }

    if (normalUser.length === 0) {
      return fail(400, {
        error: 'You are not registered. Please sign up first.',
        email
      });
    }

    const user = normalUser[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return fail(400, {
        error: 'Invalid email or password',
        email
      });
    }

    if (user.status !== 'active') {
      return fail(403, {
        error: 'Your account is disabled. Please contact the admin for queries.',
        email
      });
    }

    // Create session for user
    await createSession(user.id, cookies);
    // Redirect to user dashboard
    throw redirect(303, '/dashboard/user');
  }
};