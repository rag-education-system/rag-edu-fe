import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const message = (body.message as string)?.trim();
		const conversationId = (body.conversationId as string) || '';

		if (!message) {
			return json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
		}

		const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.token}`
			},
			body: JSON.stringify({ message, conversationId })
		});

		if (response.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			return json({ error: 'Session expired' }, { status: 401 });
		}

		if (!response.ok || !response.body) {
			const data = await response.json().catch(() => ({}));
			return json({ error: data.error || 'Gagal memulai stream' }, { status: response.status });
		}

		return new Response(response.body, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch {
		return json({ error: 'Terjadi kesalahan saat memproses stream' }, { status: 500 });
	}
};
