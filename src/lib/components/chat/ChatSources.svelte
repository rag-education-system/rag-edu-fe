<script lang="ts">
	import { cn } from '$lib/utils';
	import type { QuerySourceDto } from '$lib/types/api';

	let { sources }: { sources: QuerySourceDto[] } = $props();

	let expanded = $state(false);

	function formatSimilarity(score: number): string {
		return Math.round(score * 100) + '%';
	}

	function getSimilarityColor(score: number): string {
		if (score >= 0.8) return 'text-green-400';
		if (score >= 0.6) return 'text-yellow-400';
		return 'text-orange-400';
	}

	function sourceLabel(source: QuerySourceDto, index: number): string {
		return source.documentId ? `Dokumen ${source.documentId.slice(0, 8)}...` : `Sumber ${index + 1}`;
	}
</script>

{#snippet ChevronIcon()}
	<svg
		class={cn('w-4 h-4 transition-transform duration-200', expanded && 'rotate-180')}
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
	</svg>
{/snippet}

{#snippet DocumentIcon()}
	<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
	</svg>
{/snippet}

<div class="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
	<button
		type="button"
		class="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-card/50 transition-colors"
		onclick={() => (expanded = !expanded)}
	>
		<div class="flex items-center gap-2">
			<div class="text-primary/60">
				{@render DocumentIcon()}
			</div>
			<span class="text-xs font-medium text-muted-foreground">
				{sources.length} sumber referensi
			</span>
		</div>
		<div class="text-muted-foreground">
			{@render ChevronIcon()}
		</div>
	</button>

	{#if expanded}
		<div class="border-t border-border/50 divide-y divide-border/30">
			{#each sources as source, index}
				<div class="px-3 py-3 hover:bg-card/30 transition-colors">
					<div class="flex items-start justify-between gap-2 mb-1">
						<div class="flex-1 min-w-0">
							<p class="text-xs font-medium text-foreground truncate" title={sourceLabel(source, index)}>
								{sourceLabel(source, index)}
							</p>
							<p class="text-[10px] text-muted-foreground">
								Chunk #{(source.chunkIndex ?? 0) + 1}
							</p>
						</div>
						<div class="flex-shrink-0">
							<span
								class={cn(
									'text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted/50',
									getSimilarityColor(source.similarity ?? 0)
								)}
							>
								{formatSimilarity(source.similarity ?? 0)}
							</span>
						</div>
					</div>
					<p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
						{source.content}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
