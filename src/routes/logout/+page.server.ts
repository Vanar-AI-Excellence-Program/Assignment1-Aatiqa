import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Delete the session and redirect to home page
  await deleteSession(cookies);
  throw redirect(303, '/signup');
};