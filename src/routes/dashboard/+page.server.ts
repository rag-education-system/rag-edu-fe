import { api } from '$lib/api/client';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { AxiosError } from 'axios';

export const load: PageServerLoad = async ({ locals, cookies }) => {
	// Redirect jika belum login
	if (!locals.token) {
		throw redirect(303, '/auth/login?redirect=/dashboard');
	}

	try {
		// Fetch documents dengan pagination
		const response = await api.documentsControllerListDocuments(
			{ page: 1, limit: 10 },
			{ headers: { Authorization: `Bearer ${locals.token}` } }
		);

		// Hitung statistik
		const statistics = {
			totalDocuments: response.data.meta.total,
			processing: response.data.data.filter((d) => d.status === 'PROCESSING').length,
			completed: response.data.data.filter((d) => d.status === 'COMPLETED').length,
			failed: response.data.data.filter((d) => d.status === 'FAILED').length,
			totalStorage: response.data.data.reduce((sum, d) => sum + d.fileSize, 0),
			recentActivity: response.data.data.filter(
				(d) => new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
			).length
		};

		return {
			user: locals.user,
			documents: response.data.data,
			meta: response.data.meta,
			statistics
		};
	} catch (error) {
		// Handle 401 - token expired
		if (error instanceof AxiosError && error.response?.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			throw redirect(303, '/auth/login');
		}

		// Return empty state on error
		return {
			user: locals.user,
			documents: [],
			meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
			statistics: {
				totalDocuments: 0,
				processing: 0,
				completed: 0,
				failed: 0,
				totalStorage: 0,
				recentActivity: 0
			},
			error: 'Gagal memuat data dashboard'
		};
	}
};
