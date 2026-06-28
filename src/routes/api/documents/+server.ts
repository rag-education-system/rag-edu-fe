import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const query = new URLSearchParams();
		query.set('status', url.searchParams.get('status') || 'COMPLETED');
		query.set('page', url.searchParams.get('page') || '1');
		query.set('limit', url.searchParams.get('limit') || '100');

		const response = await fetch(`${API_BASE_URL}/api/documents?${query.toString()}`, {
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
				{ error: (data as { error?: string }).error || 'Gagal memuat daftar dokumen' },
				{ status: response.status }
			);
		}

		return json({ success: true, data: data.data ?? [], meta: data.meta ?? null });
	} catch {
		return json({ error: 'Terjadi kesalahan saat memuat daftar dokumen' }, { status: 500 });
	}
};
