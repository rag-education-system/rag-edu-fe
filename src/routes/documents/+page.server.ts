import { api } from '$lib/api/client';
import { authHeaders, redirectToLogin, requireAuth } from '$lib/utils/auth';
import type { PageServerLoad } from './$types';
import { AxiosError } from 'axios';

const emptyMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };

export const load: PageServerLoad = async (event) => {
	const { token } = requireAuth(event);
	const page = parseInt(event.url.searchParams.get('page') || '1');
	const limit = parseInt(event.url.searchParams.get('limit') || '10');
	const status = event.url.searchParams.get('status') as 'PROCESSING' | 'COMPLETED' | 'FAILED' | null;

	try {
		const response = await api.documentsList(
			{
				page,
				limit,
				...(status && { status })
			},
			{ headers: authHeaders(token) }
		);

		return {
			documents: response.data.data ?? [],
			meta: response.data.meta ?? emptyMeta,
			filters: {
				status,
				page,
				limit
			}
		};
	} catch (err) {
		if (err instanceof AxiosError && err.response?.status === 401) {
			redirectToLogin(event);
		}

		return {
			documents: [],
			meta: emptyMeta,
			filters: {
				status: null,
				page: 1,
				limit: 10
			},
			error: 'Gagal memuat daftar dokumen'
		};
	}
};
