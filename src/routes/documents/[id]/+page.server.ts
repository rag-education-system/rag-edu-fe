import { api } from '$lib/api/client';
import { authHeaders, redirectToLogin, requireAuth } from '$lib/utils/auth';
import type { Actions, PageServerLoad } from './$types';
import { AxiosError } from 'axios';
import { error, fail, isRedirect, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { token } = requireAuth(event);
	const { id } = event.params;

	try {
		const response = await api.documentsDetail(id, {
			headers: authHeaders(token)
		});

		return {
			document: response.data
		};
	} catch (err) {
		if (err instanceof AxiosError) {
			if (err.response?.status === 401) {
				redirectToLogin(event);
			}

			if (err.response?.status === 404) {
				error(404, 'Dokumen tidak ditemukan');
			}
		}

		error(500, 'Gagal memuat detail dokumen');
	}
};

export const actions: Actions = {
	reprocess: async (event) => {
		const { token } = requireAuth(event);
		const { id } = event.params;

		try {
			await api.documentsReprocess(id, {
				headers: authHeaders(token)
			});

			return { success: true };
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					redirectToLogin(event);
				}

				return fail(400, {
					error: err.response?.data?.error ?? 'Gagal memproses ulang dokumen'
				});
			}

			return fail(500, { error: 'Terjadi kesalahan server' });
		}
	},
	delete: async (event) => {
		const { token } = requireAuth(event);
		const { id } = event.params;

		try {
			await api.documentsDelete(id, {
				headers: authHeaders(token)
			});

			throw redirect(303, '/documents');
		} catch (err) {
			if (isRedirect(err)) {
				throw err;
			}

			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					redirectToLogin(event);
				}

				return fail(400, {
					error: err.response?.data?.error ?? 'Gagal menghapus dokumen'
				});
			}

			return fail(500, { error: 'Terjadi kesalahan server' });
		}
	}
};
