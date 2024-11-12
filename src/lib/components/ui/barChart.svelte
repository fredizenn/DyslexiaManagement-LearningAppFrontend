<script lang="ts">
	import * as echarts from 'echarts';

	let chartElement: any;
	let chart: echarts.ECharts;
	import { onMount } from 'svelte';
	export let data: any = [];

	let option: any = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		xAxis: {
			data: data?.map((d: any) => d.name),
			type: 'category',
			// axisLabel: {
			// 	interval: 0,
			// 	show: true,
			// 	inside: false,
			// 	rotate: 0,
			// 	showMinLabel: null,
			// 	showMaxLabel: null,
			// 	margin: 8,
			// 	fontSize: 12
			// },
			axisTick: {
				alignWithLabel: true
			}
		},
		yAxis: {
			type: 'value'
			// max: 3
		},
		series: [
			{
				name: 'Exercise Scores',
				type: 'bar',
				data: data,
				label: {
					show: true,
					position: 'top',
					valueAnimation: true
				},
				barWidth: '50%',
                color: '#00929CFF'
			}
		]
	};

	// function run() {m
	// 	for (var i = 0; i < data.length; ++i) {
	// 		if (Math.random() > 0.9) {
	// 			data[i] += Math.round(Math.random() * 2000);
	// 		} else {
	// 			data[i] += Math.round(Math.random() * 200);
	// 		}
	// 	}
	// 	chart.setOption({
	// 		series: [
	// 			{
	// 				type: 'bar',
	// 				data
	// 			}
	// 		]
	// 	});
	// }
	// setTimeout(function () {
	// 	run();
	// }, 0);
	// setInterval(function () {
	// 	run();
	// }, 3000);

	onMount(() => {
		chart = echarts.init(chartElement);
		chart.setOption(option);
	});
</script>

<!-- {#if loading}
	<Loader />
{:else}
	<div id="chart-x" bind:this={chartElement} style="width: 100%;" />
{/if} -->
<div id="chart-x" bind:this={chartElement} style="width: 100%;" />

<style>
	#chart-x {
		height: 400px;
	}
	@media (min-width: 1280px) {
		#chart-x {
			height: 490px;
		}
	}
</style>
