<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { goto } from '$app/navigation';
	import { Toaster } from 'svelte-french-toast';
	import { getUser } from '$lib/stores/auth';

	onMount(() => {
		if (!getUser()) goto('/login');
	})
</script>

<Toaster />
<slot></slot>
