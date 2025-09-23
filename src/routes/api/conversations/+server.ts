import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { conversations, messages } from '../../../db/schema';
import { getUserWithType } from '$lib/session';
import { eq, desc, and } from 'drizzle-orm';

// Get all conversations for a user
export const GET: RequestHandler = async ({ cookies }) => {
  try {
    // Get user from session
    const sessionToken = cookies.get('session');
    if (!sessionToken) {
      return new Response('Unauthorized - Please log in', { status: 401 });
    }

    const user = await getUserWithType(sessionToken);
    if (!user) {
      return new Response('Unauthorized - Invalid session', { status: 401 });
    }

    // Get user's conversations (filter by both userId and userType)
    const userConversations = await db
      .select()
      .from(conversations)
      .where(and(
        eq(conversations.userId, user.userId),
        eq(conversations.userType, user.userType)
      ))
      .orderBy(desc(conversations.updatedAt));

    return new Response(JSON.stringify(userConversations), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return new Response('Internal server error', { status: 500 });
  }
};

// Delete a conversation
export const DELETE: RequestHandler = async ({ request, cookies }) => {
  try {
    const { conversationId } = await request.json();

    // Get user from session
    const sessionToken = cookies.get('session');
    if (!sessionToken) {
      return new Response('Unauthorized - Please log in', { status: 401 });
    }

    const user = await getUserWithType(sessionToken);
    if (!user) {
      return new Response('Unauthorized - Invalid session', { status: 401 });
    }

    // Delete conversation (only if it belongs to the current user and user type)
    await db
      .delete(conversations)
      .where(and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, user.userId),
        eq(conversations.userType, user.userType)
      ));

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
