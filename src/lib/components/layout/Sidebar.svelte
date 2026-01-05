<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import SidebarNavItem from './SidebarNavItem.svelte';

	let {
		collapsed = false,
		onLogout,
		user,
		class: className
	}: {
		collapsed?: boolean;
		onLogout?: () => void;
		user?: { name: string; email: string; avatar?: string };
		class?: string;
	} = $props();

	const currentPath = $derived($page.url.pathname);

	let profileMenuOpen = $state(false);

	const initials = $derived(
		user?.name
			? user.name
					.split(' ')
					.map((n) => n[0])
					.join('')
					.toUpperCase()
					.slice(0, 2)
			: ''
	);

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.profile-menu-container')) {
			profileMenuOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

{#snippet DashboardIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
		/>
	</svg>
{/snippet}

{#snippet DocumentIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
{/snippet}

{#snippet ChatIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
		/>
	</svg>
{/snippet}

{#snippet SettingsIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
		/>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
		/>
	</svg>
{/snippet}

{#snippet HelpIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
{/snippet}

{#snippet LogoutIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
		/>
	</svg>
{/snippet}

{#snippet UserIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
		/>
	</svg>
{/snippet}

<aside
	class={cn(
		'fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl transition-transform duration-300',
		collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
		className
	)}
>
	<div class="flex h-full flex-col">
		<!-- Logo -->
		<div class="flex items-center gap-3 px-6 py-5 border-b border-border">
			<div class="relative w-10 h-10 flex items-center justify-center">
				<div
					class="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-primary/10"
				></div>
				<svg
					class="w-6 h-6 text-primary relative z-10"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			</div>
			<span class="text-xl font-bold text-foreground">RAG System</span>
		</div>

		<!-- Menu Section -->
		<div class="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
			<div>
				<p class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Menu
				</p>
				<nav class="space-y-1">
					<SidebarNavItem
						href="/dashboard"
						label="Dashboard"
						icon={DashboardIcon}
						active={currentPath === '/dashboard'}
					/>
					<SidebarNavItem
						href="/documents"
						label="Dokumen"
						icon={DocumentIcon}
						active={currentPath.startsWith('/documents')}
					/>
					<SidebarNavItem
						href="/chat"
						label="Tanya AI"
						icon={ChatIcon}
						active={currentPath.startsWith('/chat')}
					/>
				</nav>
			</div>

			<div>
				<p class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Umum
				</p>
				<nav class="space-y-1">
					<SidebarNavItem
						href="/dashboard/profile"
						label="Profil"
						icon={UserIcon}
						active={currentPath.startsWith('/dashboard/profile')}
					/>
					<SidebarNavItem
						href="/settings"
						label="Pengaturan"
						icon={SettingsIcon}
					/>
					<SidebarNavItem href="/help" label="Bantuan" icon={HelpIcon} />
				</nav>
			</div>
		</div>

		<!-- User Profile Footer -->
		{#if user}
			<div class="px-4 py-4 border-t border-border">
				<div class="relative profile-menu-container">
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							profileMenuOpen = !profileMenuOpen;
						}}
						class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
					>
						{#if user.avatar}
							<img
								src={user.avatar}
								alt={user.name}
								class="w-10 h-10 rounded-full object-cover flex-shrink-0"
							/>
						{:else}
							<div
								class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0"
							>
								{initials}
							</div>
						{/if}
						<div class="flex-1 text-left min-w-0">
							<p class="text-sm font-medium text-foreground truncate">{user.name}</p>
							<p class="text-xs text-muted-foreground truncate">{user.email}</p>
						</div>
						<svg
							class={cn(
								'w-4 h-4 text-muted-foreground transition-transform flex-shrink-0',
								profileMenuOpen && 'rotate-180'
							)}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 15l7-7 7 7"
							/>
						</svg>
					</button>

					<!-- Dropdown Menu -->
					{#if profileMenuOpen}
						<div
							class="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
						>
							<button
								type="button"
								onclick={onLogout}
								class="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
							>
								{@render LogoutIcon()}
								<span>Keluar</span>
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</aside>
