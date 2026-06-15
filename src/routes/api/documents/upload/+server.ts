import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();

		const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${locals.token}`
			},
			body: formData
		});

		const data = await response.json();

		if (response.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			return json({ error: 'Session expired' }, { status: 401 });
		}

		if (!response.ok) {
			return json(
				{ error: (data as { error?: string }).error || 'Gagal upload dokumen' },
				{ status: response.status }
			);
		}

		return json(data);
	} catch {
		return json({ error: 'Terjadi kesalahan saat upload dokumen' }, { status: 500 });
	}
};
