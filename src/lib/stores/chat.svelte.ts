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
}

const STORAGE_KEY = 'rag_chat_conversations';
const ACTIVE_KEY = 'rag_chat_active_id';
const LEGACY_KEY = 'chat_history';

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

function buildTitle(messages: ChatMessageData[]): string {
	const firstUser = messages.find((message) => message.role === 'user');
	if (!firstUser) return 'Chat Baru';
	const content = firstUser.content.trim();
	if (!content) return 'Chat Baru';
	return content.length > 48 ? `${content.slice(0, 48)}...` : content;
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

class ChatStore {
	conversations = $state<ChatConversation[]>([]);
	activeId = $state<string | null>(null);
	private initialized = false;

	init() {
		if (!browser || this.initialized) return;
		this.initialized = true;
		this.load();
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
			.filter((conversation) => conversation.messages.length > 0)
			.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}

	createNewChat(): string {
		const current = this.activeConversation;
		if (current && current.messages.length === 0) {
			return current.id;
		}

		const conversation: ChatConversation = {
			id: generateId(),
			title: 'Chat Baru',
			messages: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		this.conversations = [conversation, ...this.conversations];
		this.activeId = conversation.id;
		this.persist();
		return conversation.id;
	}

	selectConversation(id: string) {
		if (!this.conversations.some((conversation) => conversation.id === id)) return;
		this.activeId = id;
		this.persist();
	}

	deleteConversation(id: string) {
		this.conversations = this.conversations.filter((conversation) => conversation.id !== id);

		if (this.activeId === id) {
			const next = this.historyConversations[0] ?? this.conversations[0];
			this.activeId = next?.id ?? null;
			if (!this.activeId) {
				this.createNewChat();
			}
		}

		this.persist();
	}

	saveMessages(messages: ChatMessageData[]) {
		if (!this.activeId) {
			this.createNewChat();
		}

		const activeId = this.activeId!;
		const now = new Date().toISOString();

		this.conversations = this.conversations.map((conversation) => {
			if (conversation.id !== activeId) return conversation;
			return {
				...conversation,
				title: buildTitle(messages),
				messages: serializeMessages(messages),
				updatedAt: now
			};
		});

		this.persist();
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
			return;
		}

		this.createNewChat();
	}

	private load() {
		this.migrateLegacyStorage();

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				this.conversations = JSON.parse(stored) as ChatConversation[];
			}
			this.activeId = localStorage.getItem(ACTIVE_KEY);
		} catch {
			this.conversations = [];
			this.activeId = null;
		}

		this.ensureActiveConversation();
	}

	private migrateLegacyStorage() {
		const legacy = localStorage.getItem(LEGACY_KEY);
		if (!legacy) return;

		try {
			const parsed = JSON.parse(legacy) as { messages?: StoredChatMessage[] };
			if (parsed.messages?.length) {
				const now = new Date().toISOString();
				const conversation: ChatConversation = {
					id: generateId(),
					title: buildTitle(deserializeMessages(parsed.messages)),
					messages: parsed.messages,
					createdAt: now,
					updatedAt: now
				};
				this.conversations = [conversation];
				this.activeId = conversation.id;
				this.persist();
			}
		} catch {
			// ignore invalid legacy data
		} finally {
			localStorage.removeItem(LEGACY_KEY);
		}
	}

	private persist() {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations));
		if (this.activeId) {
			localStorage.setItem(ACTIVE_KEY, this.activeId);
		} else {
			localStorage.removeItem(ACTIVE_KEY);
		}
	}
}

export const chatStore = new ChatStore();
