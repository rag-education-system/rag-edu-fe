import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

function handleAuthError(response: Response, cookies: import('@sveltejs/kit').Cookies) {
	if (response.status === 401) {
		cookies.delete('auth_token', { path: '/' });
		cookies.delete('user', { path: '/' });
		return json({ error: 'Session expired' }, { status: 401 });
	}
	return null;
}

export const GET: RequestHandler = async ({ params, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${params.id}`, {
			headers: { Authorization: `Bearer ${locals.token}` }
		});

		const authErr = handleAuthError(response, cookies);
		if (authErr) return authErr;

		const data = await response.json();
		if (!response.ok) {
			return json({ error: data.error || 'Gagal memuat percakapan' }, { status: response.status });
		}

		return json({ success: true, data });
	} catch {
		return json({ error: 'Terjadi kesalahan saat memuat percakapan' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${params.id}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${locals.token}` }
		});

		const authErr = handleAuthError(response, cookies);
		if (authErr) return authErr;

		const data = await response.json();
		if (!response.ok) {
			return json({ error: data.error || 'Gagal menghapus percakapan' }, { status: response.status });
		}

		return json({ success: true, data });
	} catch {
		return json({ error: 'Terjadi kesalahan saat menghapus percakapan' }, { status: 500 });
	}
};
