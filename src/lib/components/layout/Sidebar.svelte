<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { cn } from '$lib/utils';
	import SidebarNavItem from './SidebarNavItem.svelte';
	import LandingLogo from '$lib/components/landing/LandingLogo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	import type { DtoUserInfo } from '$lib/api/api';

	let {
		collapsed = false,
		onLogout,
		onClose,
		user,
		class: className
	}: {
		collapsed?: boolean;
		onLogout?: () => void;
		onClose?: () => void;
		user?: DtoUserInfo;
		class?: string;
	} = $props();

	const currentPath = $derived($navigating?.to?.url.pathname ?? $page.url.pathname);

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
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
		/>
	</svg>
{/snippet}

{#snippet DocumentIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		/>
	</svg>
{/snippet}

{#snippet ChatIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
		/>
	</svg>
{/snippet}

{#snippet SettingsIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
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

{#snippet UsersIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
		/>
	</svg>
{/snippet}

{#snippet HelpIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
{/snippet}

{#snippet LogoutIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
		/>
	</svg>
{/snippet}

{#snippet UserIcon()}
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-4 w-4">
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
		'fixed left-0 top-0 z-40 flex h-dvh w-[min(17rem,88vw)] flex-col border-r border-border/50 bg-card/95 backdrop-blur-xl transition-transform duration-300 sm:w-56 lg:w-52',
		collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
		className
	)}
>
	<div class="flex h-full min-h-0 flex-col">
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

		<div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-2.5 py-3">
			<div>
				<p class="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
					Menu
				</p>
				<nav class="space-y-0.5">
					<SidebarNavItem
						href="/dashboard"
						label="Dashboard"
						icon={DashboardIcon}
						active={currentPath === '/dashboard'}
						onNavigate={onClose}
					/>
					<SidebarNavItem
						href="/documents"
						label="Dokumen"
						icon={DocumentIcon}
						active={currentPath.startsWith('/documents')}
						onNavigate={onClose}
					/>
					<SidebarNavItem
						href="/chat"
						label="Tanya AI"
						icon={ChatIcon}
						active={currentPath.startsWith('/chat')}
						onNavigate={onClose}
					/>
					{#if user?.role === 'ADMIN'}
						<SidebarNavItem
							href="/dashboard/admin"
							label="Kelola Pengguna"
							icon={UsersIcon}
							active={currentPath.startsWith('/dashboard/admin') && !currentPath.startsWith('/dashboard/admin/create')}
							onNavigate={onClose}
						/>
						<SidebarNavItem
							href="/dashboard/admin/create"
							label="Buat Akun"
							icon={UserIcon}
							active={currentPath.startsWith('/dashboard/admin/create')}
							onNavigate={onClose}
						/>
					{/if}
				</nav>
			</div>

			<div>
				<p class="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
					Umum
				</p>
				<nav class="space-y-0.5">
					<SidebarNavItem
						href="/dashboard/profile"
						label="Profil"
						icon={UserIcon}
						active={currentPath.startsWith('/dashboard/profile')}
						onNavigate={onClose}
					/>
					<ThemeToggle />
				</nav>
			</div>
		</div>

		<!-- User Profile Footer -->
		{#if user}
			<div class="shrink-0 border-t border-border/30 px-2.5 py-2.5">
				<div class="relative profile-menu-container">
					<button
						type="button"
						onclick={(e) => {
							e.stopPropagation();
							profileMenuOpen = !profileMenuOpen;
						}}
						class="flex w-full items-center gap-2 rounded-lg p-1.5 transition-colors duration-150 hover:bg-muted/50"
					>
						<div
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-xs font-semibold text-primary-foreground"
						>
							{initials}
						</div>
						<div class="min-w-0 flex-1 text-left">
							<p class="truncate text-sm font-medium text-foreground">{user.name ?? 'Pengguna'}</p>
							<p class="truncate text-[11px] text-muted-foreground">{user.email ?? ''}</p>
						</div>
						<svg
							class={cn(
								'w-4 h-4 shrink-0 text-muted-foreground transition-transform',
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
								class="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-foreground transition-colors duration-150 hover:bg-muted/50"
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
