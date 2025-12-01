<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from './$types';
	
	let { children, data  }: {children: any, data: LayoutData} = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
