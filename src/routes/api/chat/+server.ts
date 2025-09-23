import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db';
import { conversations, messages } from '../../../db/schema';
import { getUserWithType } from '$lib/session';
import { eq, desc } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { messages: chatMessages, conversationId, branchId = 'main' } = await request.json();

    if (!chatMessages || !Array.isArray(chatMessages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Check if user is authenticated (but don't require it)
    const sessionToken = cookies.get('session');
    const user = sessionToken ? await getUserWithType(sessionToken) : null;
    const isAuthenticated = !!user;

    if (!env.GEMINI_API_KEY) {
      return new Response('Gemini API key not configured', { status: 500 });
    }

    // Handle conversation creation or retrieval (only for authenticated users)
    let currentConversationId = conversationId;
    if (isAuthenticated) {
      if (!currentConversationId) {
        // Create a new conversation for authenticated users (both regular users and admins)
        const newConversation = await db.insert(conversations).values({
          userId: user.userId,
          userType: user.userType, // 'user' or 'admin'
          title: chatMessages[0]?.content?.substring(0, 50) + '...' || 'New Chat',
        }).returning();
        currentConversationId = newConversation[0].id;
      }

      // Save the user message to database for authenticated users
      const userMessage = chatMessages[chatMessages.length - 1];
      if (userMessage && userMessage.role === 'user') {
        await db.insert(messages).values({
          conversationId: currentConversationId,
          branchId: branchId,
          role: userMessage.role,
          content: userMessage.content,
        });
      }
    }
    
    // Set the API key for the Google model
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = env.GEMINI_API_KEY;
    
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages: chatMessages,
      temperature: 0.7,
    });

    
    // Create a streaming response using the baseStream
    let assistantResponse = '';
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send conversation ID first (only for authenticated users)
          if (isAuthenticated && currentConversationId) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ conversationId: currentConversationId })}\n\n`));
          }
          
          for await (const chunk of result.textStream) {
            const text = chunk;
            if (text) {
              assistantResponse += text;
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }
          
          // Save the complete assistant response to database (only for authenticated users)
          if (isAuthenticated && assistantResponse && currentConversationId) {
            await db.insert(messages).values({
              conversationId: currentConversationId,
              branchId: branchId,
              role: 'assistant',
              content: assistantResponse,
            });
          }
          
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error details:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    return new Response(`Internal server error: ${(error as Error).message}`, { status: 500 });
  }
};
