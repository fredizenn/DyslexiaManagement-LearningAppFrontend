<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	let chartElement: any;
	let chart: echarts.ECharts;

	export let data: any;

	let option: any = {
		legend: {
			top: 'bottom',
			left: 'center'
		},
		tooltip: {
			trigger: 'item',
		
		},
		toolbox: {
			show: true,
			feature: {
				mark: { show: true },
				dataView: { show: true, readOnly: false },
				restore: { show: true },
				saveAsImage: { show: true }
			}
		},
		series: [
			{
				name: 'Progress Summary (Completed/Not Completed)',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				center: ['50%', '50%'],
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2
				},
				label: {
					show: false
				},
				data: data
			}
		]
	};

	onMount(() => {
		chart = echarts.init(chartElement);
		chart.setOption(option);
	});
</script>


	<div id="chart-x" bind:this={chartElement} style="width: 100%;" class="h-72" />

<style>
	#chart-x {
		height: 450px;
	}
	@media (min-width: 1280px) {
		#chart-x {
			height: 490px;
		}
	}
</style>
