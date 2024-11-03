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
	//
	export let menus: IMenu[] = [];

	$: isActivePage = $page.route.id;

	$: activeUrl = $page.url.pathname;

	let activeClass = 'bg-indigo-100 bg-opacity-5 text-indigo-800 group font-medium flex';
	let nonActiveClass = 'hover:bg-indigo-700 text-gray-600';

	$: if (isActivePage) {
		let splitResult: any = isActivePage?.split('/');

		if ((splitResult?.length ?? 0) > 2) {
			isActivePage = `/private/${splitResult[2]}`;
		}

		// if ((splitResult?.length ?? 0) > 2) {
		// 	isActivePage = `/${splitResult[1]}/`;
		// }
	}

	$: if (activeUrl) {
		let splitResult: any = activeUrl?.split('/');
		if ((splitResult?.length ?? 0) > 2) {
			activeUrl = `/${splitResult[1]}`;
		}
	}

	let site = {
		name: '',
		href: '/',
		img: ''
	};
</script>

<Sidebar
	{activeClass}
	{nonActiveClass}
	{activeUrl}
	asideClass="hidden bg-white lg:block w-24 h-full"
>
	<SidebarWrapper divClass="h-full py-2">
		<SidebarGroup ulClass="space-y-3 ">
			<div class="w-full flex py-3 items-center justify-center">
				<Icon icon="hugeicons:ai-brain-01" class="text-gray-700 w-10 h-10" />
			</div>
			<!-- <SidebarBrand
				{site}
				aClass="flex items-center text-sm gap-2 m-4 p-2 justify-center"
				imgClass="h-12 w-auto"
			/> -->

			{#if menus.length}
			<div class="pt-4 space-y-6"> 
				{#each menus as { label, icon, path, iconColor } (icon)}
					<div class="px-1" in:fade out:fade>
						<!-- <SidebarItem
							href={path}
							class="w-2/4 mx-auto align-middle flex items-center justify-center gap-2 rounded-sm py-3 text-sm font-medium transition delay-100 duration-200 ease-in-out hover:-translate-y-1 hover:scale-100"
						>
							<svelte:fragment slot="icon"> -->
							<a href={path} class:bg-indigo-100={path === isActivePage} class="hover:bg-indigo-100 w-2/4 mx-auto align-middle flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium transition delay-100 duration-200 ease-in-out hover:-translate-y-1 hover:scale-100">
								<Icon
								{icon}
								style="font-size: 21px"
								class={path === isActivePage
									? 'text-indigo-700'
									: 'text-gray-800 text-opacity-80'}
							/>
							</a>
								
							<!-- </svelte:fragment>
						</SidebarItem> -->
					</div>
				{/each}
			</div>
			{/if}
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
