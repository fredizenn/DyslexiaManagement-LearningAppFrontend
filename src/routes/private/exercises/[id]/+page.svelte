<script lang="ts">
	import { page } from '$app/stores';
	import Form from '$lib/components/forms/form.svelte';
	import TextField from '$lib/components/forms/textField.svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { getExercise } from '$svc/exercises';
	import type { IExercise } from '$svc/exercises/model';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { z } from 'zod';
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
		<div class="w-full">
			{#if exercise?.difficulty_level === 1 && exercise?.exercise_content}
				{#each exercise?.exercise_content as ec, index}
					<Form schema={z.object({})}>
						<div class="w-full grid-cols-2 items-center gap-4 space-y-6 py-2 md:grid">
							<div class="text-lg tracking-widest"><span>{index + 1}. </span>{ec?.word}</div>
							<div class="flex items-center">
								<TextField placeholder="Unscrambled word" name={ec.answer} />
								<span>
									<ActionButton otherClasses="mx-auto align-middle w-2/3" label="Check Answer" />
								</span>
							</div>
						</div>
					</Form>
				{/each}
			{/if}
			<div></div>
		</div>
	</div>
</div>
