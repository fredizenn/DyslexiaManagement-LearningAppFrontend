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
		return {} as IExercise;
	}
}

export async function updateExerciseProgress(id: number | undefined, exerciseData: any) {
	try {
		const response = await client.patch(`/progress/update/`, {
			
				...exerciseData,
				exercise: id
			
		});
		const ret = response
		return ret;
	} catch (e) {
		console.log(e);
		return {};
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
		return {};
	}
}
