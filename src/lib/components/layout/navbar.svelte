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
	import { logout } from '$lib/stores/auth';

	export const menus: IMenu[] = [];
</script>

<Navbar let:hidden let:toggle class="sticky top-0 z-20 flex h-16 items-center backdrop-blur-sm">
	<!-- <div/> -->
	<slot />
	<div class="flex w-full justify-between">
		<div></div>
		<div class="flex flex-row-reverse items-center justify-center gap-x-4">
			<button>
				<Avatar size="xs" />
					<!-- <div class="flex items-center justify-center text-xs font-medium">F K</div>
				</Avatar> -->
			</button>
			<Dropdown containerClass="flex flex-col space-y-4">
				<DropdownItem class="w-full"
					><button on:click={() => goto('/private/profile')} class="w-full flex items-center gap-2 p-3"><Icon icon="hugeicons:profile-02" class="h-5 w-5" />Your profile </button>
				</DropdownItem>
				<DropdownItem class="w-full">
					<button on:click={() => logout()} class="w-full flex items-center gap-2 p-3">
						<Icon icon="hugeicons:logout-02" class="h-5 w-5" />Logout
					</button>
				</DropdownItem>
			</Dropdown>
			<!-- <button>
				<Icon icon="hugeicons:notification-03" class="h-5 w-5" />
			</button> -->
			<button on:click={() => goto('/private/profile/update')} type="button">
				<Icon icon="hugeicons:settings-03" class="h-5 w-5" />
			</button>
		</div>
	</div>
	<!-- <div class="flex items-center gap-4">
			
			<ActionButton label={$activeActionButton.label} on:click={$activeActionButton.onClick} />
		</div> -->
	<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
</Navbar>
