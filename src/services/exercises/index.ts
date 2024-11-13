/* eslint-disable @typescript-eslint/no-explicit-any */
import client from '../../client';
import type { IExercise } from './model';

export async function getExercises(): Promise<IExercise[]> {
	try {
		const response = await client.get('/exercises/');
		const data: IExercise[] = response.data;
		return data;
	} catch (e) {
		console.error(e);
		return [];
	}
}

export async function getExercise(id: number): Promise<IExercise> {
	try {
		const response = await client.get(`/exercises/${id}/`);
		const data: IExercise = response.data;
		return data;
	} catch (e) {
		console.log(e);
		return e as IExercise;
	}
}

export async function updateExerciseProgress(id: number | undefined, exerciseData: any) {
	try {
		const response = await client.patch(`/progress/update/`, {
			...exerciseData,
			exercise: id
		});
		const ret = response;
		return ret;
	} catch (e) {
		console.log(e);
		return e;
	}
}

export async function speechToText(audio: any) {
	try {
		const formData = new FormData();
		formData.append('audio', audio);
		const response = await client.post('/speech-to-text/', formData);
		const data = response.data;
		return data;
	} catch (e) {
		console.log(e);
		return e;
	}
}

export async function matchAnswer(answer: string, userInput: string) {
	try {
		const response = await client.post('/verify-answer/', {
			actual_answer: answer,
			user_answer: userInput
		});
		const data = response.data;
		return data;
	} catch (e) {
		console.log(e);
		return e;
	}
}

export async function suggestExercises() {
	try {
		const response = await client.get('/suggested-exercise/');
		const data = response;
		return data
	} catch(e: any) {
		return e
	}
}
