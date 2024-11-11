<script lang="ts">
	import Form from '$lib/components/forms/form.svelte';
	import TextField from '$lib/components/forms/textField.svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { fontSize } from '$lib/stores/auth';
	import { matchAnswer, speechToText, updateExerciseProgress } from '$svc/exercises';
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
	let currentAnswer = '';
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
	let rerender = false;
	let transcription = '';
	let init = {
		word: ''
	};
	const schema = z.object({
		word: z.string().min(1, 'Required')
	});

	const fs = $fontSize;

	console.log({ fs });
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
		transcription = '';

		if (currentQuestion === exercise?.exercise_content.length - 1) {
			score = Math.ceil(score);
			showFinishPage = true;
			return;
		}
		audioBlob = null;
		currentQuestion += 1;
		currentAnswer = exercise?.exercise_content[currentQuestion].answer;
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
			if (transcription !== '') {
				const compare = await matchAnswer(transcription.toLowerCase(), currentAnswer.toLowerCase());
				if (compare.match) {
					if (compare.match_score === 100) {
						toast.success('Excellent! You are correct!');
					} else {
						toast.success('Good attempt! Well done!');
					}
					score += 25;
					done = true;
					loading = false;
				} else {
					// done = true;
					toast.error('Wrong! Try again!');
					loading = false;
				}
				return;
			}
			const { values } = detail;

			// const compare = values.word.toLowerCase() === currentAnswer.toLowerCase();
			const compare = await matchAnswer(values.word.toLowerCase(), currentAnswer.toLowerCase());
			if (compare.match) {
				if (compare.match_score === 100) {
					toast.success('Excellent! You are correct!');
				} else {
					toast.success('Good attempt! Well done!');
				}
				score += 25;
				done = true;
				loading = false;
			} else {
				// done = true;
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
			if (res) {
				transcription = res.transcriptions[0];
				await onSubmit({});
				transcribing = false;
			} else {
				toast.error('An error occurred while transcribing');
				transcribing = false;
			}
		} catch (e: any) {
			toast.error(e.message);
			transcribing = false;
		} finally {
			audioBlob = null;
			transcribing;
		}
	};

	onMount(async () => {
		if (exercise) {
			onStart();
			currentAnswer = exercise?.exercise_content[currentQuestion].answer;
		}
	});
</script>

{#each exercise?.exercise_content as ex, index}
	{#if index === currentQuestion}
		<Form {schema} {init} on:submit={onSubmit}>
			<div
				in:fly={{ x: 300, duration: 500 }}
				out:fly={{ x: -300, duration: 0 }}
				class="mt-6 flex h-full w-full flex-col items-center justify-center space-y-10"
			>
				<div>
					<div class:text-fs={fs} class="text-center tracking-widest">{ex?.question}</div>
					<!-- <div class="py-2 text-center text-xs text-gray-500">Hint: {ex?.hint}</div> -->
				</div>

				<div class="w-full">
					{#key rerender}
						<TextField otherClasses="w-full" placeholder="Answer" name="word" />
					{/key}
				</div>

				<div class="flex w-full items-center justify-center gap-3 py-3">
					<ActionButton
						type="submit"
						otherClasses="py-3"
						disabled={loading || done}
						label="Check answer"
					/>
					<ActionButton
						type="button"
						hasIcon
						disabled={loading || done || transcribing}
						icon={isRecording ? 'hugeicons:stop' : 'hugeicons:mic-01'}
						label={isRecording ? 'Stop' : 'Check answer by speech'}
						onClick={() => toggleRecording()}
						otherClasses="flex items-center justify-center py-3 transition duration-200 {isRecording
							? 'bg-red-500'
							: 'bg-green-500'}"
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
				{#if index === currentQuestion}
					<div class="flex flex-col items-center">
						<div class="flex items-center space-x-2">
							<span class="text-lg font-bold">
								{#if isRecording}
									<div class="flex items-center space-x-2 text-xs">
										<Icon
											icon="hugeicons:record"
											class="h-4 w-4 text-red-600"
										/>{`Recording... ${Math.floor(seconds / 60)
											.toString()
											.padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`}
									</div>
								{/if}
							</span>
							{#if audioBlob && !isRecording}
								<ActionButton
									type="button"
									label="Generate text and confirm answer"
									disabled={transcribing || !audioBlob}
									onClick={transcribe}
									otherClasses="mt-1 p-3"
								/>
								<!-- Generate text and confirm answer
									</button> -->
							{/if}
							<div>
								{#if transcription}Your text: {transcription}
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</Form>
	{/if}
{/each}
