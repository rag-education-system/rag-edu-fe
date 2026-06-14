import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$lib/api/client';

type ChatHistoryPayload = {
	role: 'user' | 'assistant';
	content: string;
};

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const query = body.query as string;
		const history = (body.history as ChatHistoryPayload[] | undefined) ?? [];

		if (!query || query.trim().length < 3) {
			return json({ error: 'Pertanyaan minimal 3 karakter' }, { status: 400 });
		}

		if (query.length > 500) {
			return json({ error: 'Pertanyaan maksimal 500 karakter' }, { status: 400 });
		}

		const sanitizedHistory = history
			.filter((item) => item?.content?.trim() && (item.role === 'user' || item.role === 'assistant'))
			.slice(-20)
			.map((item) => ({
				role: item.role,
				content: item.content.trim().slice(0, 2000)
			}));

		const response = await fetch(`${API_BASE_URL}/api/documents/query`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.token}`
			},
			body: JSON.stringify({
				query: query.trim(),
				history: sanitizedHistory
			})
		});

		const data = await response.json();

		if (response.status === 401) {
			cookies.delete('auth_token', { path: '/' });
			cookies.delete('user', { path: '/' });
			return json({ error: 'Session expired' }, { status: 401 });
		}

		if (!response.ok) {
			return json(
				{ error: data.error || 'Gagal mendapatkan jawaban' },
				{ status: response.status }
			);
		}

		return json({
			success: true,
			data
		});
	} catch {
		return json({ error: 'Terjadi kesalahan saat memproses pertanyaan' }, { status: 500 });
	}
};
