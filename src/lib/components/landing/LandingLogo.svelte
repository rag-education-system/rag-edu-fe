<script lang="ts">
	let { size = 'md' }: { size?: 'sm' | 'md' } = $props();

	const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
	const innerInset = size === 'sm' ? 'inset-1.5' : 'inset-2';
	const orbitOrigin = size === 'sm' ? 'center 16px' : 'center 18px';
</script>

<div class="relative {sizeClass} shrink-0">
	<div
		class="absolute inset-0 rounded-full border-2 border-primary/30 group-hover:border-primary/50 transition-colors"
	></div>
	<div class="absolute {innerInset} rounded-full bg-gradient-to-br from-primary to-accent shadow-lg"></div>
	<div
		class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-spin-slow"
		style="transform-origin: {orbitOrigin};"
	></div>
</div>
