import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const contentType = request.headers.get('content-type');
	if (!contentType?.includes('multipart/form-data')) {
		return json({ error: 'Content-Type multipart/form-data diperlukan' }, { status: 400 });
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${locals.token}`,
				'Content-Type': contentType
			},
			// Stream body through — avoid buffering the entire file in Node memory.
			body: request.body,
			duplex: 'half'
		} as RequestInit);

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
	} catch (err) {
		const message =
			err instanceof Error && err.message.includes('fetch failed')
				? 'Tidak dapat terhubung ke server backend. Coba lagi.'
				: 'Terjadi kesalahan saat upload dokumen';
		return json({ error: message }, { status: 502 });
	}
};
