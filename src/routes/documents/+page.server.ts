import { api } from '$lib/api/client';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	if (!locals.token) {
		throw redirect(303, '/auth/login?redirect=/documents');
	}

	// Get query params for pagination and filtering
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const status = url.searchParams.get('status') as 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

	try {
		const response = await api.documentsControllerListDocuments(
			{
				page,
				limit,
				...(status && { status })
			},
			{ headers: { Authorization: `Bearer ${locals.token}` } }
		);

		return {
			documents: response.data.data,
			meta: response.data.meta,
			filters: {
				status,
				page,
				limit
			}
		};
	} catch (error) {
		if (error instanceof AxiosError && error.response?.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			throw redirect(303, '/auth/login');
		}

		return {
			documents: [],
			meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
			filters: {
				status: null,
				page: 1,
				limit: 10
			},
			error: 'Gagal memuat daftar dokumen'
		};
	}
};
