<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/logoubh.png';
	import type { LayoutData } from './$types';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { NavigationLoader } from '$lib/components/layout';

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<ModeWatcher defaultMode="light" track={false} />

<svelte:head>
	<link rel="icon" href={favicon} type="image/png" />
</svelte:head>

<Toaster position="top-right" />
<NavigationLoader />

{@render children()}
