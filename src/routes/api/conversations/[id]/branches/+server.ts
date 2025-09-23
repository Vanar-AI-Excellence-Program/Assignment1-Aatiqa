import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { conversations, conversationBranches } from '../../../../../db/schema';
import { getUserWithType } from '$lib/session';
import { eq, and } from 'drizzle-orm';

// Get all branches for a conversation
export const GET: RequestHandler = async ({ params, cookies }) => {
  try {
    const conversationId = parseInt(params.id);

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

    // Get all branches for this conversation
    const branches = await db
      .select()
      .from(conversationBranches)
      .where(eq(conversationBranches.conversationId, conversationId))
      .orderBy(conversationBranches.createdAt);

    // Always include the main branch
    const allBranches = [
      {
        id: 0,
        conversationId,
        branchId: 'main',
        branchName: 'Main conversation',
        parentMessageId: null,
        isMainBranch: true,
        createdAt: conversation[0].createdAt
      },
      ...branches
    ];

    return new Response(JSON.stringify(allBranches), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching conversation branches:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
