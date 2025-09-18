import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Delete the session
  await deleteSession(cookies);
  
  // Redirect to signup page
  throw redirect(303, '/signup');
};