<script lang="ts">
	import Form from '$lib/components/forms/form.svelte';
	import TextField from '$lib/components/forms/textField.svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { speechToText, updateExerciseProgress } from '$svc/exercises';
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
	let submitting = false;
	let isRecording = false;
	let showFinishPage = false;
	let questions: any = [];
	let transcribing = false;
	let audioBlob: any;
	let seconds = 0;
	let mediaRecorder: any;
	let recordingInterval: any;

	const schema = z.object({
		word: z.string().min(1, 'Required')
	});

	const onStart = () => {
		dispatch('start', true);
	};

	const stopTime = () => {
		dispatch('stop', true);
	};

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
		currentWord = exercise?.exercise_content[currentQuestion].answer;
		done = false;
	};

	const onPrev = () => {
		if (currentQuestion === 0) return;
		currentQuestion -= 1;
	};

	const dispatch = createEventDispatcher();

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
				loading = false;
				console.log({ score });
			} else {
				done = true;
				// toast.error('Wrong! Try again!');
				toast.error('Wrong! Try again!');
				loading = false;
			}
		} catch (e: any) {
			toast.error('Something went wrong');
			loading = false;
		}
	};

	function toggleRecording() {
		if (!isRecording) {
			startRecording();
		} else {
			stopRecording();
		}
		isRecording = !isRecording;
	}

	function startRecording() {
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.start();

			mediaRecorder.ondataavailable = (e: any) => {
				audioBlob = e.data;
			};

			startTimer();
		});
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state === 'recording') {
			mediaRecorder.stop();
		}
		stopTimer();
	}

	function startTimer() {
		seconds = 0;
		recordingInterval = setInterval(() => {
			seconds++;
		}, 1000);
	}

	function stopTimer() {
		clearInterval(recordingInterval);
	}

	const transcribe = async () => {
		try {
			transcribing = true;
			const res = await speechToText(audioBlob);
			if (res.status === 200) {
				const { transcription } = res.data;
				console.log({ transcription });
			}
		} catch (e: any) {
			toast.error(e.message);
		}
	};

	onMount(async () => {
		if (exercise) {
			onStart();
			currentWord = exercise?.exercise_content[currentQuestion].answer;
		}
	});
</script>

<div class="flex flex-col items-center space-y-4">
	<button
		on:click={toggleRecording}
		class="mt-2 flex items-center justify-center rounded-full transition duration-200"
		class:bg={isRecording ? 'bg-red-500' : 'bg-green-500'}
	>
		{#if isRecording}
			<div class="flex items-center space-x-2">
				<Icon icon="hugeicons:stop" class="h-5 w-5" />
				<div>Stop</div>
			</div>
		{:else}
			<div class="flex items-center space-x-2">
				<Icon icon="hugeicons:mic-01" class="h-5 w-5" />
				<div>Record</div>
			</div>
		{/if}
	</button>

	<div class="flex items-center space-x-2">
		<span class="text-lg font-bold">
			{#if isRecording}
				<div class="flex items-center space-x-2">
					<Icon icon="hugeicons:record" class="h-5 w-5 text-red-600" />{`Recording... ${Math.floor(
						seconds / 60
					)
						.toString()
						.padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`}
				</div>
			{/if}
		</span>
		{#if audioBlob}
			<button
				class="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600 focus:outline-none"
				class:hidden={isRecording || !audioBlob}
			>
				Generate text
			</button>
		{/if}
	</div>
</div>

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
					<ActionButton
						type="submit"
						otherClasses="py-3"
						disabled={loading || done}
						label="Check Answer"
					/>
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
			</div>
		</Form>
	{/if}
{/each}
