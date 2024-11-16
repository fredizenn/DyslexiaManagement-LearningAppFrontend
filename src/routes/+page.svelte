<script lang="ts">
	import { goto } from '$app/navigation';
	import { init, isAuthenticated } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let loading = false;

	onMount(async () => {
		loading = true
		if (!$isAuthenticated) {
			loading = false
			console.log("from root", { isAuthenticated: $isAuthenticated });

			goto('/login');
		} else {
			await init();
			loading = false;
			goto('/private/dashboard');
		}
	});
</script>


<div>Hello</div>