import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { conversations, messages, conversationBranches } from '../../../../../db/schema';
import { getUserWithType } from '$lib/session';
import { eq, and } from 'drizzle-orm';

// Helper function to get messages for a specific branch
async function getBranchMessages(conversationId: number, branchId: string) {
  // Get the branch info to find the parent message
  const branch = await db
    .select()
    .from(conversationBranches)
    .where(and(
      eq(conversationBranches.conversationId, conversationId),
      eq(conversationBranches.branchId, branchId)
    ))
    .limit(1);

  if (branch.length === 0) {
    return [];
  }

  const parentMessageId = branch[0].parentMessageId;
  
  // Get all messages from main branch up to the parent message
  const mainBranchMessages = await db
    .select()
    .from(messages)
    .where(and(
      eq(messages.conversationId, conversationId),
      eq(messages.branchId, 'main')
    ))
    .orderBy(messages.createdAt);

  // Find the index of the parent message
  const parentIndex = mainBranchMessages.findIndex(msg => msg.id === parentMessageId);
  const messagesUpToParent = parentIndex >= 0 ? mainBranchMessages.slice(0, parentIndex + 1) : [];

  // Get messages from the specific branch
  const branchMessages = await db
    .select()
    .from(messages)
    .where(and(
      eq(messages.conversationId, conversationId),
      eq(messages.branchId, branchId)
    ))
    .orderBy(messages.createdAt);

  // Combine messages: main branch up to parent + branch messages
  return [...messagesUpToParent, ...branchMessages];
}

// Get messages for a specific conversation and branch
export const GET: RequestHandler = async ({ params, cookies, url }) => {
  try {
    const conversationId = parseInt(params.id);
    const branchId = url.searchParams.get('branchId') || 'main';
    
    // Get user from session
    const sessionToken = cookies.get('session');
    if (!sessionToken) {
      return new Response('Unauthorized - Please log in', { status: 401 });
    }

    const user = await getUserWithType(sessionToken);
    if (!user) {
      return new Response('Unauthorized - Invalid session', { status: 401 });
    }

    // Verify the conversation belongs to the user (check both userId and userType)
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

    // Get messages for the specific branch
    let conversationMessages;
    
    if (branchId === 'main') {
      // Get main branch messages (original linear conversation)
      conversationMessages = await db
        .select()
        .from(messages)
        .where(and(
          eq(messages.conversationId, conversationId),
          eq(messages.branchId, 'main')
        ))
        .orderBy(messages.createdAt);
    } else {
      // Get messages for a specific branch
      // This requires building the path from root to the branch
      conversationMessages = await getBranchMessages(conversationId, branchId);
    }

    return new Response(JSON.stringify(conversationMessages), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response('Internal server error', { status: 500 });
  }
};
