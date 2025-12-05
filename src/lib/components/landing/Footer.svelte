<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="w-full border-t bg-muted/50 py-12 px-4">
	<div class="container mx-auto max-w-7xl">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
			<!-- Brand Column -->
			<div class="space-y-3">
				<h3 class="text-lg font-bold">RAG Education System</h3>
				<p class="text-sm text-muted-foreground leading-relaxed">
					Platform pembelajaran cerdas berbasis AI untuk meningkatkan efektivitas belajar Anda.
				</p>
			</div>

			<!-- Quick Links Column -->
			<div class="space-y-3">
				<h4 class="text-sm font-semibold uppercase tracking-wide">Quick Links</h4>
				<ul class="space-y-2">
					<li>
						<a
							href="#features"
							class="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Features
						</a>
					</li>
					<li>
						<a
							href="#how-it-works"
							class="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							How it Works
						</a>
					</li>
					<li>
						<a
							href="/auth/login"
							class="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Login
						</a>
					</li>
					<li>
						<a
							href="/auth/register"
							class="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Register
						</a>
					</li>
				</ul>
			</div>

			<!-- Contact Column -->
			<div class="space-y-3">
				<h4 class="text-sm font-semibold uppercase tracking-wide">Contact</h4>
				<ul class="space-y-2">
					<li class="text-sm text-muted-foreground">Email: info@ragedu.com</li>
					<li class="text-sm text-muted-foreground">Support: support@ragedu.com</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="pt-8 border-t border-border">
			<p class="text-center text-sm text-muted-foreground">
				© {currentYear} RAG Education System. All rights reserved.
			</p>
		</div>
	</div>
</footer>
