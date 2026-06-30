<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="fixed inset-0 z-100 flex h-dvh flex-col bg-background animate-fade-in" role="status" aria-live="polite" aria-label="Memuat halaman">
	<div class="flex min-h-0 flex-1">
		<aside class="hidden w-52 shrink-0 flex-col gap-5 border-r border-border/50 p-3 lg:flex">
			<div class="flex items-center gap-2 px-1">
				<Skeleton class="h-8 w-8 rounded-lg" />
				<Skeleton class="h-4 w-24" />
			</div>

			<div class="space-y-4">
				<div class="space-y-2">
					<Skeleton class="mx-2 h-2.5 w-10" />
					<div class="space-y-1">
						{#each Array(4) as _, index (index)}
							<div class="flex items-center gap-2 rounded-lg px-2 py-2">
								<Skeleton class="h-4 w-4 shrink-0 rounded" />
								<Skeleton class="h-3.5 flex-1" style="max-width: {index % 2 === 0 ? '70%' : '85%'}" />
							</div>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<Skeleton class="mx-2 h-2.5 w-12" />
					<div class="flex items-center gap-2 rounded-lg px-2 py-2">
						<Skeleton class="h-4 w-4 shrink-0 rounded" />
						<Skeleton class="h-3.5 w-14" />
					</div>
				</div>
			</div>

			<div class="mt-auto flex items-center gap-2 rounded-lg border-t border-border/30 px-1 pt-3">
				<Skeleton class="h-8 w-8 shrink-0 rounded-full" />
				<div class="min-w-0 flex-1 space-y-1.5">
					<Skeleton class="h-3 w-24" />
					<Skeleton class="h-2.5 w-32" />
				</div>
			</div>
		</aside>

		<div class="flex min-w-0 flex-1 flex-col">
			<div class="flex h-14 shrink-0 items-center gap-3 border-b border-border/50 px-3 sm:px-4 lg:px-6">
				<Skeleton class="h-10 w-10 shrink-0 rounded-xl lg:hidden" />
				<div class="min-w-0 flex-1 space-y-1.5 lg:hidden">
					<Skeleton class="h-3.5 w-28" />
					<Skeleton class="h-2.5 w-36" />
				</div>
				<div class="ml-auto flex items-center gap-2">
					<Skeleton class="hidden h-8 w-28 rounded-lg lg:block" />
					<Skeleton class="h-8 w-8 rounded-lg" />
				</div>
			</div>

			<div class="flex-1 space-y-6 overflow-hidden p-4 sm:p-6">
				<div class="space-y-2">
					<Skeleton class="h-8 w-44 sm:w-56" />
					<Skeleton class="h-4 w-full max-w-md" />
				</div>

				<div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
					{#each Array(4) as _, index (index)}
						<Skeleton class="h-20 rounded-xl sm:h-24" />
					{/each}
				</div>

				<div class="space-y-3">
					<Skeleton class="h-5 w-36" />
					<div class="space-y-2 rounded-xl border border-border/40 p-3">
						{#each Array(4) as _, index (index)}
							<div class="flex items-center gap-3 py-1">
								<Skeleton class="h-9 w-9 shrink-0 rounded-lg" />
								<div class="min-w-0 flex-1 space-y-1.5">
									<Skeleton class="h-3.5" style="max-width: {55 + index * 8}%" />
									<Skeleton class="h-2.5 w-2/5" />
								</div>
								<Skeleton class="hidden h-7 w-16 rounded-lg sm:block" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="pointer-events-none absolute inset-x-0 bottom-8 flex items-center justify-center gap-2.5 sm:bottom-10"
	>
		<div
			class="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/95 px-4 py-2.5 shadow-lg backdrop-blur-sm"
		>
			<div
				class="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
			></div>
			<p class="text-sm font-medium text-muted-foreground">Memuat halaman...</p>
		</div>
	</div>
</div>
