<script lang="ts">
	import { goto } from "$app/navigation";
	import ActionButton from "$lib/components/ui/actionButton.svelte";
	import Icon from "@iconify/svelte";

    export let score = 0
    export let indices: any = []

    $: score
</script>
<div class="flex flex-col h-full w-full space-y-4 items-center p-4 justify-center">
    <!-- <div class="flex items-center justify-center py-2 gap-2">
        <div class="bg-green-100 rounded-full flex items-center justify-center text-lg text-center w-12 h-12">1</div>
        <div class="bg-red-100 rounded-full flex items-center justify-center text-lg text-center w-12 h-12">2</div>
        <div class="bg-green-100 rounded-full flex items-center justify-center text-lg text-center w-12 h-12">3</div>
    </div> -->
    <div class="text-4xl">
        Final score: {score}%
    </div>
    <div class="text-sm flex items-center gap-2">Hurray! You have finished this exercise.</div>
    <div class="flex items-center gap-2 text-xs text-gray-600 font-medium">Remember, do not worry about your score. Good or bad, you can always try again. Enjoy!<Icon icon="hugeicons:smile" class="w-6 h-6" /></div>
</div>
<div>
    <ActionButton otherClasses="py-2 mx-auto align-middle w-2/3" label="Go to Exercises" onClick={() => goto('/private/exercises')} />
</div>