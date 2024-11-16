<script lang="ts">
	import { browser } from '$app/environment';
	import { Avatar, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Form from '$lib/components/forms/form.svelte';
	import TextField from '$lib/components/forms/textField.svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import { z } from 'zod';
	import Loader from '$lib/components/ui/loader.svelte';
	import SelectField from '$lib/components/forms/selectField.svelte';
	import { profileUpdate } from '$svc/auth';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	let loading = false;
	let userConfig: any;
	let initData: any;
	let updating = false;

	let learningStyleOptions = [
		{
			label: 'Visual',
			value: 'visual'
		},
		{
			label: 'Auditory',
			value: 'auditory'
		},
		{
			label: 'Kinesthetic',
			value: 'kinesthetic'
		}
	];

	const update = async ({detail}: any) => {
		try {
			updating = true;
			const { values } = detail;
			const res: any = await profileUpdate({values});
			if (res.status === 200) {
				toast.success('Profile updated');
				userConfig = {
					...userConfig,
					preferred_font_size: values.preferredFontSize,
					learning_style: values.learningStyle
				};
				localStorage.setItem('p', JSON.stringify(userConfig));
				updating = false;
				await goto('/private/profile');
			} else {
				updating = false;
				toast.error(res?.message);
			}
		} catch (e: any) {
			updating = false;
			toast.error(e.message);
		}
	};

	onMount(() => {
		loading = true;
		if (browser) {
			userConfig = JSON.parse(localStorage.getItem('p') || '{}');
		}
		initData = {
			preferredFontSize: userConfig?.preferred_font_size,
			learningStyle: userConfig?.learning_style
		};
		loading = false;
	});

	const schema = z.object({});
</script>

{#if loading}
	<Loader />
{:else}
	<div
		class="mx-auto flex h-full max-w-xl justify-center gap-10 space-x-10 pt-10"
		in:fly={{ x: 300, duration: 500 }}
		out:fly={{ x: -300, duration: 0 }}
	>
		<div class="text-2xl font-extralight">Update your settings</div>
		<div class="w-full">
			<Form {schema} init={initData} on:submit={update}>
				<div class="w-full space-y-4">
					<SelectField
						options={learningStyleOptions}
						name="learningStyle"
						required
						placeholder="Learning style"
					/>
					<TextField
						name="preferredFontSize"
						type="number"
						min={0}
						required
						placeholder="Preferred font size"
					/>
				</div>
				<ActionButton
					disabled={updating}
					type="submit"
					label={updating ? 'Updating...' : 'Update'}
					otherClasses="w-full p-2 mt-4"
				/>
			</Form>
		</div>
	</div>
{/if}
