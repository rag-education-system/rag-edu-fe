<script lang="ts">
	import { Canvas } from '@threlte/core';
	import * as THREE from 'three';
	import Hero3DScene from './Hero3DScene.svelte';

	let mouseX = $state(0);
	let mouseY = $state(0);
	let containerRef: HTMLDivElement | undefined = $state();

	function handleMouseMove(e: MouseEvent) {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
	}

	function createRenderer(canvas: HTMLCanvasElement) {
		const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
		renderer.setClearColor(0x000000, 0);
		renderer.toneMapping = THREE.NoToneMapping;
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		return renderer;
	}
</script>

<svelte:window onmousemove={handleMouseMove} />

<div bind:this={containerRef} class="relative h-full w-full">
	<Canvas {createRenderer} toneMapping={THREE.NoToneMapping}>
		<Hero3DScene {mouseX} {mouseY} />
	</Canvas>
</div>
