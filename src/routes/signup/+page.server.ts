import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '$lib/db';
import { users } from '../../db/schema';
import { createSession } from '$lib/session';
import { getGoogleAuthUrl, getGitHubAuthUrl } from '$lib/auth';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export const actions: Actions = {
  signup: async ({ request, cookies }: RequestEvent) => {
    const data = await request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    // Basic validation
    if (!name || !email || !password) {
      return fail(400, {
        error: 'All fields are required',
        name,
        email
      });
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'Password must be at least 6 characters long',
        name,
        email
      });
    }

    try {
      // Check if user already exists
        let existingUser;
      try {
        existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
      } catch (queryErr: any) {
        // Log the failed query error and return a user-friendly message
        console.error('Failed to check for existing user:', queryErr);
        return fail(500, {
          error: 'Server error: Failed to check for existing user. Please try again later.',
          name,
          email
        });
      }

      if (existingUser.length > 0) {
        return fail(400, {
          error: 'You are already registered. Please login instead.',
          name,
          email
        });
      }

      // Hash password
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (hashErr: any) {
        console.error('Password hashing error:', hashErr);
        return fail(500, {
          error: 'Server error: Failed to process password. Please try again.',
          name,
          email
        });
      }

      // Insert new user
      let newUser;
      try {
        newUser = await db
          .insert(users)
          .values({
            name,
            email,
            password: hashedPassword,
            status: 'active'
          })
          .returning({ id: users.id, name: users.name, email: users.email });
      } catch (insertErr: any) {
        // Drizzle query error handling
        console.error('Drizzle insert error:', insertErr);
        // Try to provide more specific error message
        if (insertErr?.message?.includes('duplicate key')) {
          return fail(400, {
            error: 'Email already exists. Please use a different email.',
            name,
            email
          });
        }
        if (insertErr?.message) {
          return fail(500, {
            error: `Database error: ${insertErr.message}`,
            name,
            email
          });
        }
        return fail(500, {
          error: 'Database error during user creation.',
          name,
          email
        });
      }

      // Create session for the new user
      try {
        await createSession(newUser[0].id, cookies);
        
        // Return success message instead of immediate redirect
        return {
          success: true,
          message: 'Account created successfully! Redirecting to your dashboard...',
          user: newUser[0],
          shouldRedirect: true
        };
      } catch (sessionError) {
        console.error('Session creation failed:', sessionError);
        // If session creation fails, still return success but ask user to login
        return {
          success: true,
          message: 'Account created successfully! Please login to continue.',
          user: newUser[0],
          shouldRedirect: false
        };
      }

    } catch (error: any) {
      // More detailed error logging for Drizzle query errors
      console.error('Signup error:', error);
      if (error?.message) {
        // If the error message contains a failed query, provide a user-friendly message
        if (error.message.includes('Failed query')) {
          return fail(500, {
            error: 'Server error: Could not complete signup due to a database issue. Please try again later.',
            name,
            email
          });
        }
        return fail(500, {
          error: `Server error: ${error.message}`,
          name,
          email
        });
      }
      return fail(500, {
        error: 'Something went wrong. Please try again.',
        name,
        email
      });
    }
  },

  googleSignup: async () => {
    try {
      // Generate Google OAuth URL
      const googleAuthUrl = getGoogleAuthUrl();
      // Redirect to Google OAuth
      throw redirect(303, googleAuthUrl);
    } catch (error: any) {
      // If it's a redirect, re-throw it (this is normal SvelteKit behavior)
      if (error?.status === 303) {
        throw error;
      }
      
      console.error('Google signup error:', error);
      
      // Check if it's a missing environment variable error
      if (error.message?.includes('environment variable')) {
        return fail(500, {
          error: 'Google OAuth is not configured. Please check server configuration.'
        });
      }
      
      return fail(500, {
        error: `Failed to initiate Google signup: ${error.message || 'Unknown error'}`
      });
    }
  },

  githubSignup: async () => {
    try {
      // Generate GitHub OAuth URL
      const githubAuthUrl = getGitHubAuthUrl();
      // Redirect to GitHub OAuth
      throw redirect(303, githubAuthUrl);
    } catch (error: any) {
      // If it's a redirect, re-throw it (this is normal SvelteKit behavior)
      if (error?.status === 303) {
        throw error;
      }
      
      console.error('GitHub signup error:', error);
      
      // Check if it's a missing environment variable error
      if (error.message?.includes('environment variable')) {
        return fail(500, {
          error: 'GitHub OAuth is not configured. Please check server configuration.'
        });
      }
      
      return fail(500, {
        error: `Failed to initiate GitHub signup: ${error.message || 'Unknown error'}`
      });
    }
  }
};
