import type { Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { api } from '$lib/api/client';
import { AxiosError } from 'axios';

export const actions: Actions = {
	query: async ({ request, locals, cookies }) => {
		if (!locals.token) {
			throw redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const query = formData.get('query') as string;

		if (!query || query.trim().length < 3) {
			return fail(400, {
				error: 'Pertanyaan minimal 3 karakter',
				success: false
			});
		}

		if (query.length > 500) {
			return fail(400, {
				error: 'Pertanyaan maksimal 500 karakter',
				success: false
			});
		}

		try {
			const response = await api.documentsControllerQueryDocuments(
				{
					query: query.trim()
				},
				{
					headers: {
						Authorization: `Bearer ${locals.token}`
					}
				}
			);

			return {
				success: true,
				data: response.data
			};
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					cookies.delete('auth_token', { path: '/' });
					cookies.delete('user', { path: '/' });
					throw redirect(303, '/auth/login');
				}

				const message = err.response?.data?.message || 'Gagal mendapatkan jawaban';
				return fail(err.response?.status || 500, {
					error: Array.isArray(message) ? message[0] : message,
					success: false
				});
			}

			return fail(500, {
				error: 'Terjadi kesalahan saat memproses pertanyaan',
				success: false
			});
		}
	}
};
