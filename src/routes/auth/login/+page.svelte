<script module lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors
	} from '$lib/components/ui/form';
</script>

<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/zod4_schema/auth';
	import LandingLogo from '$lib/components/landing/LandingLogo.svelte';
	import LoginIllustration from '$lib/components/auth/LoginIllustration.svelte';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zod4(loginSchema),
		onError({ result }) {
			console.log('Form error:', result);
		},
		timeoutMs: 8000,
		dataType: 'json',
		multipleSubmits: 'prevent'
	});

	const { form: formData, enhance, message, submitting } = form;

	let showPassword = $state(false);

	const inputClass =
		'flex h-11 w-full rounded-xl border border-border/60 bg-muted/20 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:bg-muted/30 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap"
		rel="stylesheet"
	/>
	<title>Masuk — Hattatik AI</title>
</svelte:head>

<div class="landing-page h-screen flex overflow-hidden bg-background">
	<!-- Panel kiri — branding + ilustrasi -->
	<div class="relative hidden lg:flex lg:w-[45%] xl:w-1/2 flex-col h-full p-10 border-r border-border/40 overflow-hidden">
		<div class="absolute inset-0 landing-dot-grid opacity-30 pointer-events-none"></div>
		<div
			class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none"
		></div>
		<div
			class="absolute top-1/4 right-0 w-[280px] h-[280px] rounded-full bg-accent/5 blur-3xl pointer-events-none"
		></div>

		<div class="relative flex flex-1 flex-col justify-center gap-5 min-h-0 overflow-hidden">
			<div class="space-y-3 max-w-sm shrink-0">
				<p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
					Platform belajar kampus
				</p>
				<h1 class="landing-serif text-3xl xl:text-4xl leading-[1.15] text-foreground">
					Selamat datang
					<em class="text-primary not-italic">kembali</em>
				</h1>
				<p class="text-base text-muted-foreground leading-relaxed">
					Lanjutkan belajar dari materi PDF kampus Anda.
				</p>
			</div>

			<div class="shrink-0">
				<LoginIllustration />
			</div>
		</div>

		<p class="relative text-sm text-muted-foreground shrink-0">
			&copy; {new Date().getFullYear()} Hattatik AI
		</p>
	</div>

	<!-- Panel kanan — form -->
	<div class="flex flex-1 h-full flex-col justify-center overflow-y-auto px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
		<div class="mx-auto w-full max-w-sm space-y-8">
			<a href="/" class="flex items-center justify-center lg:justify-start gap-2.5 group w-fit mx-auto lg:mx-0">
				<LandingLogo />
				<span class="text-base font-semibold tracking-tight">Hattatik AI</span>
			</a>

			<div class="space-y-2">
				<h2 class="text-2xl font-semibold tracking-tight text-center lg:text-left">Masuk</h2>
				<p class="text-sm text-muted-foreground text-center lg:text-left">
					Gunakan akun yang diberikan administrator kampus
				</p>
			</div>

			{#if data.info === 'contact-admin'}
				<div
					class="rounded-xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm text-foreground leading-relaxed"
				>
					Pendaftaran mandiri tidak tersedia. Hubungi administrator kampus untuk membuat akun
					mahasiswa atau dosen.
				</div>
			{/if}

			{#if $message}
				<div class="rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
					{$message}
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-5">
				<FormField {form} name="email">
					{#snippet children({ constraints, errors, tainted, value })}
						<FormControl>
							{#snippet children({ props })}
								<FormLabel class="text-sm font-medium mb-1.5">Email</FormLabel>
								<input
									type="email"
									{...props}
									bind:value={$formData.email}
									placeholder="nama@kampus.ac.id"
									class={inputClass}
									disabled={$submitting}
								/>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					{/snippet}
				</FormField>

				<FormField {form} name="password">
					{#snippet children({ constraints, errors, tainted, value })}
						<FormControl>
							{#snippet children({ props })}
								<FormLabel class="text-sm font-medium mb-1.5">Password</FormLabel>
								<div class="relative">
									<input
										type={showPassword ? 'text' : 'password'}
										{...props}
										bind:value={$formData.password}
										placeholder="••••••••"
										class="{inputClass} pr-11"
										disabled={$submitting}
									/>
									<button
										type="button"
										class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
										onclick={() => (showPassword = !showPassword)}
										aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
									>
										{#if showPassword}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858 3.029a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
											</svg>
										{:else}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										{/if}
									</button>
								</div>
							{/snippet}
						</FormControl>
						<FormFieldErrors />
					{/snippet}
				</FormField>

				<Button type="submit" class="w-full h-11 rounded-full font-medium mt-2" disabled={$submitting}>
					{#if $submitting}
						<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
						Memproses...
					{:else}
						Masuk
					{/if}
				</Button>
			</form>

			<div class="space-y-4 text-center lg:text-left">
				<p class="text-sm text-muted-foreground">
					Belum punya akun?
					<span class="text-foreground">Hubungi administrator kampus.</span>
				</p>
				<a
					href="/"
					class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
					</svg>
					Kembali ke beranda
				</a>
			</div>
		</div>
	</div>
</div>
