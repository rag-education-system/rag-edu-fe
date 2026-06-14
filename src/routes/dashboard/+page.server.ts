import { api } from '$lib/api/client';
import { authHeaders, redirectToLogin, requireAuth } from '$lib/utils/auth';
import type { PageServerLoad } from './$types';
import { AxiosError } from 'axios';

const emptyMeta = { total: 0, page: 1, limit: 10, totalPages: 0 };

export const load: PageServerLoad = async (event) => {
	const { token, user } = requireAuth(event);

	try {
		const response = await api.documentsList(
			{ page: 1, limit: 10 },
			{ headers: authHeaders(token) }
		);

		const documents = response.data.data ?? [];
		const meta = response.data.meta ?? emptyMeta;

		const statistics = {
			totalDocuments: meta.total ?? 0,
			processing: documents.filter((d) => d.status === 'PROCESSING').length,
			completed: documents.filter((d) => d.status === 'COMPLETED').length,
			failed: documents.filter((d) => d.status === 'FAILED').length,
			totalStorage: documents.reduce((sum, d) => sum + (d.fileSize ?? 0), 0),
			recentActivity: documents.filter((d) => {
				if (!d.createdAt) return false;
				return new Date(d.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
			}).length
		};

		return {
			user,
			documents,
			meta,
			statistics
		};
	} catch (err) {
		if (err instanceof AxiosError && err.response?.status === 401) {
			redirectToLogin(event);
		}

		return {
			user,
			documents: [],
			meta: emptyMeta,
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
