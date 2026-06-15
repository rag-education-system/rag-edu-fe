<script lang="ts">
	import { browser } from '$app/environment';
	import { renderMarkdown } from '$lib/utils/markdown';

	let { content }: { content: string } = $props();

	let html = $state('');

	$effect(() => {
		if (!browser) {
			html = '';
			return;
		}

		let cancelled = false;
		const source = content;

		renderMarkdown(source).then((result) => {
			if (!cancelled) html = result;
		});

		return () => {
			cancelled = true;
		};
	});
</script>

<div class="markdown-body text-sm leading-relaxed">
	{#if html}
		{@html html}
	{:else if content}
		<p class="whitespace-pre-wrap">{content}</p>
	{/if}
</div>

<style>
	.markdown-body :global(p) {
		margin: 0.5em 0;
	}

	.markdown-body :global(p:first-child) {
		margin-top: 0;
	}

	.markdown-body :global(p:last-child) {
		margin-bottom: 0;
	}

	.markdown-body :global(h1),
	.markdown-body :global(h2),
	.markdown-body :global(h3),
	.markdown-body :global(h4) {
		font-weight: 600;
		margin: 0.75em 0 0.35em;
		line-height: 1.35;
	}

	.markdown-body :global(h1) {
		font-size: 1.15em;
	}

	.markdown-body :global(h2) {
		font-size: 1.08em;
	}

	.markdown-body :global(h3),
	.markdown-body :global(h4) {
		font-size: 1em;
	}

	.markdown-body :global(ul),
	.markdown-body :global(ol) {
		margin: 0.5em 0;
		padding-left: 1.25em;
	}

	.markdown-body :global(li) {
		margin: 0.2em 0;
	}

	.markdown-body :global(li > p) {
		margin: 0;
	}

	.markdown-body :global(blockquote) {
		margin: 0.5em 0;
		padding-left: 0.75em;
		border-left: 3px solid color-mix(in oklab, var(--color-primary) 45%, transparent);
		color: var(--color-muted-foreground);
	}

	.markdown-body :global(code) {
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		font-size: 0.9em;
		background: color-mix(in oklab, var(--color-muted) 70%, transparent);
		padding: 0.1em 0.35em;
		border-radius: 0.3em;
	}

	.markdown-body :global(pre) {
		margin: 0.6em 0;
		padding: 0.75em;
		overflow-x: auto;
		border-radius: 0.5em;
		background: color-mix(in oklab, var(--color-muted) 80%, transparent);
		border: 1px solid color-mix(in oklab, var(--color-border) 80%, transparent);
	}

	.markdown-body :global(pre code) {
		background: none;
		padding: 0;
	}

	.markdown-body :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.markdown-body :global(strong) {
		font-weight: 600;
	}

	.markdown-body :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 0.6em 0;
		font-size: 0.92em;
	}

	.markdown-body :global(th),
	.markdown-body :global(td) {
		border: 1px solid color-mix(in oklab, var(--color-border) 80%, transparent);
		padding: 0.35em 0.5em;
		text-align: left;
	}

	.markdown-body :global(hr) {
		margin: 0.75em 0;
		border: none;
		border-top: 1px solid color-mix(in oklab, var(--color-border) 80%, transparent);
	}
</style>
