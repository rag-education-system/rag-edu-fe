import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';
import { AxiosError } from 'axios';

export const GET: RequestHandler = async ({ params, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/documents/${params.id}/chunks`, {
			headers: {
				Authorization: `Bearer ${locals.token}`
			}
		});

		const data = await response.json();

		if (response.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			return json({ error: 'Session expired' }, { status: 401 });
		}

		if (!response.ok) {
			return json(
				{ error: data.error || 'Gagal memuat preview dokumen' },
				{ status: response.status }
			);
		}

		return json({ success: true, data });
	} catch (err) {
		if (err instanceof AxiosError) {
			return json({ error: 'Gagal memuat preview dokumen' }, { status: 500 });
		}
		return json({ error: 'Terjadi kesalahan saat memuat preview dokumen' }, { status: 500 });
	}
};
