<script lang="ts">
	import { cn } from '$lib/utils';
	import { navigating, page } from '$app/stores';
	import type { ChatConversation } from '$lib/stores/chat.svelte';
	import { chatStore } from '$lib/stores/chat.svelte';

	let {
		collapsed = false,
		conversations = [],
		activeConversationId = null,
		onNewChat,
		onSelectConversation,
		onDeleteConversation,
		onClose,
		onLogout
	}: {
		collapsed?: boolean;
		conversations?: ChatConversation[];
		activeConversationId?: string | null;
		onNewChat?: () => void;
		onSelectConversation?: (id: string) => void;
		onDeleteConversation?: (id: string) => void;
		onClose?: () => void;
		onLogout?: () => void;
	} = $props();

	const currentPath = $derived($navigating?.to?.url.pathname ?? $page.url.pathname);

	const navItems = [
		{ label: 'Tanya AI', href: '/chat', icon: 'chat' },
		{ label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
		{ label: 'Dokumen', href: '/documents', icon: 'documents' }
	];
</script>

{#snippet LogoIcon()}
	<svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
		<circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2" class="text-primary" />
		<path
			d="M10 16l4 4 8-8"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="text-primary"
		/>
	</svg>
{/snippet}

{#snippet NewChatIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
	</svg>
{/snippet}

{#snippet ChatIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
		/>
	</svg>
{/snippet}

{#snippet DashboardIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
		/>
	</svg>
{/snippet}

{#snippet DocumentIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
{/snippet}

{#snippet LogoutIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
		/>
	</svg>
{/snippet}

{#snippet TrashIcon()}
	<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
	</svg>
{/snippet}

<aside
	class={cn(
		'fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col border-r border-border/50 bg-card/95 backdrop-blur-xl transition-transform duration-300',
		collapsed ? '-translate-x-full' : 'translate-x-0',
		'lg:translate-x-0'
	)}
>
	<div class="flex items-center justify-between gap-3 border-b border-border/30 p-4">
		<div class="flex min-w-0 items-center gap-3">
			{@render LogoIcon()}
			<span class="truncate text-lg font-bold text-foreground">Hattatik AI</span>
		</div>

		<button
			type="button"
			onclick={() => onClose?.()}
			class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground lg:hidden"
			aria-label="Tutup menu"
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<div class="p-3">
		<button
			type="button"
			onclick={() => onNewChat?.()}
			class="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 font-medium text-primary transition-all duration-200 hover:bg-primary/20"
		>
			{@render NewChatIcon()}
			<span>Chat Baru</span>
		</button>
	</div>

	<div class="px-3 pb-2">
		<div class="mb-2 flex items-center justify-between px-1">
			<span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
				Riwayat Chat
			</span>
			<span class="text-[10px] text-muted-foreground">{conversations.length}</span>
		</div>

		<div class="max-h-40 space-y-1 overflow-y-auto pr-1 sm:max-h-56">
				{#if conversations.length === 0}
					<p class="px-3 py-4 text-xs text-muted-foreground text-center rounded-xl border border-dashed border-border/50">
						Belum ada riwayat chat
					</p>
				{:else}
					{#each conversations as conversation (conversation.id)}
						<div class="group relative">
							<button
								type="button"
								onclick={() => onSelectConversation?.(conversation.id)}
								class={cn(
									'w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200',
									'border border-transparent hover:bg-muted/50',
									activeConversationId === conversation.id &&
										'bg-primary/10 border-primary/20 text-primary'
								)}
							>
								<p class="text-sm font-medium truncate pr-6">{conversation.title}</p>
								<p class="text-[11px] text-muted-foreground mt-0.5">
									{chatStore.formatUpdatedAt(conversation.updatedAt)}
								</p>
							</button>

							<button
								type="button"
								onclick={() => onDeleteConversation?.(conversation.id)}
								class="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground opacity-100 transition-all hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
								aria-label="Hapus riwayat chat"
							>
								{@render TrashIcon()}
							</button>
						</div>
					{/each}
				{/if}
			</div>
	</div>

	<nav class="flex-1 overflow-y-auto border-t border-border/30 px-3 py-2">
		<span class="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			Menu
		</span>
		<ul class="mt-2 space-y-1">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						data-sveltekit-preload-data="hover"
						class={cn(
							'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150',
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

	<div class="border-t border-border/30 p-3">
		<button
			type="button"
			onclick={() => onLogout?.()}
			class="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
		>
			{@render LogoutIcon()}
			<span class="font-medium">Keluar</span>
		</button>
	</div>
</aside>
