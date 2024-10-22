<script lang="ts">
	import Form from '$lib/components/forms/form.svelte';
	import TextField from '$lib/components/forms/textField.svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { updateExerciseProgress } from '$svc/exercises';
	import type { IExercise } from '$svc/exercises/model';
	import Icon from '@iconify/svelte';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { fly } from 'svelte/transition';
	import { z } from 'zod';

	export let exercise: IExercise;
    export let timeSpent = 0;
	let loading = false;
	let currentWord = '';
	let currentQuestion = 0;
	let score = 0;
	let questionsIndex = 0;
	let done = false;
    let submitting = false
	let showFinishPage = false;
	let questions: any = [];
	const schema = z.object({
		word: z.string().min(1, 'Required')
	});

	const onStart = () => {
		dispatch('start', true)
	}

    const stopTime = () => {
        dispatch('stop', true)
    }

    // function stopTimer() {
    //     clearInterval(timeSpent);
    // }


	const onNext = () => {
		// if (!done) return;
        
		if (currentQuestion === exercise?.exercise_content.length - 1) {

			score = Math.ceil(score);
			showFinishPage = true;
			console.log({ score });
			return;
		}
		currentQuestion += 1;
        currentWord = exercise?.exercise_content[currentQuestion].answer
		done = false;
	};

	const onPrev = () => {
		if (currentQuestion === 0) return;
		currentQuestion -= 1;
	};

	const dispatch = createEventDispatcher();

    const submitExerciseProgress = async () => {
        try {
            submitting = true
            toast.loading('Please wait...')
            stopTime()
            const data = {
                score: score,
                status: 'completed',
                time_spent: timeSpent,

            }
            const res: any = await updateExerciseProgress(exercise?.id, data)
            toast.dismiss()
            if (res.status === 200) {
                toast.success('Exercise completed') 
                onFinish()
                submitting = false
            } else {
                toast.error(res?.detail)
                submitting = false
            }
        } catch (e: any) {
            submitting = false
            toast.error(e.message);
        }
    }

	const onFinish = () => {
		showFinishPage = true;
		dispatch('finish', { showFinishPage: true, score: score });
	};

	const onSubmit = async ({ detail }: any) => {
		try {
			loading = true;
			// questionsIndex += 1
			const { values } = detail;
			const compare = values.word.toLowerCase() === currentWord.toLowerCase();
			if (compare) {
				toast.success('All right! You are correct!');
				score += 25;
				// questions = [...questions, {
				//     index: questionsIndex,
				//     score: score
				// }]
				done = true;
                loading = false
				console.log({ score });
			} else {
				done = true;
				// toast.error('Wrong! Try again!');
				toast.error('Wrong! Try again!');
                loading = false
			}
		} catch (e: any) {
			toast.error('Something went wrong');
            loading = false
		}
	};

	onMount(async () => {
		if (exercise) {
            onStart();
			currentWord = exercise?.exercise_content[currentQuestion].answer;
		}
	});
</script>

{#each exercise?.exercise_content as ex, index}
	{#if index === currentQuestion}
		<Form {schema} on:submit={onSubmit}>
			<div
				in:fly={{ x: 300, duration: 500 }}
				out:fly={{ x: -300, duration: 0 }}
				class="mt-6 flex h-full w-full flex-col items-center justify-center space-y-10"
			>
				<div>
					<div class="text-center text-6xl tracking-widest">{ex?.word}</div>
					<div class="py-2 text-center text-xs text-gray-500">Hint: {ex?.hint}</div>
				</div>

				<div class="w-full">
					<TextField otherClasses="w-full" placeholder="Unscrambled word" name="word" />
				</div>
				<div class="flex w-full items-center justify-center gap-3 py-3">
					<ActionButton type="submit" otherClasses="py-3" disabled={loading || done} label="Check Answer" />
					<Button
						color="light"
						outline
						type="button"
						class="py-3"
                        disabled={submitting}
						on:click={currentQuestion === exercise?.exercise_content.length - 1 ? submitExerciseProgress : onNext}
						>{#if currentQuestion === exercise?.exercise_content.length - 1}<Icon
								icon="lets-icons:flag-finish"
								class="h-5 w-5"
							/>{:else}<Icon icon="hugeicons:arrow-right-01" class="h-5 w-5" />{/if}</Button
					>
					<Tooltip placement="bottom"
						>{#if currentQuestion === exercise?.exercise_content.length - 1}Finish{:else}Next{/if}</Tooltip
					>
				</div>
			</div>
		</Form>
	{/if}
{/each}
