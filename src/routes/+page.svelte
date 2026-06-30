<script lang="ts">
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import SocialProof from '$lib/components/landing/SocialProof.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
	import { scrollToSection } from '$lib/utils/scroll';

	let { data }: { data: LayoutData } = $props();

	onMount(() => {
		const hash = window.location.hash.slice(1);
		if (hash) {
			requestAnimationFrame(() => scrollToSection(hash));
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
		rel="stylesheet"
	/>
	<title>Hattatik AI — Belajar dari Materi Kuliah Anda</title>
	<meta
		name="description"
		content="Hattatik AI membantu mahasiswa dan dosen memahami materi kuliah dari dokumen PDF yang diunggah, dengan rujukan halaman yang jelas."
	/>
	<meta name="keywords" content="pendidikan, kuliah, mahasiswa, dosen, belajar, kampus, Indonesia" />
	<meta property="og:title" content="Hattatik AI — Belajar dari Materi Kuliah Anda" />
	<meta
		property="og:description"
		content="Platform belajar berbasis dokumen PDF kampus. Jawaban dengan sumber halaman yang bisa diverifikasi."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<div class="landing-page min-h-screen flex flex-col bg-background">
	<Navbar data={data.user} />

	<main class="flex-1">
		<Hero />
		<SocialProof />
		<Features />
		<HowItWorks />
	</main>

	<Footer />
</div>
