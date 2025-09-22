import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const email = url.searchParams.get('email');
  const provider = url.searchParams.get('provider') || 'local';
  
  return {
    email: email || '',
    provider: provider as 'google' | 'github' | 'local'
  };
};
