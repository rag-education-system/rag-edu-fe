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

export const GET: RequestHandler = async ({ locals, cookies, url }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const page = url.searchParams.get('page') ?? '1';
	const limit = url.searchParams.get('limit') ?? '20';

	try {
		const response = await fetch(
			`${API_BASE_URL}/api/chat/conversations?page=${page}&limit=${limit}`,
			{ headers: { Authorization: `Bearer ${locals.token}` } }
		);

		const authErr = handleAuthError(response, cookies);
		if (authErr) return authErr;

		const data = await response.json();
		if (!response.ok) {
			return json({ error: data.error || 'Gagal memuat percakapan' }, { status: response.status });
		}

		return json({ success: true, ...data });
	} catch {
		return json({ error: 'Terjadi kesalahan saat memuat percakapan' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const message = (body.message as string)?.trim();

		if (!message || message.length < 1) {
			return json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
		}

		const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.token}`
			},
			body: JSON.stringify({ message })
		});

		const authErr = handleAuthError(response, cookies);
		if (authErr) return authErr;

		const data = await response.json();
		if (!response.ok) {
			return json({ error: data.error || 'Gagal membuat percakapan' }, { status: response.status });
		}

		return json({ success: true, data });
	} catch {
		return json({ error: 'Terjadi kesalahan saat membuat percakapan' }, { status: 500 });
	}
};
