<script lang="ts">
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { base64ToImage, convertToBinary } from '$lib/utils';
	import { updateExerciseProgress } from '$svc/exercises';
	import type { IExercise } from '$svc/exercises/model';
	import Icon from '@iconify/svelte';
	import { Button, Tooltip, Radio } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let exercise: IExercise;
	export let timeSpent = 0;
	let loading = false;
	let currentWord = '';
	let currentQuestion = 0;
	let score = 0;
	let questionsIndex = 0;
	let done = false;
	let submitting = false;
	let content: any = [];
	let showFinishPage = false;
	let answer: any = '';
	const dispatch = createEventDispatcher();

	const onNext = () => {
		// if (!done) return;

		if (currentQuestion === exercise?.exercise_content.length - 1) {
			score = Math.ceil(score);
			showFinishPage = true;

			console.log({ score });
			return;
		}
		currentQuestion += 1;
		currentWord = exercise?.exercise_content[currentQuestion].answer;
		done = false;
	};

	const onFinish = () => {
		showFinishPage = true;
		dispatch('finish', { showFinishPage: true, score: score });
	};

	const onStart = () => {
		dispatch('start', true);
	};

	const onPrev = () => {
		if (currentQuestion === 0) return;
		currentQuestion -= 1;
	};

	const stopTime = () => {
		dispatch('stop', true);
	};

	const submitExerciseProgress = async () => {
		try {
			submitting = true;
			toast.loading('Please wait...');
			stopTime();
			const data = {
				score: score,
				status: 'completed',
				time_spent: timeSpent
			};
			const res: any = await updateExerciseProgress(exercise?.id, data);
			toast.dismiss();
			if (res.status === 200) {
				toast.success('Exercise completed');
				onFinish();
				submitting = false;
			} else {
				toast.error(res?.detail);
				submitting = false;
			}
		} catch (e: any) {
			submitting = false;
			toast.error(e.message);
		}
	};

    const onSubmit = async () => {
		try {
			loading = true;
            console.log({answer})
            console.log({currentWord})
			const compare = answer.toLowerCase() === currentWord.toLowerCase();
			if (compare) {
				toast.success('All right! You are correct!');
				score += 25;
				
				done = true;
				loading = false;
				console.log({ score });
			} else {
				done = false;
				toast.error('Wrong! Try again!');
				loading = false;
			}
		} catch (e: any) {
			toast.error('Something went wrong');
			loading = false;
		}
	};

	onMount(async () => {
		content = exercise.exercise_content.map((item: any) => {
			return {
				...item,
				image: base64ToImage(item.image, item.word, item.word)
			};
		});

		if (exercise) {
			onStart();
			currentWord = exercise?.exercise_content[currentQuestion].answer;
		}

		console.log(content);
	});
</script>

{#each content as ex, index}
	{#if currentQuestion === index}
		<div class="grid h-full w-full grid-cols-2 items-center">
			<img src={ex.image.img.src} alt="" class="h-48 w-auto" />
			<div class="pt-4 space-y-4">
                <div class="text-lg font-medium">
                    Choose the right answer

                </div>
				<ul
					class="w-48 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-600 dark:border-gray-600 dark:bg-gray-800"
				>
					{#each ex.options as option}
						<li><Radio class="p-3" bind:group={answer} value={option}>{option}</Radio></li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="flex w-full items-center justify-center gap-3 py-3">
			<ActionButton
				type="button"
                onClick={onSubmit}
				otherClasses="py-3"
				disabled={loading || done}
				label="Check Answer"
			/>
			<!-- {#if isRecording}
                        <div class="flex items-center space-x-2">
                            <Icon icon="hugeicons:stop" class="h-5 w-5" />
                            <div>Stop</div>
                        </div>
                    {:else}
                        <div class="flex items-center space-x-2">
                            <Icon icon="hugeicons:mic-01" class="h-5 w-5" />
                            <div>Click to check your answer by speech</div>
                        </div>
                    {/if}
                    </ActionButton> -->
			<Button
				color="light"
				outline
				type="button"
				class="py-3"
				disabled={submitting}
				on:click={currentQuestion === exercise?.exercise_content.length - 1
					? submitExerciseProgress
					: onNext}
				>{#if currentQuestion === exercise?.exercise_content.length - 1}<Icon
						icon="lets-icons:flag-finish"
						class="h-5 w-5"
					/>{:else}<Icon icon="hugeicons:arrow-right-01" class="h-5 w-5" />{/if}</Button
			>
			<Tooltip placement="bottom"
				>{#if currentQuestion === exercise?.exercise_content.length - 1}Finish{:else}Next{/if}</Tooltip
			>
		</div>
	{/if}
{/each}
