import type { RequestHandler } from './$types';
import { getUserFromSession } from '$lib/session';

// Check authentication status
export const GET: RequestHandler = async ({ cookies }) => {
  try {
    const sessionToken = cookies.get('session');
    if (!sessionToken) {
      return new Response(JSON.stringify({ isAuthenticated: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await getUserFromSession(sessionToken);
    if (!user) {
      return new Response(JSON.stringify({ isAuthenticated: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      isAuthenticated: true,
      userId: user.userId 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return new Response(JSON.stringify({ isAuthenticated: false }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
