import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

export const POST: RequestHandler = async ({ request, params, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const message = (body.message as string)?.trim();

		if (!message || message.length < 1) {
			return json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
		}

		const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${params.id}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.token}`
			},
			body: JSON.stringify({ message })
		});

		if (response.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			return json({ error: 'Session expired' }, { status: 401 });
		}

		const data = await response.json();
		if (!response.ok) {
			return json({ error: data.error || 'Gagal mengirim pesan' }, { status: response.status });
		}

		return json({ success: true, data });
	} catch {
		return json({ error: 'Terjadi kesalahan saat mengirim pesan' }, { status: 500 });
	}
};
