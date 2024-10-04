<script lang="ts" context="module">
	export interface IMenu {
		label: string;
		path: string;
		icon: string | IconifyIcon;
		iconColor?: string;
		permission?: any;
	}
</script>

<script lang="ts">
	import {
		Sidebar,
		SidebarWrapper,
		SidebarBrand,
		SidebarItem,
		SidebarGroup
	} from 'flowbite-svelte';
	import Icon, { type IconifyIcon } from '@iconify/svelte';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import logo from '$lib/images/app-logo.png';

	export let menus: IMenu[] = [];

	$: isActivePage = $page.route.id;

	$: activeUrl = $page.url.pathname;

	let activeClass = 'border-l-4 border-[#00A859] bg-[#00A859] bg-opacity-5 text-[#005E32] group font-medium flex';
	let nonActiveClass = 'hover:bg-[#00A859] text-gray-600 hover:bg-opacity-10';

	$: if (isActivePage) {
		let splitResult: any = isActivePage?.split('/');

		console.log({splitResult})
		if ((splitResult?.length ?? 0) > 2) {
			isActivePage = `/${splitResult[1]}`;
		}

		// if ((splitResult?.length ?? 0) > 2) {
		// 	isActivePage = `/${splitResult[1]}/`;
		// }
	}

	$: console.log({isActivePage})

	$: if (activeUrl) {
		let splitResult: any = activeUrl?.split('/');
		if ((splitResult?.length ?? 0) > 2) {
			activeUrl = `/${splitResult[1]}`;
		}
	}

	let site = {
		name: '',
		href: '/',
		img: logo
	};
</script>

<Sidebar
	{activeClass}
	{nonActiveClass}
	{activeUrl}
	asideClass="hidden bg-white border-r border-r-gray-300 lg:block w-64 h-full"
>
	<SidebarWrapper divClass=" h-full py-2">
		<SidebarGroup ulClass="space-y-3 ">
			<SidebarBrand
				{site}
				aClass="flex items-center text-sm gap-2 m-4 p-2 justify-center"
				imgClass="h-12 w-auto"
    
			/>
			
			{#if menus.length}
				{#each menus as { label, icon, path, iconColor, permission } (label) }
					<div class="px-1" in:fade out:fade>
						<SidebarItem
							href={path}
							{label}
							class="flex items-center gap-2 rounded-sm px-2 py-3 pl-8 text-sm font-medium transition delay-100 duration-200 ease-in-out hover:-translate-y-1 hover:scale-100"
						>
							<svelte:fragment slot="icon">
								<Icon
									{icon}
									style="font-size: 21px"
									class={path === isActivePage ? 'text-[#005C31]' : 'text-gray-600 text-opacity-80'}
								/>
							</svelte:fragment>
						</SidebarItem>
					</div>
				{/each}
			{/if}
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
