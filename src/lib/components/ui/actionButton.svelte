<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from 'flowbite-svelte';

	export let otherClasses: string = '';
	export let onClick: (_: any) => void = () => {};
	export let type: any = 'button';
	export let disabled: any = false;
	export let label: string;
	export let hasIcon = false;
	export let icon = '';
</script>

<Button
	{type}
	{disabled}
	class="rounded bg-cyan-600 flex items-center py-1 text-[14px] capitalize focus:ring-slate-400 focus:ring-opacity-20 {otherClasses}"
	on:click={onClick}
>
	{#if hasIcon}<Icon {icon} class="mr-1 h-5 w-5" />{/if}
	{label}
</Button>
