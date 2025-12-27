<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let {
		title,
		description,
		actionText = 'Upload Dokumen',
		actionHref = '/documents/upload'
	}: {
		title: string;
		description: string;
		actionText?: string;
		actionHref?: string;
	} = $props();
</script>

<div class="text-center py-12 px-4">
	<div class="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
		<svg
			class="w-12 h-12 text-muted-foreground"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			/>
		</svg>
	</div>
	<h3 class="text-lg font-semibold mb-2">{title}</h3>
	<p class="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
	<Button href={actionHref}>{actionText}</Button>
</div>
