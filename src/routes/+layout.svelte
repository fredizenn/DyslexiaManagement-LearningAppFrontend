<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';
	import { getUser, isAuthenticated } from '$lib/stores/auth';
	import Sidebar from '$lib/components/layout/sidebar.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';

	const sideBarMenus = [
		{
			label: '',
			path: '/private/dashboard',
			icon: 'hugeicons:home-05',
		},
		{
			label: '',
			path: '/private/exercises',
			icon: 'hugeicons:book-edit',
		},
		{
			label: '',
			path: '/private/reading',
			icon: 'hugeicons:book-02',

		},
		{
			label: '',
			path: '/private/settings',
			icon: 'hugeicons:settings-03',
		}
	];
	onMount(() => {
		if (!getUser()) goto('/login');
	})
</script>

<Toaster />

<div class="flex h-screen overflow-hidden">
	<div class="sticky top-0">
		{#if $isAuthenticated}
		<Sidebar menus={sideBarMenus} />
		{/if}
	</div>
	<div class="flex w-full flex-col overflow-auto">
		{#if $isAuthenticated}
		<Navbar />
		{/if}
		<div class="h-full border-l border-t rounded-xl shadow overflow-auto">
			<slot />
		</div>
	</div>
</div>
