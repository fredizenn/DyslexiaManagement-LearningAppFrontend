<script lang="ts">
	import BarChart from '$lib/components/ui/barChart.svelte';
	import Loader from '$lib/components/ui/loader.svelte';
	import PieChart from '$lib/components/ui/pieChart.svelte';
	import { progressHistory, progressSummary } from '$svc/reports';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	let loadingProgressSummary = false;
    let loadingHistory = false;
	let progressData: any;
    let progressHistoryData: any;
	let x: any;

	async function summary() {
		try {
			loadingProgressSummary = true;
			const res: any = await progressSummary();
			if (res.status !== 200) {
				loadingProgressSummary = false;
				toast.error('An error occurred');
				return;
			}

			x = res.data;
			progressData = [
				{ name: 'Exercises Completed', value: x.completed_exercises },
				{ name: 'Not Completed', value: x.total_exercises - x.completed_exercises }
			];

			loadingProgressSummary = false;
		} catch (e: any) {
			toast.error(e.message);
			loadingProgressSummary = false;
		}
	} 

    async function fetchProgressHistory () {
        try {
            loadingHistory = true
            const res: any = await progressHistory()
            if (res) {
                progressHistoryData = res?.data.map((item: any) => {
                    return {
                        ...item,
                        name: 'Exercise' + ' ' + item.exercise,
                        value: item.score
                    }
                }).slice(-5)
                console.log({progressHistoryData})
                loadingHistory = false
            } else {
                toast.error('An error occurred')
                loadingHistory = false
            }
        } catch (e: any)  {
            toast.error(e.message)
            loadingHistory = false
        }
    }

	onMount(async () => {
		await summary();
        await fetchProgressHistory();
	});
</script>
<Toaster />
<div class="p-4">
	<div class="text-lg font-extralight">Summaries</div>
	<div class="max-w-8xl mx-auto flex gap-4">
		<div class="w-full rounded-lg p-4 shadow">
			{#if loadingProgressSummary}
				<Loader />
			{:else}
				<PieChart data={progressData} />
			{/if}
		</div>
		<div class="w-full rounded-lg p-4 shadow">
            <div>Exercise history</div>
			{#if loadingHistory}
				<Loader />
			{:else}
				<BarChart data={progressHistoryData} />
			{/if}
		</div>
	</div>
	<div class="gap-4 mt-4 h-full md:flex">
		<div class=" w-full h-full rounded-lg p-4 shadow">
			<div class="capitalize">Average score</div>
			<div class="flex h-full items-center justify-center text-5xl">
				{#if loadingProgressSummary}
					<Loader />
				{:else}
					{x?.average_score}%
				{/if}
			</div>
		</div>
        <div class="w-full rounded-lg h-full p-4 shadow">
			<div class="capitalize">Average time spent on exercises</div>
			<div class="flex h-full items-center justify-center text-5xl">
                
                {#if loadingProgressSummary}
					<Loader />
				{:else}
				{Math.floor(+x?.average_time_spent / 60)
					.toString()
					.padStart(2, '0')}h {((+x?.average_time_spent % 60).toFixed(0) + 'min')
					.toString()
					.padStart(2, '0')}
                {/if}
			</div>
		</div>
	</div>
</div>
