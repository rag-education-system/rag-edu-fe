import { browser } from '$app/environment';
import type { QuerySourceDto } from '$lib/types/api';

export interface ChatMessageData {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	sources?: QuerySourceDto[];
	timestamp: Date;
}

interface StoredChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	sources?: QuerySourceDto[];
	timestamp: string;
}

export interface ChatConversation {
	id: string;
	title: string;
	messages: StoredChatMessage[];
	createdAt: string;
	updatedAt: string;
	isDraft?: boolean;
}

const ACTIVE_KEY = 'rag_chat_active_id';

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function serializeMessages(messages: ChatMessageData[]): StoredChatMessage[] {
	return messages.map((message) => ({
		...message,
		timestamp: message.timestamp.toISOString()
	}));
}

function deserializeMessages(messages: StoredChatMessage[]): ChatMessageData[] {
	return messages.map((message) => ({
		...message,
		timestamp: new Date(message.timestamp)
	}));
}

function formatRelativeTime(isoDate: string): string {
	const date = new Date(isoDate);
	const diffMs = Date.now() - date.getTime();
	const diffMinutes = Math.floor(diffMs / 60000);

	if (diffMinutes < 1) return 'Baru saja';
	if (diffMinutes < 60) return `${diffMinutes} mnt lalu`;

	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours} jam lalu`;

	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'short'
	}).format(date);
}

function mapApiSources(sources: Array<Record<string, unknown>> | undefined): QuerySourceDto[] {
	if (!sources) return [];
	return sources.map((s) => ({
		documentId: String(s.documentId ?? ''),
		documentName: String(s.documentName ?? ''),
		similarity: Number(s.similarity ?? 0),
		content: String(s.content ?? ''),
		chunkIndex: Number(s.chunkIndex ?? 0),
		pageNumber: Number(s.pageNumber ?? 0),
		lowConfidence: Boolean(s.lowConfidence)
	}));
}

class ChatStore {
	conversations = $state<ChatConversation[]>([]);
	activeId = $state<string | null>(null);
	loading = $state(false);
	private initialized = false;

	init() {
		if (!browser || this.initialized) return;
		this.initialized = true;
		this.activeId = localStorage.getItem(ACTIVE_KEY);
		void this.loadFromServer();
	}

	get activeConversation(): ChatConversation | null {
		if (!this.activeId) return null;
		return this.conversations.find((conversation) => conversation.id === this.activeId) ?? null;
	}

	get activeMessages(): ChatMessageData[] {
		return deserializeMessages(this.activeConversation?.messages ?? []);
	}

	get historyConversations(): ChatConversation[] {
		return [...this.conversations]
			.filter((conversation) => conversation.messages.length > 0 || !conversation.isDraft)
			.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}

	async loadFromServer() {
		if (!browser) return;
		this.loading = true;

		try {
			const response = await fetch('/api/chat/conversations?limit=50');
			const result = await response.json();

			if (response.ok && result.data) {
				const serverConvs: ChatConversation[] = result.data.map(
					(c: { id: string; title: string; createdAt: string; updatedAt: string }) => ({
						id: c.id,
						title: c.title,
						messages: [],
						createdAt: c.createdAt,
						updatedAt: c.updatedAt
					})
				);

				const draft = this.conversations.find((c) => c.isDraft);
				this.conversations = draft ? [draft, ...serverConvs] : serverConvs;
			}
		} catch {
			// keep local state on failure
		} finally {
			this.loading = false;
			this.ensureActiveConversation();
		}
	}

	createNewChat(): string {
		const current = this.activeConversation;
		if (current?.isDraft && current.messages.length === 0) {
			return current.id;
		}

		const conversation: ChatConversation = {
			id: `draft-${generateId()}`,
			title: 'Chat Baru',
			messages: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isDraft: true
		};

		this.conversations = [conversation, ...this.conversations.filter((c) => !c.isDraft || c.messages.length > 0)];
		this.activeId = conversation.id;
		this.persistActiveId();
		return conversation.id;
	}

	async selectConversation(id: string) {
		if (!this.conversations.some((conversation) => conversation.id === id)) return;
		this.activeId = id;
		this.persistActiveId();

		const conv = this.conversations.find((c) => c.id === id);
		if (!conv || conv.isDraft || conv.messages.length > 0) return;

		try {
			const response = await fetch(`/api/chat/conversations/${id}`);
			const result = await response.json();

			if (response.ok && result.data?.messages) {
				const messages: StoredChatMessage[] = result.data.messages.map(
					(m: {
						id: string;
						role: string;
						content: string;
						sources?: Array<Record<string, unknown>>;
						createdAt: string;
					}) => ({
						id: m.id,
						role: m.role as 'user' | 'assistant',
						content: m.content,
						sources: mapApiSources(m.sources),
						timestamp: m.createdAt
					})
				);

				this.conversations = this.conversations.map((c) =>
					c.id === id ? { ...c, messages, title: result.data.conversation?.title ?? c.title } : c
				);
			}
		} catch {
			// ignore load errors
		}
	}

	async deleteConversation(id: string) {
		const conv = this.conversations.find((c) => c.id === id);

		if (conv && !conv.isDraft) {
			try {
				await fetch(`/api/chat/conversations/${id}`, { method: 'DELETE' });
			} catch {
				// continue with local removal
			}
		}

		this.conversations = this.conversations.filter((conversation) => conversation.id !== id);

		if (this.activeId === id) {
			const next = this.historyConversations[0] ?? this.conversations[0];
			this.activeId = next?.id ?? null;
			if (!this.activeId) {
				this.createNewChat();
			}
		}

		this.persistActiveId();
	}

	async sendMessageStream(
		message: string,
		callbacks: {
			onConversationId?: (id: string) => void;
			onSources?: (sources: QuerySourceDto[]) => void;
			onToken?: (token: string) => void;
		}
	): Promise<{
		userMessage: ChatMessageData;
		assistantMessage: ChatMessageData;
		conversationId: string;
	} | null> {
		if (!this.activeId) {
			this.createNewChat();
		}

		const activeId = this.activeId!;
		const conv = this.conversations.find((c) => c.id === activeId);
		const isDraft = conv?.isDraft ?? activeId.startsWith('draft-');
		const conversationId = isDraft ? '' : activeId;

		const response = await fetch('/api/chat/stream', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, conversationId })
		});

		if (!response.ok || !response.body) {
			const result = await response.json().catch(() => ({}));
			throw new Error(result.error || 'Gagal mendapatkan jawaban');
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder();
		let buffer = '';
		let resolvedConversationId = conversationId;
		let answer = '';
		let sources: QuerySourceDto[] = [];

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');
			buffer = lines.pop() ?? '';

			for (const line of lines) {
				if (!line.startsWith('data: ')) continue;
				const payload = line.slice(6).trim();
				if (!payload) continue;

				let chunk: {
					type: string;
					content?: string;
					conversationId?: string;
					sources?: Array<Record<string, unknown>>;
					error?: string;
				};
				try {
					chunk = JSON.parse(payload);
				} catch {
					continue;
				}

				if (chunk.type === 'error') {
					throw new Error(chunk.error || 'Stream error');
				}
				if (chunk.type === 'conversation_id' && chunk.conversationId) {
					resolvedConversationId = chunk.conversationId;
					callbacks.onConversationId?.(chunk.conversationId);
				}
				if (chunk.type === 'sources' && chunk.sources) {
					sources = mapApiSources(chunk.sources);
					callbacks.onSources?.(sources);
				}
				if (chunk.type === 'content' && chunk.content) {
					answer += chunk.content;
					callbacks.onToken?.(chunk.content);
				}
			}
		}

		const userMessage: ChatMessageData = {
			id: generateId(),
			role: 'user',
			content: message,
			timestamp: new Date()
		};

		const assistantMessage: ChatMessageData = {
			id: generateId(),
			role: 'assistant',
			content: answer,
			sources,
			timestamp: new Date()
		};

		const now = new Date().toISOString();
		const title =
			conv?.title && conv.title !== 'Chat Baru'
				? conv.title
				: message.length > 50
					? message.slice(0, 50) + '...'
					: message;

		if (isDraft) {
			this.conversations = this.conversations.map((c) =>
				c.id === activeId
					? {
							id: resolvedConversationId,
							title,
							messages: serializeMessages([userMessage, assistantMessage]),
							createdAt: now,
							updatedAt: now
						}
					: c
			);
			this.activeId = resolvedConversationId;
		} else {
			this.conversations = this.conversations.map((c) =>
				c.id === activeId
					? {
							...c,
							messages: [...c.messages, ...serializeMessages([userMessage, assistantMessage])],
							updatedAt: now
						}
					: c
			);
		}

		this.persistActiveId();
		return { userMessage, assistantMessage, conversationId: resolvedConversationId };
	}

	async sendMessage(message: string): Promise<{
		userMessage: ChatMessageData;
		assistantMessage: ChatMessageData;
		conversationId: string;
	} | null> {
		if (!this.activeId) {
			this.createNewChat();
		}

		const activeId = this.activeId!;
		const conv = this.conversations.find((c) => c.id === activeId);
		const isDraft = conv?.isDraft ?? activeId.startsWith('draft-');

		const endpoint = isDraft
			? '/api/chat/conversations'
			: `/api/chat/conversations/${activeId}/messages`;

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message })
		});

		const result = await response.json();
		if (!response.ok || !result.success) {
			throw new Error(result.error || 'Gagal mendapatkan jawaban');
		}

		const data = result.data;
		const conversationId = data.conversationId as string;

		const userMessage: ChatMessageData = {
			id: data.userMessage.id,
			role: 'user',
			content: data.userMessage.content,
			timestamp: new Date(data.userMessage.createdAt ?? Date.now())
		};

		const assistantMessage: ChatMessageData = {
			id: data.assistantMessage.id,
			role: 'assistant',
			content: data.assistantMessage.content,
			sources: mapApiSources(data.assistantMessage.sources),
			timestamp: new Date(data.assistantMessage.createdAt ?? Date.now())
		};

		const now = new Date().toISOString();
		const title =
			conv?.title && conv.title !== 'Chat Baru'
				? conv.title
				: message.length > 50
					? message.slice(0, 50) + '...'
					: message;

		if (isDraft) {
			this.conversations = this.conversations.map((c) =>
				c.id === activeId
					? {
							id: conversationId,
							title,
							messages: serializeMessages([userMessage, assistantMessage]),
							createdAt: now,
							updatedAt: now
						}
					: c
			);
			this.activeId = conversationId;
		} else {
			this.conversations = this.conversations.map((c) =>
				c.id === activeId
					? {
							...c,
							messages: [...c.messages, ...serializeMessages([userMessage, assistantMessage])],
							updatedAt: now
						}
					: c
			);
		}

		this.persistActiveId();
		return { userMessage, assistantMessage, conversationId };
	}

	saveMessages(messages: ChatMessageData[]) {
		if (!this.activeId) return;

		const activeId = this.activeId;
		const now = new Date().toISOString();

		this.conversations = this.conversations.map((conversation) => {
			if (conversation.id !== activeId) return conversation;
			return {
				...conversation,
				messages: serializeMessages(messages),
				updatedAt: now
			};
		});
	}

	formatUpdatedAt(isoDate: string): string {
		return formatRelativeTime(isoDate);
	}

	private ensureActiveConversation() {
		if (this.activeId && this.conversations.some((conversation) => conversation.id === this.activeId)) {
			return;
		}

		if (this.conversations.length > 0) {
			this.activeId = this.conversations[0].id;
			this.persistActiveId();
			return;
		}

		this.createNewChat();
	}

	private persistActiveId() {
		if (!browser) return;
		if (this.activeId) {
			localStorage.setItem(ACTIVE_KEY, this.activeId);
		} else {
			localStorage.removeItem(ACTIVE_KEY);
		}
	}
}

export const chatStore = new ChatStore();
