<script lang="ts">
	import { cn } from '$lib/utils';
	import { navigating, page } from '$app/stores';
	import type { ChatConversation } from '$lib/stores/chat.svelte';
	import { chatStore } from '$lib/stores/chat.svelte';
	import type { DocumentItemDto } from '$lib/types/api';
	import LandingLogo from '$lib/components/landing/LandingLogo.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ThemeToggle } from '$lib/components/layout';

	let {
		collapsed = false,
		conversations = [],
		activeConversationId = null,
		activeDocumentId = null,
		onNewChat,
		onSelectConversation,
		onDeleteConversation,
		onDeleteConversations,
		onTogglePin,
		onRenameConversation,
		onFocusDocument,
		onClose,
		onLogout
	}: {
		collapsed?: boolean;
		conversations?: ChatConversation[];
		activeConversationId?: string | null;
		activeDocumentId?: string | null;
		onNewChat?: () => void;
		onSelectConversation?: (id: string) => void;
		onDeleteConversation?: (id: string) => void;
		onDeleteConversations?: (ids: string[]) => void;
		onTogglePin?: (id: string, pinned: boolean) => void;
		onRenameConversation?: (id: string, title: string) => Promise<boolean>;
		onFocusDocument?: (documentId: string | null, documentName?: string) => void;
		onClose?: () => void;
		onLogout?: () => void;
	} = $props();

	let docModalOpen = $state(false);
	let documents = $state<DocumentItemDto[]>([]);
	let docsLoading = $state(false);
	let docsLoaded = false;
	let docSearch = $state('');

	const focusedDocName = $derived.by(() => {
		if (!activeDocumentId) return null;
		const known = documents.find((d) => d.id === activeDocumentId)?.originalName;
		if (known) return known;
		const title = chatStore.activeConversation?.title ?? '';
		return title.startsWith('Tanya: ') ? title.slice('Tanya: '.length) : 'Dokumen terfokus';
	});

	const filteredDocuments = $derived(
		documents.filter((doc) => {
			const query = docSearch.trim().toLowerCase();
			if (!query) return true;
			return (doc.originalName ?? doc.filename ?? '').toLowerCase().includes(query);
		})
	);

	async function loadDocuments() {
		if (docsLoaded) return;
		docsLoading = true;
		try {
			const res = await fetch('/api/documents?status=COMPLETED&limit=100');
			const result = await res.json();
			if (res.ok && Array.isArray(result.data)) {
				documents = result.data as DocumentItemDto[];
				docsLoaded = true;
			}
		} catch {
			// abaikan; modal tetap bisa dibuka
		} finally {
			docsLoading = false;
		}
	}

	function openDocModal() {
		docModalOpen = true;
		docSearch = '';
		void loadDocuments();
	}

	function closeDocModal() {
		docModalOpen = false;
	}

	function selectDocument(doc: DocumentItemDto | null) {
		onFocusDocument?.(doc?.id ?? null, doc?.originalName);
		docModalOpen = false;
	}

	function handleDocModalKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeDocModal();
	}

	let searchQuery = $state('');
	let selectionMode = $state(false);
	let selectedIds = $state<string[]>([]);
	let deleteTarget = $state<{ ids: string[]; titles: string[] } | null>(null);
	let renameTarget = $state<{ id: string; title: string } | null>(null);
	let renameInput = $state('');
	let renameError = $state('');
	let renameLoading = $state(false);

	const currentPath = $derived($navigating?.to?.url.pathname ?? $page.url.pathname);

	const filteredConversations = $derived(
		conversations.filter((conversation) => {
			const query = searchQuery.trim().toLowerCase();
			if (!query) return true;
			return conversation.title.toLowerCase().includes(query);
		})
	);

	const selectedCount = $derived(selectedIds.length);
	const allVisibleSelected = $derived(
		filteredConversations.length > 0 &&
			filteredConversations.every((conversation) => selectedIds.includes(conversation.id))
	);

	const navItems = [
		{ label: 'Tanya AI', href: '/chat', icon: 'chat' },
		{ label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
		{ label: 'Dokumen', href: '/documents', icon: 'documents' }
	];

	function toggleSelectionMode() {
		selectionMode = !selectionMode;
		selectedIds = [];
	}

	function toggleSelect(id: string) {
		selectedIds = selectedIds.includes(id)
			? selectedIds.filter((selectedId) => selectedId !== id)
			: [...selectedIds, id];
	}

	function toggleSelectAllVisible() {
		if (allVisibleSelected) {
			const visibleIds = new Set(filteredConversations.map((conversation) => conversation.id));
			selectedIds = selectedIds.filter((id) => !visibleIds.has(id));
			return;
		}

		const merged = new Set(selectedIds);
		for (const conversation of filteredConversations) {
			merged.add(conversation.id);
		}
		selectedIds = [...merged];
	}

	function openDeleteConfirm(conversation: ChatConversation) {
		deleteTarget = { ids: [conversation.id], titles: [conversation.title] };
	}

	function openBulkDeleteConfirm() {
		if (selectedIds.length === 0) return;

		const titles = conversations
			.filter((conversation) => selectedIds.includes(conversation.id))
			.map((conversation) => conversation.title);

		deleteTarget = { ids: [...selectedIds], titles };
	}

	function closeDeleteConfirm() {
		deleteTarget = null;
	}

	function confirmDelete() {
		if (!deleteTarget) return;

		if (deleteTarget.ids.length === 1) {
			onDeleteConversation?.(deleteTarget.ids[0]);
		} else {
			onDeleteConversations?.(deleteTarget.ids);
		}

		selectedIds = [];
		selectionMode = false;
		deleteTarget = null;
	}

	function handleDeleteKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeDeleteConfirm();
		}
	}

	function handleConversationClick(conversation: ChatConversation) {
		if (selectionMode) {
			toggleSelect(conversation.id);
			return;
		}

		onSelectConversation?.(conversation.id);
	}

	function handleTogglePin(event: MouseEvent, conversation: ChatConversation) {
		event.stopPropagation();
		onTogglePin?.(conversation.id, !conversation.pinned);
	}

	function openRenameModal(conversation: ChatConversation) {
		renameTarget = { id: conversation.id, title: conversation.title };
		renameInput = conversation.title;
		renameError = '';
	}

	function closeRenameModal() {
		renameTarget = null;
		renameInput = '';
		renameError = '';
		renameLoading = false;
	}

	async function confirmRename() {
		if (!renameTarget || renameLoading) return;

		const trimmed = renameInput.trim();
		if (!trimmed) {
			renameError = 'Judul tidak boleh kosong';
			return;
		}

		if (trimmed === renameTarget.title) {
			closeRenameModal();
			return;
		}

		renameLoading = true;
		renameError = '';

		const success = (await onRenameConversation?.(renameTarget.id, trimmed)) ?? false;
		renameLoading = false;

		if (success) {
			closeRenameModal();
			return;
		}

		renameError = 'Gagal mengubah nama. Coba lagi.';
	}

	function handleRenameKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeRenameModal();
		}
		if (event.key === 'Enter' && renameTarget) {
			event.preventDefault();
			void confirmRename();
		}
	}
</script>

{#snippet NewChatIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
	</svg>
{/snippet}

{#snippet ChatIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
		/>
	</svg>
{/snippet}

{#snippet DashboardIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
		/>
	</svg>
{/snippet}

{#snippet DocumentIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
{/snippet}

{#snippet LogoutIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
		/>
	</svg>
{/snippet}

{#snippet TrashIcon()}
	<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
	</svg>
{/snippet}

{#snippet EditIcon()}
	<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
		/>
	</svg>
{/snippet}

{#snippet PinIcon(filled = false)}
	<svg
		class={cn('h-3.5 w-3.5', filled && 'fill-current')}
		fill={filled ? 'currentColor' : 'none'}
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
		/>
	</svg>
{/snippet}

{#snippet SearchIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
		/>
	</svg>
{/snippet}

{#snippet DocFocusIcon()}
	<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
		/>
		<circle cx="12" cy="13" r="2.5" stroke-width="2" />
	</svg>
{/snippet}

<aside
	class={cn(
		'fixed left-0 top-0 z-50 flex h-dvh w-[min(17rem,88vw)] flex-col border-r border-border/50 bg-card/95 backdrop-blur-xl transition-transform duration-300 sm:w-56 lg:w-52',
		collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
	)}
>
	<div class="flex shrink-0 items-center justify-between gap-2 border-b border-border/30 px-3 py-2.5">
		<div class="flex min-w-0 items-center gap-2">
			<LandingLogo size="sm" />
			<span class="truncate text-sm font-bold text-foreground">Hattatik AI</span>
		</div>

		<button
			type="button"
			onclick={() => onClose?.()}
			class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground lg:hidden"
			aria-label="Tutup menu"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<div class="shrink-0 space-y-1.5 p-2.5">
		<button
			type="button"
			onclick={() => onNewChat?.()}
			class="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/20"
		>
			{@render NewChatIcon()}
			<span>Chat Baru</span>
		</button>

		{#if focusedDocName}
			<div
				class="flex w-full items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5"
			>
				<span class="shrink-0 text-primary">{@render DocFocusIcon()}</span>
				<button
					type="button"
					onclick={openDocModal}
					class="min-w-0 flex-1 text-left"
					title="Ganti dokumen yang difokuskan"
				>
					<span class="block text-[10px] font-semibold uppercase tracking-wider text-primary/70">
						Fokus dokumen
					</span>
					<span class="block truncate text-sm font-medium text-foreground">{focusedDocName}</span>
				</button>
				<button
					type="button"
					onclick={() => onFocusDocument?.(null)}
					class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
					aria-label="Hapus fokus dokumen"
					title="Hapus fokus dokumen"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		{:else}
			<button
				type="button"
				onclick={openDocModal}
				class="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted/50 hover:text-foreground"
			>
				<span class="shrink-0">{@render DocFocusIcon()}</span>
				<span class="flex-1 text-left">Fokus Dokumen</span>
				<svg class="h-4 w-4 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}
	</div>

	<div class="flex min-h-0 flex-1 flex-col px-2.5 pb-2">
		<div class="mb-1.5 flex shrink-0 items-center justify-between gap-2 px-1">
			<div class="min-w-0">
				<span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Riwayat Chat
				</span>
				<span class="ml-2 text-[10px] text-muted-foreground">{conversations.length}</span>
			</div>

			<div class="flex items-center gap-1">
				{#if selectionMode}
					<button
						type="button"
						onclick={toggleSelectAllVisible}
						class="rounded-lg px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
					>
						{allVisibleSelected ? 'Batal semua' : 'Pilih semua'}
					</button>
					<button
						type="button"
						onclick={toggleSelectionMode}
						class="rounded-lg px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
					>
						Batal
					</button>
				{:else}
					<button
						type="button"
						onclick={toggleSelectionMode}
						class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
						aria-label="Pilih riwayat chat"
						title="Pilih riwayat chat"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>

		<div class="relative mb-1.5 shrink-0">
			<span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
				{@render SearchIcon()}
			</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Cari riwayat..."
				class="w-full rounded-lg border border-border/50 bg-background/60 py-1.5 pl-8 pr-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
			/>
		</div>

		{#if selectionMode && selectedCount > 0}
			<div class="mb-1.5 flex shrink-0 items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5">
				<span class="text-xs font-medium text-foreground">{selectedCount} dipilih</span>
				<button
					type="button"
					onclick={openBulkDeleteConfirm}
					class="inline-flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
				>
					{@render TrashIcon()}
					Hapus
				</button>
			</div>
		{/if}

		<div class="min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-0.5">
			{#if conversations.length === 0}
				<p
					class="rounded-lg border border-dashed border-border/50 px-2.5 py-3 text-center text-xs text-muted-foreground"
				>
					Belum ada riwayat chat
				</p>
			{:else if filteredConversations.length === 0}
				<p
					class="rounded-lg border border-dashed border-border/50 px-2.5 py-3 text-center text-xs text-muted-foreground"
				>
					Tidak ada hasil untuk "{searchQuery}"
				</p>
			{:else}
				{#each filteredConversations as conversation (conversation.id)}
					<div class="group relative">
						<button
							type="button"
							onclick={() => handleConversationClick(conversation)}
							class={cn(
								'w-full rounded-lg border px-2.5 py-2 text-left transition-all duration-200',
								selectionMode ? 'pl-8' : 'pl-2.5',
								'border-transparent hover:bg-muted/50',
								activeConversationId === conversation.id &&
									!selectionMode &&
									'border-primary/20 bg-primary/10 text-primary',
								selectionMode &&
									selectedIds.includes(conversation.id) &&
									'border-primary/20 bg-primary/5'
							)}
						>
							<div class="flex min-w-0 items-start gap-1 pr-16">
								{#if conversation.pinned}
									<span class="mt-0.5 shrink-0 text-primary" title="Disematkan">
										{@render PinIcon(true)}
									</span>
								{/if}
								<div class="min-w-0 flex-1">
									<p class="truncate text-xs font-medium sm:text-sm">{conversation.title}</p>
									<p class="mt-0.5 text-[10px] text-muted-foreground">
										{chatStore.formatUpdatedAt(conversation.updatedAt)}
									</p>
								</div>
							</div>
						</button>

						{#if selectionMode}
							<label
								class="absolute left-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center"
							>
								<input
									type="checkbox"
									checked={selectedIds.includes(conversation.id)}
									onchange={() => toggleSelect(conversation.id)}
									class="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/30"
								/>
							</label>
						{:else}
							<div
								class="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
							>
								<button
									type="button"
									onclick={(event) => {
										event.stopPropagation();
										openRenameModal(conversation);
									}}
									class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground"
									aria-label="Ubah nama chat"
									title="Ubah nama"
								>
									{@render EditIcon()}
								</button>

								<button
									type="button"
									onclick={(event) => handleTogglePin(event, conversation)}
									class={cn(
										'inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all',
										conversation.pinned
											? 'text-primary hover:bg-primary/10'
											: 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
									)}
									aria-label={conversation.pinned ? 'Lepas sematan' : 'Sematkan chat'}
									title={conversation.pinned ? 'Lepas sematan' : 'Sematkan chat'}
								>
									{@render PinIcon(Boolean(conversation.pinned))}
								</button>

								<button
									type="button"
									onclick={(event) => {
										event.stopPropagation();
										openDeleteConfirm(conversation);
									}}
									class="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-400"
									aria-label="Hapus riwayat chat"
								>
									{@render TrashIcon()}
								</button>
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>

	<nav class="shrink-0 border-t border-border/30 px-2.5 py-2">
		<span class="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
			Menu
		</span>
		<ul class="mt-1 space-y-0.5">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						data-sveltekit-preload-data="hover"
						class={cn(
							'flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150',
							'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
							currentPath.startsWith(item.href) && 'bg-primary/10 text-primary'
						)}
					>
						{#if item.icon === 'chat'}
							{@render ChatIcon()}
						{:else if item.icon === 'dashboard'}
							{@render DashboardIcon()}
						{:else}
							{@render DocumentIcon()}
						{/if}
						<span class="font-medium">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="shrink-0 space-y-0.5 border-t border-border/30 p-2.5">
		<ThemeToggle />
		<button
			type="button"
			onclick={() => onLogout?.()}
			class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
		>
			{@render LogoutIcon()}
			<span class="font-medium">Keluar</span>
		</button>
	</div>
</aside>

{#if deleteTarget}
	<div
		class="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={closeDeleteConfirm}
		onkeydown={handleDeleteKeydown}
	>
		<div
			class="w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="delete-chat-title"
			aria-describedby="delete-chat-description"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<div class="mb-5 flex items-start gap-4">
				<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
					{@render TrashIcon()}
				</div>
				<div class="min-w-0">
					<h2 id="delete-chat-title" class="text-lg font-semibold text-foreground">
						{deleteTarget.ids.length === 1 ? 'Hapus riwayat chat?' : `Hapus ${deleteTarget.ids.length} riwayat chat?`}
					</h2>
					<p id="delete-chat-description" class="mt-2 text-sm text-muted-foreground">
						{#if deleteTarget.ids.length === 1}
							Percakapan
							<span class="font-medium text-foreground">"{deleteTarget.titles[0]}"</span>
							akan dihapus permanen dan tidak dapat dikembalikan.
						{:else}
							{deleteTarget.ids.length} percakapan yang dipilih akan dihapus permanen dan tidak dapat
							dikembalikan.
						{/if}
					</p>
				</div>
			</div>

			<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" class="w-full sm:w-auto" onclick={closeDeleteConfirm}>
					Batal
				</Button>
				<Button type="button" variant="destructive" class="w-full sm:w-auto" onclick={confirmDelete}>
					Ya, Hapus
				</Button>
			</div>
		</div>
	</div>
{/if}

{#if renameTarget}
	<div
		class="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={closeRenameModal}
		onkeydown={handleRenameKeydown}
	>
		<div
			class="w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="rename-chat-title"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<h2 id="rename-chat-title" class="text-lg font-semibold text-foreground">
				Ubah nama chat
			</h2>
			<p class="mt-1 text-sm text-muted-foreground">Berikan nama baru untuk percakapan ini.</p>

			<div class="mt-4">
				<input
					type="text"
					bind:value={renameInput}
					maxlength={120}
					placeholder="Nama percakapan"
					class="w-full rounded-xl border border-border/50 bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
				/>
				{#if renameError}
					<p class="mt-2 text-xs text-red-400">{renameError}</p>
				{/if}
			</div>

			<div class="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" class="w-full sm:w-auto" onclick={closeRenameModal}>
					Batal
				</Button>
				<Button
					type="button"
					class="w-full sm:w-auto"
					disabled={renameLoading}
					onclick={() => void confirmRename()}
				>
					{renameLoading ? 'Menyimpan...' : 'Simpan'}
				</Button>
			</div>
		</div>
	</div>
{/if}

{#if docModalOpen}
	<div
		class="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
		role="presentation"
		onclick={closeDocModal}
		onkeydown={handleDocModalKeydown}
	>
		<div
			class="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="focus-doc-title"
			onclick={(event) => event.stopPropagation()}
			onkeydown={(event) => event.stopPropagation()}
		>
			<div class="mb-4 flex items-start gap-4">
				<div
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
				>
					{@render DocFocusIcon()}
				</div>
				<div class="min-w-0">
					<h2 id="focus-doc-title" class="text-lg font-semibold text-foreground">
						Fokus ke dokumen
					</h2>
					<p class="mt-1 text-sm text-muted-foreground">
						Pilih satu dokumen agar AI menjawab berdasarkan seluruh isinya.
					</p>
				</div>
			</div>

			<div class="relative mb-3">
				<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
					{@render SearchIcon()}
				</span>
				<input
					type="search"
					bind:value={docSearch}
					placeholder="Cari dokumen..."
					class="w-full rounded-xl border border-border/50 bg-background/60 py-2 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
				/>
			</div>

			<div class="-mr-1 flex-1 space-y-1 overflow-y-auto pr-1">
				<button
					type="button"
					onclick={() => selectDocument(null)}
					class={cn(
						'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
						!activeDocumentId
							? 'border-primary/30 bg-primary/10 text-primary'
							: 'border-transparent hover:bg-muted/50'
					)}
				>
					<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</span>
					<span class="min-w-0 flex-1">
						<span class="block text-sm font-medium">Semua dokumen</span>
						<span class="block text-[11px] text-muted-foreground">Cari di seluruh dokumen (mode RAG)</span>
					</span>
					{#if !activeDocumentId}
						<svg class="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					{/if}
				</button>

				{#if docsLoading}
					<p class="px-3 py-6 text-center text-sm text-muted-foreground">Memuat dokumen...</p>
				{:else if documents.length === 0}
					<p
						class="rounded-xl border border-dashed border-border/50 px-3 py-6 text-center text-xs text-muted-foreground"
					>
						Belum ada dokumen yang selesai diproses.
					</p>
				{:else if filteredDocuments.length === 0}
					<p
						class="rounded-xl border border-dashed border-border/50 px-3 py-6 text-center text-xs text-muted-foreground"
					>
						Tidak ada hasil untuk "{docSearch}"
					</p>
				{:else}
					{#each filteredDocuments as doc (doc.id)}
						<button
							type="button"
							onclick={() => selectDocument(doc)}
							class={cn(
								'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
								activeDocumentId === doc.id
									? 'border-primary/30 bg-primary/10 text-primary'
									: 'border-transparent hover:bg-muted/50'
							)}
						>
							<span
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
							>
								{@render DocFocusIcon()}
							</span>
							<span class="min-w-0 flex-1">
								<span class="block truncate text-sm font-medium text-foreground">
									{doc.originalName ?? doc.filename ?? doc.id}
								</span>
								<span class="block text-[11px] text-muted-foreground">
									{doc.totalChunks ?? 0} bagian
								</span>
							</span>
							{#if activeDocumentId === doc.id}
								<svg class="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							{/if}
						</button>
					{/each}
				{/if}
			</div>

			<div class="mt-4 flex justify-end">
				<Button type="button" variant="outline" class="w-full sm:w-auto" onclick={closeDocModal}>
					Tutup
				</Button>
			</div>
		</div>
	</div>
{/if}
