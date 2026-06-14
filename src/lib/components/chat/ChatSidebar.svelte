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

<aside
	class={cn(
		'fixed left-0 top-0 z-40 h-screen bg-card/95 backdrop-blur-xl border-r border-border/50 transition-all duration-300 flex flex-col',
		collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'
	)}
>
	<div class="flex items-center gap-3 p-4 border-b border-border/30">
		{@render LogoIcon()}
		{#if !collapsed}
			<span class="font-bold text-lg text-foreground">RAG Education</span>
		{/if}
	</div>

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
				<span>Chat Baru</span>
			{/if}
		</button>
	</div>

	<nav class="flex-1 overflow-y-auto px-3 py-2">
		{#if !collapsed}
			<span class="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
				Menu
			</span>
		{/if}
		<ul class="space-y-1 mt-2">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class={cn(
							'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
							'text-muted-foreground hover:text-foreground hover:bg-muted/50',
							$page.url.pathname.startsWith(item.href) && 'bg-primary/10 text-primary',
							collapsed && 'justify-center'
						)}
					>
						{#if item.icon === 'chat'}
							{@render ChatIcon()}
						{:else if item.icon === 'dashboard'}
							{@render DashboardIcon()}
						{:else}
							{@render DocumentIcon()}
						{/if}
						{#if !collapsed}
							<span class="font-medium">{item.label}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

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
				<span class="font-medium">Keluar</span>
			{/if}
		</button>
	</div>
</aside>
