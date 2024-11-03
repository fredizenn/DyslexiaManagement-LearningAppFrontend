<script lang="ts">
	import Movable from '$lib/components/ui/movable.svelte';
	import { getReadingContents } from '$svc/reading';
	import type { IReadingContent } from '$svc/reading/model';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	let loading = false;
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
    })
</script>

<Toaster />

<div class="m-2 p-4 space-y-2 font-medium">
    <div class="text-2xl">
        Text Content
    </div>
    <ul role="list" class="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
    {#each contents as content}
      <li class="col-span-1 flex rounded-md shadow-sm">
        <div class="flex w-16 flex-shrink-0 items-center justify-center rounded-l-md bg-cyan-50 text-sm shadow font-medium "><Icon icon="hugeicons:book-02" class="w-8 h-8" /></div>
        <div class="flex flex-1 items-center justify-between truncate rounded-r-md shadow border-gray-200 bg-white">
          <div class="flex-1 truncate px-4 py-2 text-sm">
            <a href="#" class="font-medium text-gray-900 hover:text-gray-600">{content?.title}</a>
            <p class="text-gray-500 text-sm">Difficulty Level: {content?.difficulty_level === 1 ? 'Easy' : content?.difficulty_level === 2 ? 'Medium' : 'Hard' }</p>
          </div>
          <div class="flex-shrink-0 pr-2">
            <button type="button" class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="sr-only">Open options</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
              </svg>
            </button>
          </div>
        </div>
      </li>
    {/each}
    </ul>
  </div>
  