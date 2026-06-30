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
		const documentId = (body.documentId as string) || '';
		const chatMode = (body.chatMode as string) || 'hybrid';

		if (!message) {
			return json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
		}

		const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.token}`
			},
			body: JSON.stringify({ message, conversationId, documentId, chatMode })
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

		// Pipe upstream SSE through a TransformStream so chunks flush immediately
		// instead of being buffered by the SvelteKit proxy response.
		const { readable, writable } = new TransformStream();
		void response.body.pipeTo(writable);

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache, no-transform',
				Connection: 'keep-alive',
				'X-Accel-Buffering': 'no'
			}
		});
	} catch {
		return json({ error: 'Terjadi kesalahan saat memproses stream' }, { status: 500 });
	}
};
