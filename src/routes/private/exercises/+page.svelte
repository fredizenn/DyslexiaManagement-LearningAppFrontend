<script lang="ts">
	import { getExercises } from "$svc/exercises";
	import { onMount } from "svelte";

    let busy = false
    async function fetchExercises() {
        try {
            busy = true
            const res = await getExercises().then((res) => res)
            console.log({res})
        } catch (e) {

        }
    }

    onMount(async() => {
        await fetchExercises()
    })
</script>