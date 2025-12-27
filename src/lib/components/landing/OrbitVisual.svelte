<script lang="ts">
	// SVG icon paths for knowledge/education symbols
	const iconPaths: Record<string, string> = {
		book: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
		atom: 'M12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0M12 21c-4.97 0-9-1.79-9-4s4.03-4 9-4s9 1.79 9 4s-4.03 4-9 4zM12 3c4.97 0 9 1.79 9 4s-4.03 4-9 4s-9-1.79-9-4s4.03-4 9-4z',
		formula:
			'M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.255 3c1.125 2.78 1.745 5.817 1.745 9s-.62 6.22-1.745 9m-14.51 0c2.78 1.125 5.817 1.745 9 1.745s6.22-.62 9-1.745M4.745 3c2.78-1.125 5.817-1.745 9-1.745s6.22.62 9 1.745',
		graduation:
			'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
		lightbulb:
			'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
		brain:
			'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5',
		chart:
			'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'
	};

	// Orbit items configuration
	const innerOrbitItems = [
		{ icon: 'book', delay: 0 },
		{ icon: 'atom', delay: 5 },
		{ icon: 'formula', delay: 10 },
		{ icon: 'graduation', delay: 15 }
	];

	const outerOrbitItems = [
		{ icon: 'lightbulb', delay: 0 },
		{ icon: 'brain', delay: 10 },
		{ icon: 'chart', delay: 20 }
	];
</script>

<div class="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px]">
	<!-- Background glow effects -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"
	></div>
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 bg-accent/30 rounded-full blur-2xl animate-pulse-glow"
		style="animation-delay: -1.5s;"
	></div>

	<!-- Orbit rings -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full border border-primary/20"
	></div>
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border border-accent/15"
	></div>

	<!-- Planet core -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-linear-to-br from-primary via-accent to-primary shadow-2xl glow-primary"
	>
		<!-- Planet shine -->
		<div
			class="absolute inset-2 rounded-full bg-linear-to-tr from-transparent via-white/10 to-white/20"
		></div>
		<!-- Planet inner glow -->
		<div class="absolute inset-0 rounded-full bg-linear-to-b from-white/10 to-transparent"></div>
	</div>

	<!-- Inner orbit items -->
	{#each innerOrbitItems as item}
		<div
			class="absolute top-1/2 left-1/2 orbit-inner"
			style="--orbit-delay: -{item.delay}s;"
		>
			<div
				class="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 -translate-x-1/2 -translate-y-1/2 rounded-xl glass flex items-center justify-center text-primary shadow-lg hover:glow-sm transition-shadow"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 lg:w-6 lg:h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[item.icon]} />
				</svg>
			</div>
		</div>
	{/each}

	<!-- Outer orbit items (reverse direction) -->
	{#each outerOrbitItems as item}
		<div
			class="absolute top-1/2 left-1/2 orbit-outer"
			style="--orbit-delay: -{item.delay}s;"
		>
			<div
				class="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 -translate-x-1/2 -translate-y-1/2 rounded-xl glass flex items-center justify-center text-accent shadow-lg hover:glow-accent transition-shadow"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 lg:w-6 lg:h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[item.icon]} />
				</svg>
			</div>
		</div>
	{/each}

	<!-- Floating particles -->
	<div
		class="absolute top-[15%] left-[20%] w-2 h-2 bg-primary/40 rounded-full animate-float"
	></div>
	<div
		class="absolute top-[75%] left-[15%] w-1.5 h-1.5 bg-accent/50 rounded-full animate-float"
		style="animation-delay: -2s;"
	></div>
	<div
		class="absolute top-[25%] right-[18%] w-1 h-1 bg-primary/60 rounded-full animate-float"
		style="animation-delay: -4s;"
	></div>
	<div
		class="absolute bottom-[20%] right-[22%] w-2 h-2 bg-accent/40 rounded-full animate-float"
		style="animation-delay: -3s;"
	></div>
</div>

<style>
	/* Inner orbit animation with responsive radii */
	.orbit-inner {
		--orbit-radius: 96px;
		animation: orbit 20s linear infinite;
		animation-delay: var(--orbit-delay, 0s);
	}

	.orbit-outer {
		--orbit-radius: 128px;
		animation: orbit-reverse 30s linear infinite;
		animation-delay: var(--orbit-delay, 0s);
	}

	@keyframes orbit {
		from {
			transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
		}
		to {
			transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
		}
	}

	@keyframes orbit-reverse {
		from {
			transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg);
		}
		to {
			transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg);
		}
	}

	/* Responsive orbit radii */
	@media (min-width: 640px) {
		.orbit-inner {
			--orbit-radius: 120px;
		}
		.orbit-outer {
			--orbit-radius: 160px;
		}
	}

	@media (min-width: 1024px) {
		.orbit-inner {
			--orbit-radius: 144px;
		}
		.orbit-outer {
			--orbit-radius: 192px;
		}
	}
</style>
