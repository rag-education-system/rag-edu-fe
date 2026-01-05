<script lang="ts">
	import { cn } from '$lib/utils';
	import { page } from '$app/stores';

	let {
		collapsed = false,
		onNewChat,
		onLogout
	}: {
		collapsed?: boolean;
		onNewChat?: () => void;
		onLogout?: () => void;
	} = $props();

	const features = [
		{ label: 'Chat', href: '/chat', icon: 'chat' },
		{ label: 'Archived', href: '/chat/archived', icon: 'archive' },
		{ label: 'Library', href: '/chat/library', icon: 'library' }
	];

	const workspaces = [
		{ label: 'New Project', icon: 'folder-plus' },
		{ label: 'Image', icon: 'folder' },
		{ label: 'Presentation', icon: 'folder' },
		{ label: 'Riset', icon: 'folder' },
		{ label: 'Image', icon: 'folder' }
	];
</script>

{#snippet LogoIcon()}
	<svg class="w-8 h-8" viewBox="0 0 32 32" fill="none">
		<circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2" class="text-primary" />
		<path d="M10 16l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary" />
	</svg>
{/snippet}

{#snippet NewChatIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
	</svg>
{/snippet}

{#snippet ChatIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
	</svg>
{/snippet}

{#snippet ArchiveIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
	</svg>
{/snippet}

{#snippet LibraryIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
	</svg>
{/snippet}

{#snippet FolderIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
	</svg>
{/snippet}

{#snippet FolderPlusIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
	</svg>
{/snippet}

{#snippet SidebarIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
	</svg>
{/snippet}

{#snippet UpgradeIcon()}
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
	</svg>
{/snippet}

{#snippet LogoutIcon()}
	<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
	</svg>
{/snippet}

<aside
	class={cn(
		'fixed left-0 top-0 z-40 h-screen bg-card/95 backdrop-blur-xl border-r border-border/50 transition-all duration-300 flex flex-col',
		collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'
	)}
>
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-b border-border/30">
		<div class="flex items-center gap-3">
			{@render LogoIcon()}
			{#if !collapsed}
				<span class="font-bold text-lg text-foreground">RAG Chat</span>
			{/if}
		</div>
		{#if !collapsed}
			<button
				type="button"
				class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
				aria-label="Toggle sidebar"
			>
				{@render SidebarIcon()}
			</button>
		{/if}
	</div>

	<!-- New Chat Button -->
	<div class="p-3">
		<button
			type="button"
			onclick={() => onNewChat?.()}
			class={cn(
				'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
				'bg-muted/50 hover:bg-muted/70 border border-border/50',
				'text-foreground font-medium transition-all duration-200',
				collapsed && 'justify-center px-3'
			)}
		>
			{@render NewChatIcon()}
			{#if !collapsed}
				<span>New Chat</span>
			{/if}
		</button>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto px-3 py-2">
		<!-- Features Section -->
		{#if !collapsed}
			<div class="mb-4">
				<span class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					Features
				</span>
			</div>
		{/if}
		<ul class="space-y-1 mb-6">
			{#each features as item}
				<li>
					<a
						href={item.href}
						class={cn(
							'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
							'text-muted-foreground hover:text-foreground hover:bg-muted/50',
							$page.url.pathname === item.href && 'bg-primary/10 text-primary',
							collapsed && 'justify-center'
						)}
					>
						{#if item.icon === 'chat'}
							{@render ChatIcon()}
						{:else if item.icon === 'archive'}
							{@render ArchiveIcon()}
						{:else if item.icon === 'library'}
							{@render LibraryIcon()}
						{/if}
						{#if !collapsed}
							<span class="font-medium">{item.label}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Workspaces Section -->
		{#if !collapsed}
			<div class="mb-4">
				<span class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					Workspaces
				</span>
			</div>
			<ul class="space-y-1">
				{#each workspaces as workspace}
					<li>
						<button
							type="button"
							class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
						>
							{#if workspace.icon === 'folder-plus'}
								{@render FolderPlusIcon()}
							{:else}
								{@render FolderIcon()}
							{/if}
							<span class="font-medium">{workspace.label}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</nav>

	<!-- Upgrade Card -->
	{#if !collapsed}
		<div class="p-3">
			<div class="rounded-2xl bg-muted/30 border border-border/50 p-4">
				<div class="flex justify-center mb-3">
					<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
						{@render UpgradeIcon()}
					</div>
				</div>
				<h4 class="text-center font-semibold text-foreground mb-1">Upgrade to premium</h4>
				<p class="text-center text-xs text-muted-foreground mb-4">
					Boost productivity with seamless automation and responsive AI, built to adapt to your needs.
				</p>
				<button
					type="button"
					class="w-full py-2.5 rounded-xl bg-muted/50 hover:bg-muted/70 border border-border/50 text-sm font-medium text-foreground transition-colors"
				>
					Upgrade
				</button>
			</div>
		</div>
	{/if}

	<!-- Logout -->
	<div class="p-3 border-t border-border/30">
		<button
			type="button"
			onclick={() => onLogout?.()}
			class={cn(
				'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl',
				'text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200',
				collapsed && 'justify-center'
			)}
		>
			{@render LogoutIcon()}
			{#if !collapsed}
				<span class="font-medium">Logout</span>
			{/if}
		</button>
	</div>
</aside>
