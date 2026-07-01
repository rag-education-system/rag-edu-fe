import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_BASE_URL } from '$lib/api/client';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.token) {
		throw redirect(303, '/auth/login?redirect=/documents/upload');
	}

	return {
		user: locals.user,
		upload: {
			apiUrl: API_BASE_URL,
			token: locals.token
		}
	};
};
