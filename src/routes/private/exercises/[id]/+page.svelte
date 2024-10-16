<script lang="ts">
	import { page } from '$app/stores';
	import { getExercise } from '$svc/exercises';
	import type { IExercise } from '$svc/exercises/model';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	let loading = false;
	let exercise: IExercise = {} as IExercise;

	async function fetchExercise() {
		try {
			loading = true;
			const res: any = await getExercise(+$page.params.id);
			if (res?.success) {
				exercise = res.data;
				loading = false;
			} else {
				loading = false;
				toast.error(res.message);
			}
		} catch (e: any) {
			loading = false;
			toast.error(e.message);
		}
	}

	onMount(async () => {
		await fetchExercise();
	});
</script>

<Toaster />

<div class="flex h-full w-full items-center justify-center">
	<div class="min-h-[800px] w-2/3 p-3">
		<div class="rounded-lg bg-blue-50 p-3">
			<div class="text-lg font-medium">
				{exercise?.title}
			</div>
			<div class="text-sm">
				{exercise.description}
			</div>
		</div>
        {#if exercise?.difficulty_level === 1 && exercise?.exercise_content}
            {#each exercise?.exercise_content as ec}
                <div>{ec?.word}</div>
            {/each}
        {/if}
        <div>

        </div>
	</div>
</div>
