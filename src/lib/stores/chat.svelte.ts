import { browser } from '$app/environment';
import { API_BASE_URL } from '$lib/api/client';
import type { QuerySourceDto } from '$lib/types/api';
import { streamSSE } from '$lib/utils/sse';

export type ChatMode = 'hybrid' | 'strict';
export type ChatResponseType = 'document' | 'general' | 'refusal';

export interface ChatMessageData {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	sources?: QuerySourceDto[];
	timestamp: Date;
	responseType?: ChatResponseType;
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
	pinned?: boolean;
	documentId?: string;
}

const LEGACY_ACTIVE_KEY = 'rag_chat_active_id';
const LEGACY_MODE_KEY = 'rag_chat_mode';

function activeKey(userId: string): string {
	return `rag_chat_active_id:${userId}`;
}

function modeKey(userId: string): string {
	return `rag_chat_mode:${userId}`;
}

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

function isDraftConversation(conv: ChatConversation | undefined, activeId: string): boolean {
	if (activeId.startsWith('draft-')) return true;
	return Boolean(conv?.isDraft);
}

function resolveConversationId(conv: ChatConversation | undefined, activeId: string): string {
	return isDraftConversation(conv, activeId) ? '' : activeId;
}

class ChatStore {
	conversations = $state<ChatConversation[]>([]);
	activeId = $state<string | null>(null);
	chatMode = $state<ChatMode>('hybrid');
	loading = $state(false);
	selectingConversationId = $state<string | null>(null);
	private currentUserId: string | null = null;
	private loadVersion = 0;
	private selectVersion = 0;

	reset() {
		this.loadVersion++;
		this.selectVersion++;
		this.conversations = [];
		this.activeId = null;
		this.loading = false;
		this.selectingConversationId = null;
		this.currentUserId = null;
	}

	initForUser(userId: string) {
		if (!browser || !userId) return;
		if (this.currentUserId === userId) return;

		this.reset();
		this.currentUserId = userId;

		// Bersihkan kunci lama (global, tidak per-user).
		localStorage.removeItem(LEGACY_ACTIVE_KEY);
		localStorage.removeItem(LEGACY_MODE_KEY);

		const stored = localStorage.getItem(activeKey(userId));
		if (stored && !stored.startsWith('draft-')) {
			this.activeId = stored;
		}
		const storedMode = localStorage.getItem(modeKey(userId));
		if (storedMode === 'hybrid' || storedMode === 'strict') {
			this.chatMode = storedMode;
		}
		void this.loadFromServer();
	}

	/** @deprecated Gunakan initForUser(userId) */
	init() {
		if (!browser) return;
		void this.loadFromServer();
	}

	setChatMode(mode: ChatMode) {
		this.chatMode = mode;
		if (browser && this.currentUserId) {
			localStorage.setItem(modeKey(this.currentUserId), mode);
		}
	}

	get activeConversation(): ChatConversation | null {
		if (!this.activeId) return null;
		return this.conversations.find((conversation) => conversation.id === this.activeId) ?? null;
	}

	get activeMessages(): ChatMessageData[] {
		return deserializeMessages(this.activeConversation?.messages ?? []);
	}

	get activeDocumentId(): string | null {
		return this.activeConversation?.documentId ?? null;
	}

	get historyConversations(): ChatConversation[] {
		return [...this.conversations]
			.filter((conversation) => conversation.messages.length > 0 || !conversation.isDraft)
			.sort((a, b) => {
				if (Boolean(a.pinned) !== Boolean(b.pinned)) {
					return a.pinned ? -1 : 1;
				}
				return b.updatedAt.localeCompare(a.updatedAt);
			});
	}

	private mergeConversations(serverConvs: ChatConversation[]): ChatConversation[] {
		const existingMap = new Map(this.conversations.map((c) => [c.id, c]));

		const mergedServer = serverConvs.map((sc) => {
			const existing = existingMap.get(sc.id);
			if (existing?.messages.length) {
				return {
					...sc,
					messages: existing.messages,
					title: existing.title || sc.title,
					pinned: sc.pinned ?? existing.pinned,
					documentId: existing.documentId || sc.documentId
				};
			}
			return sc;
		});

		const serverIds = new Set(serverConvs.map((c) => c.id));
		const localOnly = this.conversations.filter(
			(c) => !serverIds.has(c.id) && (c.isDraft || c.messages.length > 0)
		);

		const draft = localOnly.find((c) => c.isDraft);
		const rest = localOnly.filter((c) => !c.isDraft);

		return draft ? [draft, ...mergedServer, ...rest] : [...rest, ...mergedServer];
	}

	async loadFromServer() {
		if (!browser) return;

		const version = ++this.loadVersion;
		this.loading = true;

		try {
			const response = await fetch('/api/chat/conversations?limit=50');
			const result = await response.json();

			if (version !== this.loadVersion) return;

			if (response.ok && result.data) {
				const serverConvs: ChatConversation[] = result.data.map(
					(c: {
						id: string;
						title: string;
						createdAt: string;
						updatedAt: string;
						pinned?: boolean;
						documentId?: string;
					}) => ({
						id: c.id,
						title: c.title,
						messages: [],
						createdAt: c.createdAt,
						updatedAt: c.updatedAt,
						pinned: Boolean(c.pinned),
						documentId: c.documentId || undefined
					})
				);

				this.conversations = this.mergeConversations(serverConvs);
			}
		} catch {
			// keep local state on failure
		} finally {
			if (version === this.loadVersion) {
				this.loading = false;
				this.ensureActiveConversation();
				void this.restoreActiveConversationMessages();
			}
		}
	}

	private async restoreActiveConversationMessages() {
		const id = this.activeId;
		if (!id || id.startsWith('draft-')) return;

		const conv = this.conversations.find((c) => c.id === id);
		if (!conv || conv.isDraft || conv.messages.length > 0) return;

		await this.selectConversation(id);
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

		this.conversations = [
			conversation,
			...this.conversations.filter((c) => !c.isDraft || c.messages.length > 0)
		];
		this.activeId = conversation.id;
		this.persistActiveId();
		return conversation.id;
	}

	/** Buat percakapan baru terpisah yang terkunci ke satu dokumen. */
	createDocumentChat(documentId: string, title = 'Chat Baru'): string {
		const conversation: ChatConversation = {
			id: `draft-${generateId()}`,
			title,
			messages: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isDraft: true,
			documentId
		};

		this.conversations = [
			conversation,
			...this.conversations.filter((c) => !c.isDraft || c.messages.length > 0)
		];
		this.activeId = conversation.id;
		this.persistActiveId();
		return conversation.id;
	}

	/**
	 * Set fokus dokumen untuk percakapan aktif. Jika percakapan aktif masih draft
	 * kosong, scope-nya diubah di tempat; selain itu memulai percakapan baru
	 * (terpisah) sesuai pilihan. Mengembalikan id percakapan yang menjadi aktif.
	 */
	focusDocument(documentId: string | null, documentName?: string): string {
		const title = documentId ? `Tanya: ${documentName ?? 'dokumen'}` : 'Chat Baru';
		const conv = this.activeConversation;
		const isEmptyDraft = Boolean(conv?.isDraft) && (conv?.messages.length ?? 0) === 0;

		if (conv && isEmptyDraft) {
			this.conversations = this.conversations.map((c) =>
				c.id === conv.id ? { ...c, documentId: documentId ?? undefined, title } : c
			);
			return conv.id;
		}

		if (documentId) {
			return this.createDocumentChat(documentId, title);
		}
		return this.createNewChat();
	}

	/** Promote draft ke ID server segera saat chunk conversation_id diterima (pola AI-Hukum). */
	promoteDraftConversation(draftId: string, serverId: string, title?: string) {
		if (!serverId || draftId === serverId) return;

		const now = new Date().toISOString();
		let promoted = false;

		this.conversations = this.conversations.map((c) => {
			if (c.id !== draftId) return c;
			promoted = true;
			return {
				...c,
				id: serverId,
				isDraft: false,
				title: title && title !== 'Chat Baru' ? title : c.title,
				updatedAt: now
			};
		});

		if (promoted && this.activeId === draftId) {
			this.activeId = serverId;
			this.persistActiveId();
		}
	}

	async selectConversation(id: string) {
		if (!this.conversations.some((conversation) => conversation.id === id)) return;

		const version = ++this.selectVersion;
		this.activeId = id;
		this.persistActiveId();

		const conv = this.conversations.find((c) => c.id === id);
		if (!conv || conv.isDraft || conv.messages.length > 0) return;

		this.selectingConversationId = id;

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 15000);

			const response = await fetch(`/api/chat/conversations/${id}`, {
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			const result = await response.json();

			if (version !== this.selectVersion || this.activeId !== id) return;

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
					c.id === id
						? {
								...c,
								messages,
								title: result.data.conversation?.title ?? c.title,
								documentId: result.data.conversation?.documentId || c.documentId
							}
						: c
				);
			}
		} catch {
			// abaikan; activeId tetap pada percakapan yang dipilih
		} finally {
			if (this.selectingConversationId === id) {
				this.selectingConversationId = null;
			}
		}
	}

	async deleteConversation(id: string) {
		await this.deleteConversations([id]);
	}

	async deleteConversations(ids: string[]) {
		if (ids.length === 0) return;

		const idSet = new Set(ids);
		const activeDeleted = this.activeId ? idSet.has(this.activeId) : false;

		await Promise.all(
			ids.map(async (id) => {
				const conv = this.conversations.find((c) => c.id === id);
				if (conv && !conv.isDraft) {
					try {
						await fetch(`/api/chat/conversations/${id}`, { method: 'DELETE' });
					} catch {
						// continue with local removal
					}
				}
			})
		);

		this.conversations = this.conversations.filter((conversation) => !idSet.has(conversation.id));

		if (activeDeleted) {
			const next = this.historyConversations[0] ?? this.conversations[0];
			this.activeId = next?.id ?? null;
			if (!this.activeId) {
				this.createNewChat();
			}
		}

		this.persistActiveId();
	}

	async togglePinConversation(id: string, pinned: boolean) {
		const conv = this.conversations.find((c) => c.id === id);
		if (!conv || conv.isDraft) return;

		const previousPinned = Boolean(conv.pinned);
		const now = new Date().toISOString();

		this.conversations = this.conversations.map((c) =>
			c.id === id ? { ...c, pinned, updatedAt: now } : c
		);

		try {
			const response = await fetch(`/api/chat/conversations/${id}/pin`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pinned })
			});

			if (!response.ok) {
				throw new Error('Gagal memperbarui pin');
			}

			const result = await response.json();
			if (result.data?.updatedAt) {
				this.conversations = this.conversations.map((c) =>
					c.id === id
						? {
								...c,
								pinned: Boolean(result.data.pinned),
								updatedAt: result.data.updatedAt
							}
						: c
				);
			}
		} catch {
			this.conversations = this.conversations.map((c) =>
				c.id === id ? { ...c, pinned: previousPinned } : c
			);
		}
	}

	async renameConversation(id: string, title: string) {
		const conv = this.conversations.find((c) => c.id === id);
		if (!conv || conv.isDraft) return false;

		const trimmed = title.trim();
		if (!trimmed) return false;

		const previousTitle = conv.title;
		const now = new Date().toISOString();

		this.conversations = this.conversations.map((c) =>
			c.id === id ? { ...c, title: trimmed, updatedAt: now } : c
		);

		try {
			const response = await fetch(`/api/chat/conversations/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: trimmed })
			});

			if (!response.ok) {
				throw new Error('Gagal mengubah nama');
			}

			const result = await response.json();
			if (result.data?.title) {
				this.conversations = this.conversations.map((c) =>
					c.id === id
						? {
								...c,
								title: result.data.title,
								updatedAt: result.data.updatedAt ?? c.updatedAt
							}
						: c
				);
			}

			return true;
		} catch {
			this.conversations = this.conversations.map((c) =>
				c.id === id ? { ...c, title: previousTitle } : c
			);
			return false;
		}
	}

	async sendMessageStream(
		message: string,
		callbacks: {
			onConversationId?: (id: string) => void;
			onSources?: (sources: QuerySourceDto[]) => void;
			onToken?: (token: string) => void;
			onStatus?: (status: string) => void;
		},
		options?: {
			signal?: AbortSignal;
			streamTargetId?: string;
			authToken?: string | null;
		}
	): Promise<{
		userMessage: ChatMessageData;
		assistantMessage: ChatMessageData;
		conversationId: string;
	} | null> {
		if (!this.activeId) {
			this.createNewChat();
		}

		const streamTargetId = options?.streamTargetId ?? this.activeId!;
		const conv = this.conversations.find((c) => c.id === streamTargetId);
		const isDraft = isDraftConversation(conv, streamTargetId);
		let conversationId = resolveConversationId(conv, streamTargetId);
		let responseType: ChatResponseType = 'document';

		const runStream = async (targetConversationId: string) => {
			let resolvedConversationId = targetConversationId;
			let answer = '';
			let sources: QuerySourceDto[] = [];

			const authToken = options?.authToken?.trim();
			if (!authToken) {
				throw new Error('Sesi tidak valid. Silakan login ulang.');
			}

			await streamSSE({
				url: `${API_BASE_URL}/api/chat/stream`,
				method: 'POST',
				headers: { Authorization: `Bearer ${authToken}` },
				body: {
					message,
					conversationId: targetConversationId,
					documentId: conv?.documentId ?? '',
					chatMode: this.chatMode
				},
				signal: options?.signal,
				onChunk: (chunk) => {
					if (chunk.type === 'conversation_id' && chunk.conversationId) {
						resolvedConversationId = chunk.conversationId;
						if (isDraft) {
							this.promoteDraftConversation(streamTargetId, chunk.conversationId);
						}
						callbacks.onConversationId?.(chunk.conversationId);
					}
					if (chunk.type === 'sources' && chunk.sources) {
						sources = mapApiSources(chunk.sources);
						callbacks.onSources?.(sources);
					}
					if (chunk.type === 'status' && chunk.content) {
						callbacks.onStatus?.(chunk.content);
					}
					if (chunk.type === 'content' && chunk.content) {
						answer += chunk.content;
						callbacks.onToken?.(chunk.content);
					}
					if (chunk.type === 'done' && chunk.metadata?.responseStrategy) {
						const strategy = String(chunk.metadata.responseStrategy);
						if (strategy === 'general' || strategy === 'refusal' || strategy === 'document') {
							responseType = strategy;
						}
					}
				}
			});

			return { resolvedConversationId, answer, sources };
		};

		let streamResult: { resolvedConversationId: string; answer: string; sources: QuerySourceDto[] };
		let retriedAsNew = false;

		try {
			streamResult = await runStream(conversationId);
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : '';
			const isNotFound =
				errMsg.includes('conversation not found') || errMsg.includes('percakapan tidak ditemukan');

			if (conversationId && isNotFound) {
				retriedAsNew = true;
				streamResult = await runStream('');
			} else {
				throw error;
			}
		}

		const { resolvedConversationId, answer, sources } = streamResult;

		if (!resolvedConversationId) {
			throw new Error('Gagal mendapatkan ID percakapan dari server');
		}

		if (responseType === 'document' && sources.length === 0) {
			if (this.chatMode === 'strict' || answer.includes('tidak menemukan')) {
				responseType = 'refusal';
			} else {
				responseType = 'general';
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
			timestamp: new Date(),
			responseType
		};

		const now = new Date().toISOString();
		const title =
			conv?.title && conv.title !== 'Chat Baru'
				? conv.title
				: message.length > 50
					? message.slice(0, 50) + '...'
					: message;

		const finalId = this.activeId ?? resolvedConversationId;

		if (isDraft || retriedAsNew) {
			this.conversations = this.conversations.map((c) =>
				c.id === streamTargetId || c.id === finalId
					? {
							id: resolvedConversationId,
							title,
							messages: serializeMessages([userMessage, assistantMessage]),
							createdAt: c.createdAt || now,
							updatedAt: now,
							isDraft: false
						}
					: c
			);
			this.activeId = resolvedConversationId;
		} else {
			const targetConv = this.conversations.find((item) => item.id === finalId);
			const current = deserializeMessages(targetConv?.messages ?? []);
			const withoutEmptyAssistant =
				current.length > 0 &&
				current[current.length - 1].role === 'assistant' &&
				current[current.length - 1].content === ''
					? current.slice(0, -1)
					: current;
			const hasUserAtEnd =
				withoutEmptyAssistant.length > 0 &&
				withoutEmptyAssistant[withoutEmptyAssistant.length - 1].role === 'user' &&
				withoutEmptyAssistant[withoutEmptyAssistant.length - 1].content === message;

			const finalMessages = hasUserAtEnd
				? [...withoutEmptyAssistant, assistantMessage]
				: [...withoutEmptyAssistant, userMessage, assistantMessage];

			this.conversations = this.conversations.map((c) =>
				c.id === finalId
					? {
							...c,
							messages: serializeMessages(finalMessages),
							updatedAt: now
						}
					: c
			);
		}

		this.persistActiveId();
		return { userMessage, assistantMessage, conversationId: resolvedConversationId };
	}

	saveMessages(messages: ChatMessageData[], targetId?: string) {
		let activeId = targetId ?? this.activeId;
		if (!activeId) return;

		if (!this.conversations.some((c) => c.id === activeId) && this.activeId) {
			activeId = this.activeId;
		}

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
		if (this.activeId?.startsWith('draft-')) {
			const draft = this.conversations.find((c) => c.id === this.activeId);
			if (draft) return;
		}

		if (this.activeId && this.conversations.some((conversation) => conversation.id === this.activeId)) {
			return;
		}

		if (this.conversations.length > 0) {
			const first = this.conversations.find((c) => !c.isDraft) ?? this.conversations[0];
			this.activeId = first.id;
			this.persistActiveId();
			return;
		}

		this.createNewChat();
	}

	private persistActiveId() {
		if (!browser || !this.currentUserId) return;
		const key = activeKey(this.currentUserId);
		if (this.activeId && !this.activeId.startsWith('draft-')) {
			localStorage.setItem(key, this.activeId);
		} else {
			localStorage.removeItem(key);
		}
	}
}

export const chatStore = new ChatStore();
