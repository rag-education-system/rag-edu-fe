import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

export const GET: RequestHandler = async ({ params, locals, cookies, url }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const inline = url.searchParams.get('inline');
	const query = inline ? `?inline=${encodeURIComponent(inline)}` : '';

	try {
		const response = await fetch(`${API_BASE_URL}/api/documents/${params.id}/download${query}`, {
			headers: {
				Authorization: `Bearer ${locals.token}`
			}
		});

		if (response.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			return json({ error: 'Session expired' }, { status: 401 });
		}

		if (!response.ok) {
			const data = await response.json().catch(() => ({}));
			return json(
				{ error: (data as { error?: string }).error || 'Gagal memuat dokumen' },
				{ status: response.status }
			);
		}

		const buffer = await response.arrayBuffer();

		return new Response(buffer, {
			status: 200,
			headers: {
				'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
				'Content-Disposition': response.headers.get('Content-Disposition') || 'inline',
				'Cache-Control': 'private, max-age=3600'
			}
		});
	} catch {
		return json({ error: 'Terjadi kesalahan saat memuat dokumen' }, { status: 500 });
	}
};
