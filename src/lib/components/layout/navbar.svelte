<script lang="ts">
	import {
		Navbar,
		NavLi,
		NavUl,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import type { IMenu } from './sidebar.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';

	export const menus: IMenu[] = [];

</script>

<Navbar let:hidden let:toggle class="sticky top-0 z-20 h-16 border-b border-gray-300 flex items-center  backdrop-blur-sm">
	<!-- <div/> -->
		<slot />
		<!-- <div class="flex items-center gap-4">
			
			<ActionButton label={$activeActionButton.label} on:click={$activeActionButton.onClick} />
		</div> -->
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	
</Navbar>
