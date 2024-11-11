<script lang="ts">
	import { page } from '$app/stores';
	import Form from '$lib/components/forms/form.svelte';
	import TextField from '$lib/components/forms/textField.svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { receive, send } from '$lib/utils/transition';
	import { getExercise } from '$svc/exercises';
	import type { IExercise } from '$svc/exercises/model';
	import Icon from '@iconify/svelte';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { z } from 'zod';
	import WordScramble from '../wordScramble.svelte';
	import Finish from '../finish.svelte';
	import FillTheBlanks from '../fillTheBlanks.svelte';
	import Matching from '../matching.svelte';
	import Comprehension from '../comprehension.svelte';
	import { fontSize } from '$lib/stores/auth';
	let exercise: IExercise = {} as IExercise;
	let loading = false;
	let score = 0;
	let timeSpent = 0;
	let showFinishPage = false;
	let exerciseSummary;
	let interval: any;

	$: gotoFinish = ({ detail }: any) => {
		clearInterval(interval);
		showFinishPage = detail.showFinishPage;
		score = detail.score;
	};

	function start({ detail }: any) {
		if (detail) {
			interval = setInterval(() => {
				timeSpent += 1;
			}, 1000);
		}
	}

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

	$: formattedTime = `${String(Math.floor(timeSpent / 3600)).padStart(2, '0')}:${String(Math.floor((timeSpent % 3600) / 60)).padStart(2, '0')}:${String(timeSpent % 60).padStart(2, '0')}`;

	onMount(async () => {
		await fetchExercise();
	});
</script>

<Toaster />

<div class="flex h-full w-full items-center justify-center">
	<div class="min-h-[800px] w-2/3 p-3">
		<!-- {#if !showFinishPage} -->
		<div class="rounded-lg bg-yellow-100/50 p-3">
			<div class="text-lg font-medium">
				{exercise?.title}
			</div>
			<div class="text-sm">
				{exercise.description}
			</div>
			<div class="text-xs font-medium">
				Time spent: {formattedTime}
			</div>
		</div>
		<!-- {/if} -->
		<div class="mx-auto h-full w-2/3 align-middle">
			{#if !showFinishPage}
				{#if exercise?.exercise_type === 'scramble' && exercise?.exercise_content}
					<!-- {#each exercise?.exercise_content as ec, index} -->
					<WordScramble {timeSpent} on:start={start} on:finish={gotoFinish} {exercise} />
				{:else if exercise?.exercise_type === 'blanks' && exercise?.exercise_content}
					<FillTheBlanks {timeSpent} on:start={start} on:finish={gotoFinish} {exercise} />

				{:else if exercise?.exercise_type === 'matching' && exercise?.exercise_content}
					<Matching {timeSpent} on:start={start} on:finish={gotoFinish} {exercise} />
					<!-- {/each} -->
				{:else if exercise?.exercise_type === 'comprehension' && exercise?.exercise_content}
					<Comprehension {timeSpent} on:start={start} on:finish={gotoFinish} {exercise} />
				{/if}
			{:else}
				<div>
					<Finish {score} />
				</div>
			{/if}
		</div>
	</div>
</div>
