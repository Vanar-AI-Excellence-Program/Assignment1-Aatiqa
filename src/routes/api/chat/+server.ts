import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response('Gemini API key not configured', { status: 500 });
    }
    
    // Set the API key for the Google model
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = env.GEMINI_API_KEY;
    
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      temperature: 0.7,
    });

    
    // Create a streaming response using the baseStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            const text = chunk;
            if (text) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
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
