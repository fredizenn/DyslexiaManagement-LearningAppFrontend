<script lang="ts">
	import { getExercises } from "$svc/exercises";
	import type { IExercise } from "$svc/exercises/model";
	import { onMount } from "svelte";
	import toast from "svelte-french-toast";
	import ExerciseCard from "./exerciseCard.svelte";
	import { fly } from "svelte/transition";

    let busy = false
    let exercises: IExercise[] = []
    async function fetchExercises() {
        try {
            busy = true
            const res: any = await getExercises().then((res) => res)
            if (res.success) {
                console.log({res})
                exercises = res.data
                busy = false
            } else {
                busy = false
                toast.error(res.message)
            }

        } catch (e: any) {
            busy = false
            toast.error(e.message)
        }
    }

    onMount(async() => {
        await fetchExercises()
    })
</script>

<div class="m-2 p-4 space-y-2 font-medium" in:fly={{ x: -300, duration: 500 }}>
    <div class="text-2xl font-extralight">
        Exercises
    </div>
    <div class="divide-y rounded-sm shadow max-w-lg">
        {#each exercises as e, index}
        <ExerciseCard exercise={e} />
        {/each}
    </div>
</div>

