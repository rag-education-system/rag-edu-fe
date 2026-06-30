<script lang="ts">
	import type { LayoutData } from './$types';
	import { ChatSidebar } from '$lib/components/chat';
	import { ThemeToggle } from '$lib/components/layout';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { logout } from '$lib/utils/logout';
	import { chatStore } from '$lib/stores/chat.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(true);
	let isMobile = $state(false);
	let newDocHandled = $state(false);
	let initialUrlSynced = $state(false);
	let trackedUserId = $state<string | undefined>(undefined);

	const activeTitle = $derived(chatStore.activeConversation?.title ?? 'Chat Baru');

	$effect(() => {
		if (!browser) return;

		const userId = data.user.id;
		if (userId && userId !== trackedUserId) {
			trackedUserId = userId;
			newDocHandled = false;
			initialUrlSynced = false;
			chatStore.initForUser(userId);
		}

		const updateViewport = () => {
			const mobile = window.innerWidth < 1024;
			if (mobile !== isMobile) {
				isMobile = mobile;
				sidebarCollapsed = mobile;
			}
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);
		return () => window.removeEventListener('resize', updateViewport);
	});

	$effect(() => {
		if (!browser || !isMobile) return;
		void $page.url.pathname;
		void $page.url.search;
		sidebarCollapsed = true;
	});

	// Mulai percakapan baru terpisah yang terkunci ke satu dokumen (dari halaman dokumen).
	$effect(() => {
		if (!browser) return;

		const newDoc = $page.url.searchParams.get('newDoc');
		if (!newDoc || newDocHandled) return;

		newDocHandled = true;
		const docName = $page.url.searchParams.get('docName')?.trim();
		const title = docName ? `Tanya: ${docName}` : 'Chat Baru';
		chatStore.createDocumentChat(newDoc, title);
		replaceState('/chat', $page.state);
		if (isMobile) sidebarCollapsed = true;
	});

	// Sinkronkan ?id= dari URL hanya sekali setelah daftar percakapan dimuat (buka link langsung).
	$effect(() => {
		if (!browser || chatStore.loading || initialUrlSynced) return;

		initialUrlSynced = true;
		const conversationId = $page.url.searchParams.get('id');
		if (
			conversationId &&
			chatStore.activeId !== conversationId &&
			chatStore.conversations.some((c) => c.id === conversationId)
		) {
			void chatStore.selectConversation(conversationId);
		}
	});

	// Back/forward browser: ikuti URL tanpa efek reaktif (hindari loop replaceState).
	$effect(() => {
		if (!browser) return;

		const onPopState = () => {
			const conversationId = new URLSearchParams(window.location.search).get('id');
			if (
				conversationId &&
				chatStore.conversations.some((c) => c.id === conversationId) &&
				chatStore.activeId !== conversationId
			) {
				void chatStore.selectConversation(conversationId);
				return;
			}
			if (!conversationId && chatStore.activeId && !chatStore.activeId.startsWith('draft-')) {
				chatStore.createNewChat();
			}
		};

		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	});

	function handleNewChat() {
		chatStore.createNewChat();
		replaceState('/chat', $page.state);
		if (isMobile) sidebarCollapsed = true;
	}

	async function handleSelectConversation(id: string) {
		if (chatStore.activeId === id) {
			if (isMobile) sidebarCollapsed = true;
			return;
		}
		await chatStore.selectConversation(id);
		replaceState(`/chat?id=${id}`, $page.state);
		if (isMobile) sidebarCollapsed = true;
	}

	function handleDeleteConversation(id: string) {
		void chatStore.deleteConversation(id);
	}

	function handleDeleteConversations(ids: string[]) {
		void chatStore.deleteConversations(ids);
		const activeId = chatStore.activeId;
		if (activeId && !activeId.startsWith('draft-')) {
			replaceState(`/chat?id=${activeId}`, $page.state);
		} else {
			replaceState('/chat', $page.state);
		}
	}

	function handleTogglePin(id: string, pinned: boolean) {
		void chatStore.togglePinConversation(id, pinned);
	}

	function handleRenameConversation(id: string, title: string) {
		return chatStore.renameConversation(id, title);
	}

	function handleFocusDocument(documentId: string | null, documentName?: string) {
		chatStore.focusDocument(documentId, documentName);
		replaceState('/chat', $page.state);
		if (isMobile) sidebarCollapsed = true;
	}

	function toggleSidebar() {
		if (!isMobile) return;
		sidebarCollapsed = !sidebarCollapsed;
	}

	function closeSidebar() {
		if (!isMobile) return;
		sidebarCollapsed = true;
	}
</script>

<div class="flex h-dvh overflow-hidden bg-background">
	<ChatSidebar
		collapsed={sidebarCollapsed}
		conversations={chatStore.historyConversations}
		activeConversationId={chatStore.activeId}
		activeDocumentId={chatStore.activeDocumentId}
		onNewChat={handleNewChat}
		onSelectConversation={handleSelectConversation}
		onDeleteConversation={handleDeleteConversation}
		onDeleteConversations={handleDeleteConversations}
		onTogglePin={handleTogglePin}
		onRenameConversation={handleRenameConversation}
		onFocusDocument={handleFocusDocument}
		onClose={closeSidebar}
		onLogout={() => logout()}
	/>

	{#if !sidebarCollapsed && isMobile}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-black/50 lg:hidden"
			onclick={closeSidebar}
			aria-label="Tutup sidebar"
		></button>
	{/if}

	<div class="flex min-h-0 min-w-0 flex-1 flex-col transition-[margin] duration-300 lg:ml-52">
		{#if isMobile}
			<header
				class="sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 px-3 py-2 backdrop-blur-md sm:px-4"
			>
			<button
				type="button"
				onclick={toggleSidebar}
				class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/50 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
				aria-label="Buka menu chat"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>

			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-semibold text-foreground">{activeTitle}</p>
				<p class="truncate text-xs text-muted-foreground">Tanya AI · Hattatik AI</p>
			</div>

			<button
				type="button"
				onclick={handleNewChat}
				class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
				aria-label="Chat baru"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
			</button>

			<ThemeToggle variant="icon" />
		</header>
		{/if}

		<main class="relative flex min-h-0 flex-1 flex-col">
			{@render children()}
		</main>
	</div>
</div>
