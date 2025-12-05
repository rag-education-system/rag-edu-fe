<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let data: any = $props();

</script>

<nav
	class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto max-w-7xl px-4">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center gap-6">
				<a href="/" class="text-xl font-bold hover:text-primary transition-colors">
					RAG Education System
				</a>
				<div class="hidden md:flex gap-6">
					<a
						href="#features"
						class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						How it Works
					</a>
				</div>
			</div>
	
			{#if data}
				<div class="flex items-center gap-4">
					<span class="text-sm text-muted-foreground">Hello, {data.name}</span>
					<Button href="/dashboard" size="sm">Dashboard</Button>
				</div>
			{:else}			
			<div class="flex gap-3">
				<Button variant="outline" href="/auth/login" size="sm">Login</Button>
				<Button href="/auth/register" size="sm">Register</Button>
			</div>
			{/if}
		</div>
	</div>
</nav>
