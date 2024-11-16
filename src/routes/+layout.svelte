<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';
	import { getUser, init, isAuthenticated } from '$lib/stores/auth';
	import Sidebar from '$lib/components/layout/sidebar.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';

	let loading = false;
	const sideBarMenus = [
		{
			label: '',
			path: '/private/dashboard',
			icon: 'hugeicons:home-05'
		},
		{
			label: '',
			path: '/private/exercises',
			icon: 'hugeicons:book-edit'
		},
		{
			label: '',
			path: '/private/reading',
			icon: 'hugeicons:book-02'
		},
		{
			label: '',
			path: '/private/profile/update',
			icon: 'hugeicons:settings-03'
		}
	];
	onMount(async () => {

		loading = true;
		
		const p = localStorage.getItem('p');
		const t = localStorage.getItem('t');
		const rt = localStorage.getItem('r_t');

		if (p && t) {
			isAuthenticated.set(true);
		}
		console.log("hi", {
			isAuthenticated: $isAuthenticated,
			user: getUser()
		});
		if (!getUser()) {
			isAuthenticated.set(false);
			goto('/login');
		}

		await init();
		loading = false;
	
	});
</script>

<Toaster />

{#if loading}
<div class="text-sm text-center">Loading...</div>
{:else}
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
		<div class="h-full overflow-auto rounded-xl border-l border-t shadow">
			<slot />
		</div>
	</div>
</div>
{/if}