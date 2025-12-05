<script lang="ts">
	import type { LayoutData } from './$types';
	import Navbar from '$lib/components/landing/Navbar.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import HowItWorks from '$lib/components/landing/HowItWorks.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	let { data }: { data: LayoutData } = $props();
</script>

<svelte:head>
	<title>RAG Education System - Smart Learning with AI</title>
	<meta
		name="description"
		content="Transform your educational experience with AI-powered RAG technology. Access accurate information instantly from your course materials."
	/>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Navbar data={data.user} />

	<main class="flex-1">
		<Hero />
		<Features />
		<HowItWorks />
	</main>

	<Footer />
</div>
