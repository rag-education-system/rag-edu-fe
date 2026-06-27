<script lang="ts">
	import type { LayoutData } from './$types';
	import { ChatSidebar } from '$lib/components/chat';
	import { ThemeToggle } from '$lib/components/layout';
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { logout } from '$lib/utils/logout';
	import { chatStore } from '$lib/stores/chat.svelte';

	let { children }: { data: LayoutData; children: Snippet } = $props();

	let sidebarCollapsed = $state(false);
	let isMobile = $state(false);

	const activeTitle = $derived(chatStore.activeConversation?.title ?? 'Chat Baru');

	$effect(() => {
		if (!browser) return;

		chatStore.init();

		const updateViewport = () => {
			isMobile = window.innerWidth < 1024;
			sidebarCollapsed = isMobile;
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);
		return () => window.removeEventListener('resize', updateViewport);
	});

	$effect(() => {
		if (!browser || chatStore.loading) return;

		const conversationId = $page.url.searchParams.get('id');
		if (conversationId) {
			if (chatStore.activeId === conversationId) return;

			const inList = chatStore.conversations.some((c) => c.id === conversationId);
			if (inList) {
				void chatStore.selectConversation(conversationId);
			}
			return;
		}

		const activeId = chatStore.activeId;
		if (activeId && !activeId.startsWith('draft-')) {
			replaceState(`/chat?id=${activeId}`, $page.state);
		}
	});

	function handleNewChat() {
		chatStore.createNewChat();
		replaceState('/chat', $page.state);
		if (isMobile) sidebarCollapsed = true;
	}

	function handleSelectConversation(id: string) {
		void chatStore.selectConversation(id);
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

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}

	function closeSidebar() {
		sidebarCollapsed = true;
	}
</script>

<div class="flex h-dvh overflow-hidden bg-background">
	<ChatSidebar
		collapsed={sidebarCollapsed}
		conversations={chatStore.historyConversations}
		activeConversationId={chatStore.activeId}
		onNewChat={handleNewChat}
		onSelectConversation={handleSelectConversation}
		onDeleteConversation={handleDeleteConversation}
		onDeleteConversations={handleDeleteConversations}
		onTogglePin={handleTogglePin}
		onRenameConversation={handleRenameConversation}
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

	<div class="flex min-h-0 min-w-0 flex-1 flex-col lg:ml-64">
		<header
			class="sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b border-border/50 bg-background/95 px-3 py-2.5 backdrop-blur-md sm:px-4 lg:hidden"
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

		<main class="relative flex min-h-0 flex-1 flex-col">
			{@render children()}
		</main>
	</div>
</div>
