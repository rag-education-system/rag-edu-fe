/**
 * SSE utility untuk streaming chat RAG-EDU (go-rag-edu).
 * Pola diadopsi dari AI-Hukum-FE, disesuaikan dengan DTO camelCase backend.
 */

export type StreamChunkType =
	| 'content'
	| 'done'
	| 'error'
	| 'metadata'
	| 'sources'
	| 'conversation_id'
	| 'status';

export interface StreamChunk {
	type: StreamChunkType;
	content?: string;
	conversationId?: string;
	sources?: Array<Record<string, unknown>>;
	error?: string;
	metadata?: Record<string, unknown>;
}

export interface SSEStreamOptions {
	url: string;
	method?: string;
	headers?: Record<string, string>;
	body?: Record<string, unknown>;
	onChunk?: (chunk: StreamChunk) => void;
	onComplete?: () => void;
	onError?: (error: string) => void;
	signal?: AbortSignal;
}

function parseSSELine(line: string): StreamChunk | null {
	if (line.startsWith('data: ')) {
		const data = line.slice(6).trim();
		if (!data) return null;

		try {
			return JSON.parse(data) as StreamChunk;
		} catch {
			return null;
		}
	}

	if (line.startsWith(':')) {
		return null;
	}

	return null;
}

function processBuffer(
	buffer: string,
	onChunk?: (chunk: StreamChunk) => void
): { buffer: string; done: boolean; error?: string } {
	const lines = buffer.split('\n');
	const remaining = lines.pop() ?? '';

	for (const line of lines) {
		if (!line.trim()) continue;

		const chunk = parseSSELine(line);
		if (!chunk) continue;

		onChunk?.(chunk);

		if (chunk.type === 'error') {
			return { buffer: remaining, done: true, error: chunk.error || 'Stream error' };
		}

		if (chunk.type === 'done') {
			return { buffer: remaining, done: true };
		}
	}

	return { buffer: remaining, done: false };
}

export async function streamSSE(options: SSEStreamOptions): Promise<void> {
	const {
		url,
		method = 'POST',
		headers = {},
		body,
		onChunk,
		onComplete,
		onError,
		signal
	} = options;

	const response = await fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'text/event-stream',
			...headers
		},
		body: body ? JSON.stringify(body) : undefined,
		signal
	});

	if (!response.ok) {
		const result = await response.json().catch(() => ({}));
		throw new Error((result as { error?: string }).error || `HTTP ${response.status}`);
	}

	if (!response.body) {
		throw new Error('Response body is null');
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { done, value } = await reader.read();

		if (done) {
			const final = processBuffer(buffer, onChunk);
			if (final.error) {
				onError?.(final.error);
				throw new Error(final.error);
			}
			break;
		}

		buffer += decoder.decode(value, { stream: true });
		const result = processBuffer(buffer, onChunk);
		buffer = result.buffer;

		if (result.error) {
			onError?.(result.error);
			throw new Error(result.error);
		}

		if (result.done) {
			onComplete?.();
			return;
		}
	}

	onComplete?.();
}

export function createStreamController(): AbortController {
	return new AbortController();
}
