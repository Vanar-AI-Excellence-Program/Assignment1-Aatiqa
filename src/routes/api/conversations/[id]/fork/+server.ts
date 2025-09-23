import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { conversations, messages, conversationBranches } from '../../../../../db/schema';
import { getUserWithType } from '$lib/session';
import { eq, and } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// Fork a conversation from a specific message
export const POST: RequestHandler = async ({ params, request, cookies }) => {
  try {
    const conversationId = parseInt(params.id);
    const { messageId, branchName } = await request.json();

    // Get user from session
    const sessionToken = cookies.get('session');
    if (!sessionToken) {
      return new Response('Unauthorized - Please log in', { status: 401 });
    }

    const user = await getUserWithType(sessionToken);
    if (!user) {
      return new Response('Unauthorized - Invalid session', { status: 401 });
    }

    // Verify the conversation belongs to the user
    const conversation = await db
      .select()
      .from(conversations)
      .where(and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, user.userId),
        eq(conversations.userType, user.userType)
      ))
      .limit(1);

    if (conversation.length === 0) {
      return new Response('Conversation not found', { status: 404 });
    }

    // Verify the message exists and belongs to this conversation
    const parentMessage = await db
      .select()
      .from(messages)
      .where(and(
        eq(messages.id, messageId),
        eq(messages.conversationId, conversationId)
      ))
      .limit(1);

    if (parentMessage.length === 0) {
      return new Response('Message not found', { status: 404 });
    }

    // Generate a unique branch ID
    const branchId = randomBytes(8).toString('hex');

    // Create the branch record
    await db.insert(conversationBranches).values({
      conversationId,
      branchId,
      branchName: branchName || `Branch from message ${messageId}`,
      parentMessageId: messageId,
      isMainBranch: false,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      branchId,
      branchName: branchName || `Branch from message ${messageId}`
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error forking conversation:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
