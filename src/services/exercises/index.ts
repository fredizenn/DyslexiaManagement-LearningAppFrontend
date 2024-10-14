import { P } from "flowbite-svelte";
import client from "../../client";
import type { IExercise } from "./model";

export async function getExercises(): Promise<IExercise[]> {
    const response = await client.get('/exercises/');
    const data: IExercise[] = response.data;
    
    console.log({ data });

    return data;
}