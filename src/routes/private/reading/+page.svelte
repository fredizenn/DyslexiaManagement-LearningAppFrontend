<script lang="ts">
	import Modal from '$lib/components/ui/modal.svelte';
	import Movable from '$lib/components/ui/movable.svelte';
	import { getReadingContents } from '$svc/reading';
	import type { IReadingContent } from '$svc/reading/model';
	import Icon from '@iconify/svelte';
	import { Dropdown, DropdownItem, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { fly } from 'svelte/transition';

	let loading = false;
	let showReadModal = false;
	let currentContent: any;
	let contents: IReadingContent[] = [];
	async function fetchReadings() {
		try {
			loading = true;
			const res: any = await getReadingContents();
			if (res.status === 200) {
				contents = res.data;
				loading = false;
			} else {
				loading = false;
			}
		} catch (e: any) {
			loading = false;
			toast.error(e.message);
		}
	}

	onMount(async () => {
		await fetchReadings();
	});
</script>

<Toaster />

<div class="m-2 space-y-2 p-4 font-medium" in:fly={{ x: -300, duration: 500 }}>
	<div class="text-2xl font-extralight">Reading Exercises</div>
	<ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
		{#each contents as content, index}
			<li class="col-span-1 flex rounded-md shadow-sm">
				<div
					class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-slate-100 text-sm font-medium shadow"
				>
					<Icon icon="hugeicons:book-02" class="h-8 w-8" />
				</div>
				<div
					class="flex flex-1 items-center justify-between truncate rounded-r-md border-gray-200 bg-white shadow"
				>
					<div class="flex-1 truncate px-4 py-2 text-sm">
						<div class="font-medium text-gray-900 hover:text-gray-600">{content?.title}</div>
						<p class="text-sm text-gray-500">
							Difficulty Level: {content?.difficulty_level === 1
								? 'Easy'
								: content?.difficulty_level === 2
									? 'Medium'
									: 'Hard'}
						</p>
					</div>
					<div class="flex-shrink-0 pr-2">
						<button
							type="button"
							class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span class="sr-only">Open options</span>
							<svg
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
								data-slot="icon"
							>
								<path
									d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
								/>
							</svg>
						</button>
						<Dropdown>
							<button
								on:click={() => {
									showReadModal = true;
									currentContent = content;
								}}
							>
								<DropdownItem>Read</DropdownItem>
							</button>
						</Dropdown>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

{#if showReadModal}
	<Modal
		size="md"
		title={currentContent.title}
		bind:open={showReadModal}
		on:close={() => (showReadModal = false)}
	>
		<div class="flex w-full justify-end">
			{#if currentContent.difficulty_level === 1}
				<Icon icon="hugeicons:star" class="h-5 w-5 text-green-600" />
			{:else if currentContent.difficulty_level === 2}
				<Icon icon="hugeicons:star" class="h-5 w-5 text-amber-600" />
			{:else if currentContent.difficulty_level === 3}
				<Icon icon="hugeicons:star" class="h-5 w-5 text-red-600" />
			{/if}
		</div>
		<div class="my-4">
			<P firstupper space="normal" justify whitespace="normal" height="loose"
				>{currentContent.body}</P
			>
		</div>
	</Modal>
{/if}
