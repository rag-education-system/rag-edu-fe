<script lang="ts">
	import type { LayoutData } from './$types';
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import CTASection from '$lib/components/landing/CTASection.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	let { data }: { data: LayoutData } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Instrument+Serif:ital@0;1&display=swap"
		rel="stylesheet"
	/>
	<title>Hattatik AI — Belajar dari Materi Kuliah Anda</title>
	<meta
		name="description"
		content="Hattatik AI membantu mahasiswa dan dosen memahami materi kuliah dari dokumen yang diunggah, dengan rujukan halaman yang jelas."
	/>
	<meta name="keywords" content="pendidikan, kuliah, mahasiswa, dosen, belajar, kampus, Indonesia" />
	<meta property="og:title" content="Hattatik AI — Belajar dari Materi Kuliah Anda" />
	<meta
		property="og:description"
		content="Platform belajar berbasis dokumen kampus. Jawaban dengan sumber yang bisa diverifikasi."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<div class="landing-page min-h-screen flex flex-col bg-background">
	<Navbar data={data.user} />

	<main class="flex-1">
		<Hero />
		<Features />
		<HowItWorks />
		<CTASection />
	</main>

	<Footer />
</div>
