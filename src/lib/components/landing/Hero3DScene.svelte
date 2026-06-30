<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, Float } from '@threlte/extras';
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import logoUrl from '$lib/assets/logoubh.png';

	let { mouseX = 0, mouseY = 0 }: { mouseX?: number; mouseY?: number } = $props();

	interactivity();

	const { renderer } = useThrelte();

	let groupRef: THREE.Group | undefined = $state();
	let orbitRing1: THREE.Mesh | undefined = $state();
	let orbitRing2: THREE.Mesh | undefined = $state();
	let orbitRing3: THREE.Mesh | undefined = $state();
	let logoTexture = $state<THREE.Texture | null>(null);
	let targetRotationX = $state(0);
	let targetRotationY = $state(0);
	let time = $state(0);
	let particles: Array<{ position: [number, number, number]; scale: number; speed: number; offset: number }> = $state([]);
	let orbitParticles: Array<{ angle: number; radius: number; speed: number; yOffset: number }> = $state([]);

	function createLogoTextureFromImage(image: HTMLImageElement): THREE.Texture {
		const canvas = document.createElement('canvas');
		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;

		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		if (!ctx) {
			throw new Error('Canvas 2D context unavailable');
		}

		ctx.drawImage(image, 0, 0);
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const { data } = imageData;

		for (let i = 0; i < data.length; i += 4) {
			const r = data[i];
			const g = data[i + 1];
			const b = data[i + 2];

			// Hapus background hitam di PNG agar tidak terlihat kotak pembatas
			if (r < 45 && g < 45 && b < 45) {
				data[i + 3] = 0;
			}
		}

		ctx.putImageData(imageData, 0, 0);

		const texture = new THREE.CanvasTexture(canvas);
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.needsUpdate = true;
		return texture;
	}

	onMount(() => {
		renderer.setClearColor(0x000000, 0);

		const image = new Image();
		image.src = logoUrl;
		image.onload = () => {
			logoTexture = createLogoTextureFromImage(image);
		};

		const newParticles = [];
		for (let i = 0; i < 50; i++) {
			newParticles.push({
				position: [
					(Math.random() - 0.5) * 10,
					(Math.random() - 0.5) * 10,
					(Math.random() - 0.5) * 6 - 3
				] as [number, number, number],
				scale: Math.random() * 0.05 + 0.02,
				speed: Math.random() * 0.5 + 0.3,
				offset: Math.random() * Math.PI * 2
			});
		}
		particles = newParticles;

		const newOrbitParticles = [];
		for (let i = 0; i < 10; i++) {
			newOrbitParticles.push({
				angle: (i / 10) * Math.PI * 2,
				radius: 2.8 + Math.random() * 0.3,
				speed: 0.25 + Math.random() * 0.15,
				yOffset: (Math.random() - 0.5) * 0.5
			});
		}
		orbitParticles = newOrbitParticles;
	});

	useTask((delta) => {
		time += delta;
		targetRotationY = mouseX * 0.5;
		targetRotationX = -mouseY * 0.35;

		if (groupRef) {
			groupRef.rotation.y += (targetRotationY - groupRef.rotation.y) * 0.06;
			groupRef.rotation.x += (targetRotationX - groupRef.rotation.x) * 0.06;
		}

		if (orbitRing1) {
			orbitRing1.rotation.z += delta * 0.2;
		}
		if (orbitRing2) {
			orbitRing2.rotation.z -= delta * 0.15;
		}
		if (orbitRing3) {
			orbitRing3.rotation.x += delta * 0.1;
		}
	});

	const ubhGreen = new THREE.Color('#22a85a');
	const ubhYellow = new THREE.Color('#f5c518');
	const glowGreen = new THREE.Color('#4ade80');
	const glowYellow = new THREE.Color('#fde047');

	function getOrbitPosition(particle: typeof orbitParticles[0]): [number, number, number] {
		const angle = particle.angle + time * particle.speed;
		return [
			Math.cos(angle) * particle.radius,
			particle.yOffset + Math.sin(time * 2 + particle.angle) * 0.2,
			Math.sin(angle) * particle.radius
		];
	}
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />

<T.AmbientLight intensity={0.6} />
<T.DirectionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
<T.DirectionalLight position={[-5, 3, 3]} intensity={0.4} color="#22a85a" />
<T.PointLight position={[0, 0, 3]} intensity={0.6} color="#ffffff" />
<T.PointLight position={[2, 2, 2]} intensity={0.3} color="#f5c518" />
<T.PointLight position={[-2, -2, 2]} intensity={0.3} color="#22a85a" />

<T.Group bind:ref={groupRef}>
	<Float floatIntensity={1.5} rotationIntensity={0.3} speed={1.5}>
		{#if logoTexture}
			<T.Mesh>
				<T.PlaneGeometry args={[3.5, 3.5]} />
				<T.MeshBasicMaterial
					map={logoTexture}
					transparent
					alphaTest={0.01}
					depthWrite={true}
					side={THREE.DoubleSide}
				/>
			</T.Mesh>
		{/if}
	</Float>

	<T.Mesh bind:ref={orbitRing1} rotation={[Math.PI / 6, 0, 0]}>
		<T.TorusGeometry args={[2.5, 0.02, 16, 100]} />
		<T.MeshStandardMaterial
			color={glowGreen}
			metalness={0.9}
			roughness={0.1}
			emissive={glowGreen}
			emissiveIntensity={0.5}
			transparent
			opacity={0.5}
		/>
	</T.Mesh>

	<T.Mesh bind:ref={orbitRing2} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
		<T.TorusGeometry args={[2.8, 0.015, 16, 100]} />
		<T.MeshStandardMaterial
			color={ubhYellow}
			metalness={0.9}
			roughness={0.1}
			emissive={glowYellow}
			emissiveIntensity={0.4}
			transparent
			opacity={0.4}
		/>
	</T.Mesh>

	<T.Mesh bind:ref={orbitRing3} rotation={[Math.PI / 3, -Math.PI / 5, Math.PI / 4]}>
		<T.TorusGeometry args={[3.2, 0.01, 16, 100]} />
		<T.MeshStandardMaterial
			color={ubhGreen}
			metalness={0.9}
			roughness={0.1}
			emissive={glowGreen}
			emissiveIntensity={0.3}
			transparent
			opacity={0.3}
		/>
	</T.Mesh>
</T.Group>

{#each orbitParticles as particle, i}
	<T.Mesh position={getOrbitPosition(particle)}>
		<T.SphereGeometry args={[0.06, 16, 16]} />
		<T.MeshStandardMaterial
			color={i % 2 === 0 ? ubhYellow : ubhGreen}
			metalness={0.8}
			roughness={0.2}
			emissive={i % 2 === 0 ? glowYellow : glowGreen}
			emissiveIntensity={0.6}
		/>
	</T.Mesh>
{/each}

{#each particles as particle, i}
	<T.Mesh
		position={[
			particle.position[0],
			particle.position[1] + Math.sin(time * particle.speed + particle.offset) * 0.5,
			particle.position[2]
		]}
	>
		<T.SphereGeometry args={[particle.scale, 8, 8]} />
		<T.MeshStandardMaterial
			color={i % 3 === 0 ? ubhGreen : i % 3 === 1 ? ubhYellow : glowGreen}
			emissive={i % 2 === 0 ? glowGreen : glowYellow}
			emissiveIntensity={0.3}
			transparent
			opacity={0.5}
		/>
	</T.Mesh>
{/each}
