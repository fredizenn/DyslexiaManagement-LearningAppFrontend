<script lang="ts">
	import { browser } from '$app/environment';
	import { Avatar } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { goto } from '$app/navigation';

	let userConfig: any;
	onMount(() => {
		if (browser) {
			userConfig = JSON.parse(localStorage.getItem('p') || '{}');
		}
	});
</script>

<div class="h-full w-full">
	<!-- <div class="mx-auto w-full align-middle">
		<ActionButton
			label="Update Your Profile"
			type="button"
			onClick={() => goto('/private/profile/update')}
			otherClasses="w-full p-2 mt-4"
		/>
	</div> -->
	<div
		class="mx-auto flex h-full max-w-xl justify-center gap-10 space-x-10 pt-10"
		in:fly={{ y: -300, duration: 500 }}
	>
		<div class="text-2xl font-extralight">Your profile</div>
		<div class="flex flex-col items-center">
			<Avatar class="bg-cyan-600" size="xl">
				<div class="flex items-center justify-center text-4xl tracking-wide text-white">FK</div>
			</Avatar>
			<div class="mt-2 text-center text-lg text-gray-600">
				{userConfig?.user.first_name + ' ' + userConfig?.user.last_name}
			</div>
			<div class="text-center text-gray-500">{userConfig?.user.username}</div>
			<div class="text-center text-sm text-gray-400">{userConfig?.user.email}</div>
		</div>
		<div class="">
			<ul role="list" class="divide-y divide-gray-200">
				<li class="flex justify-between gap-x-6 py-5">
					<div class="flex min-w-0 gap-x-4">
						<div class="min-w-0 flex-auto">
							<p class="text-sm/6 font-semibold text-gray-900">Reading Level</p>
							<p class="mt-1 truncate text-xs/5 text-gray-500">
								Reading ability to be paired with reading content
							</p>
						</div>
					</div>
					<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
						<p class="text-sm/6 text-gray-900">{userConfig?.reading_level ?? 'N/A'}</p>
						<!-- <p class="mt-1 text-xs/5 text-gray-500">Preferred method of learning</p> -->
					</div>
				</li>
				<li class="flex justify-between gap-x-6 py-5">
					<div class="flex min-w-0 gap-x-4">
						<div class="min-w-0 flex-auto">
							<p class="text-sm/6 font-semibold text-gray-900">Reading and Exercise Font Size</p>
							<p class="mt-1 truncate text-xs/5 text-gray-500">Preferred sizes for font</p>
						</div>
					</div>
					<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
						<p class="text-sm/6 text-gray-900">{userConfig?.preferred_font_size}</p>
						<p class="mt-1 text-xs/5 text-gray-500">
							<!-- Last seen <time datetime="2023-01-23T13:23Z">3h ago</time> -->
						</p>
					</div>
				</li>
				<li class="flex justify-between gap-x-6 py-5">
					<div class="flex min-w-0 gap-x-4">
						<div class="min-w-0 flex-auto">
							<p class="text-sm/6 font-semibold text-gray-900">Learning Style</p>
							<p class="mt-1 truncate text-xs/5 text-gray-500">Preferred method of learning</p>
						</div>
					</div>
					<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
						<p class="text-sm/6 capitalize text-gray-900">{userConfig?.learning_style}</p>
						<div class="mt-1 flex items-center gap-x-1.5">
							<!-- <div class="flex-none rounded-full bg-emerald-500/20 p-1">
							<div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
						</div>
						<p class="text-xs/5 text-gray-500">Online</p> -->
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
	
</div>
