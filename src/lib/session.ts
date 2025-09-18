import { db } from './db';
import { sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import type { Cookies } from '@sveltejs/kit';

// Generate a secure session token
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Create a new session for a user
export async function createSession(userId: number, cookies: Cookies): Promise<string> {
  const token = generateSessionToken();
  
  try {
    // Insert session into database
    await db.insert(sessions).values({
      userId,
      token,
    });

    // Set session cookie (expires in 30 days)
    cookies.set('session', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return token;
  } catch (error) {
    console.error('Failed to create session:', error);
    throw new Error('Failed to create session');
  }
}

// Get user from session token
export async function getUserFromSession(token: string) {
  try {
    const sessionResult = await db
      .select({
        userId: sessions.userId,
        createdAt: sessions.createdAt
      })
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      return null;
    }

    return sessionResult[0];
  } catch (error) {
    console.error('Failed to get user from session:', error);
    return null;
  }
}

// Delete a session (logout)
export async function deleteSession(cookies: Cookies): Promise<void> {
  try {
    const sessionToken = cookies.get('session');
    
    if (sessionToken) {
      // Delete from database
      await db.delete(sessions).where(eq(sessions.token, sessionToken));
    }
    
    // Clear cookie regardless
    cookies.delete('session', { path: '/' });
  } catch (error) {
    console.error('Failed to delete session:', error);
    // Still clear the cookie even if database deletion fails
    cookies.delete('session', { path: '/' });
  }
}
