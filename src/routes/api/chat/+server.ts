import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { api } from '$lib/api/client';
import { AxiosError } from 'axios';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const query = body.query as string;

		if (!query || query.trim().length < 3) {
			return json({ error: 'Pertanyaan minimal 3 karakter' }, { status: 400 });
		}

		if (query.length > 500) {
			return json({ error: 'Pertanyaan maksimal 500 karakter' }, { status: 400 });
		}

		const response = await api.documentsControllerQueryDocuments(
			{ query: query.trim() },
			{
				headers: {
					Authorization: `Bearer ${locals.token}`
				}
			}
		);

		return json({
			success: true,
			data: response.data
		});
	} catch (err) {
		if (err instanceof AxiosError) {
			if (err.response?.status === 401) {
				cookies.delete('auth_token', { path: '/' });
				cookies.delete('user', { path: '/' });
				return json({ error: 'Session expired' }, { status: 401 });
			}

			const message = err.response?.data?.message || 'Gagal mendapatkan jawaban';
			return json(
				{ error: Array.isArray(message) ? message[0] : message },
				{ status: err.response?.status || 500 }
			);
		}

		return json({ error: 'Terjadi kesalahan saat memproses pertanyaan' }, { status: 500 });
	}
};
