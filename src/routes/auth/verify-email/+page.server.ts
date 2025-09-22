import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/db';
import { users } from '../../../db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { createSession } from '$lib/session';
import { sendWelcomeEmail } from '$lib/email';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
  const token = url.searchParams.get('token');
  
  if (!token) {
    throw error(400, 'Verification token is required');
  }

  try {
    // Find user with matching token and check if token hasn't expired
    const userResult = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        verificationExpires: users.verificationExpires
      })
      .from(users)
      .where(
        and(
          eq(users.verificationToken, token),
          gt(users.verificationExpires, new Date()) // Token hasn't expired
        )
      )
      .limit(1);

    if (userResult.length === 0) {
      // Token not found or expired
      return {
        success: false,
        message: 'Invalid or expired verification token. Please request a new verification email.',
        expired: true
      };
    }

    const user = userResult[0];

    // Check if email is already verified
    if (user.emailVerified) {
      // Already verified, just create session and redirect
      await createSession(user.id, cookies);
      throw redirect(303, '/dashboard?message=Email already verified');
    }

    // Update user to mark email as verified and clear verification token
    await db
      .update(users)
      .set({
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Send welcome email (don't await to avoid blocking)
    sendWelcomeEmail(user.email, user.name).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    // Create session for the verified user
    await createSession(user.id, cookies);

    return {
      success: true,
      message: 'Email verified successfully! Welcome to your dashboard.',
      userName: user.name
    };

  } catch (err) {
    console.error('Email verification error:', err);
    
    // If it's already a redirect, re-throw it
    if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
      throw err;
    }
    
    return {
      success: false,
      message: 'An error occurred during verification. Please try again.',
      error: true
    };
  }
};
