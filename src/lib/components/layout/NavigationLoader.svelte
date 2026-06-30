<script lang="ts">
	import { navigating } from '$app/stores';
	import { browser } from '$app/environment';
	import NavigationSkeleton from './NavigationSkeleton.svelte';

	let visible = $state(false);
	let showTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		if (!browser) return;

		if ($navigating) {
			showTimer = setTimeout(() => {
				visible = true;
			}, 120);
		} else {
			if (showTimer) clearTimeout(showTimer);
			visible = false;
		}

		return () => {
			if (showTimer) clearTimeout(showTimer);
		};
	});
</script>

{#if visible}
	<NavigationSkeleton />
{/if}
