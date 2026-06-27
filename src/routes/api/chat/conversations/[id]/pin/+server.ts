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

export const PATCH: RequestHandler = async ({ params, request, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${params.id}/pin`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.token}`
			},
			body: JSON.stringify({ pinned: Boolean(body.pinned) })
		});

		const authErr = handleAuthError(response, cookies);
		if (authErr) return authErr;

		const data = await response.json();
		if (!response.ok) {
			return json({ error: data.error || 'Gagal memperbarui pin' }, { status: response.status });
		}

		return json({ success: true, data: data.data });
	} catch {
		return json({ error: 'Terjadi kesalahan saat memperbarui pin' }, { status: 500 });
	}
};
