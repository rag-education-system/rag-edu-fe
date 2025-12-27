<script lang="ts">
	import type { LayoutData } from './$types';
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import TrustedBy from '$lib/components/landing/TrustedBy.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Pricing from '$lib/components/landing/Pricing.svelte';
	import CTASection from '$lib/components/landing/CTASection.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	let { data }: { data: LayoutData } = $props();
</script>

<svelte:head>
	<title>Orbitalis AI - Belajar 10x Lebih Cepat dengan AI</title>
	<meta
		name="description"
		content="Orbitalis AI menggunakan teknologi RAG untuk membantu Anda belajar lebih cepat dan efektif dari materi kuliah Anda. Mulai gratis sekarang!"
	/>
	<meta name="keywords" content="AI, RAG, pendidikan, pembelajaran, kuliah, mahasiswa, Indonesia" />
	<meta property="og:title" content="Orbitalis AI - Belajar 10x Lebih Cepat dengan AI" />
	<meta
		property="og:description"
		content="Platform pembelajaran cerdas berbasis AI untuk meningkatkan efektivitas belajar Anda dengan teknologi RAG."
	/>
	<meta property="og:type" content="website" />
</svelte:head>

<div class="min-h-screen flex flex-col bg-background">
	<Navbar data={data.user} />

	<main class="flex-1">
		<Hero />
		<TrustedBy />
		<Features />
		<HowItWorks />
		<Pricing />
		<CTASection />
	</main>

	<Footer />
</div>
