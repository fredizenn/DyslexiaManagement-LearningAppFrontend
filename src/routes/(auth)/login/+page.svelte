<script lang="ts">
	import loginBackDrop from '$lib/assets/images/lgb.jpg';
	import Form from '$lib/components/forms/form.svelte';
	import TextField from '$lib/components/forms/textField.svelte';
	import ActionButton from '$lib/components/ui/actionButton.svelte';
	import Modal from '$lib/components/ui/modal.svelte';
	import { Avatar } from 'flowbite-svelte';
	import * as z from 'zod';
	import client from '../../../client';
	import { successToast } from '$lib/utils';
	import toast, { Toaster } from 'svelte-french-toast';
	import { fontSize, initUser, storeTokens } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { signUp } from '$svc/auth';
	import Icon from '@iconify/svelte';

	let showLoginModal = false;
	let loading = false;
	let showSignUpModal = false;
	let signUpLoading = false;
	let passwordType = 'password';
	let confirmPasswordType = 'password';
	const schema = z.object({
		// firstName: z.string().min(1, 'Required'),
		// lastName: z.string().min(1, 'Required'),
		username: z.string().min(1, 'Required'),
		password: z.string().min(1, 'Required')
		// email: z.string().email(),
		// roleId: z.number({ invalid_type_error: 'Required', required_error: 'Required' })
	});

	const signUpSchema = z
		.object({
			password: z.string().min(8, 'Password must be at least 8 characters long'),
			confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters long'),
			username: z.string().min(1, 'Required'),
			firstName: z.string().min(1, 'Required'),
			lastName: z.string().min(1, 'Required'),
			email: z.string().email('Invalid email address').min(1, 'Required')
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: 'Passwords do not match',
			path: ['confirmPassword'] // The error will be applied to confirmPassword
		});

	// const buttons = [
	//     {
	//         text: 'Proceed',
	//         disabled: false,
	//     }
	// ]

	const submit = async ({ detail }: any) => {
		try {
			loading = true;
			const { values } = detail;
			const res = await client.post('/token/', {
				username: values.username,
				password: values.password
			});

			if (res.data.success) {
				storeTokens(res.data.data.token, res.data.data.refresh_token);
				const profile = await client.get('/profile/');
				if (profile.data.success) {
					successToast(res.data.message);
					initUser(
						res.data.data.token,
						res.data.data.refresh_token,
						JSON.stringify(profile.data.data.profile)
					);
					fontSize.set(profile.data.data.profile.preferred_font_size);
					showLoginModal = false;
					loading = false;
					goto('/private/dashboard');
				} else {
					toast.error(profile.data.message);
					loading = false;
					return;
				}
			} else {
				toast.error(res.data.message);
				loading = false;
			}
		} catch (error: any) {
			toast.error(error.message);
			loading = false;
		}
	};

	const submitSignUp = async ({ detail }: any) => {
		try {
			signUpLoading = true;
			const { values } = detail;
			const data = {
				first_name: values.firstName,
				last_name: values.lastName,
				email: values.email,
				username: values.username,
				password: values.password
			};
			const res: any = await signUp(data);
            console.log({res})
			if (res.success) {
                signUpLoading = false
                showSignUpModal = false
				toast.success('Registered successfully. Log in with your credentials');
			} else {
                signUpLoading = false
				toast.error(res.response.data ? res.response.data.email[0] || res.response.data.username[0] : "An error occurred");
			}
		} catch (e: any) {
            signUpLoading = false;
			toast.error(e.message);
		}
	};

	function togglePassword() {
		if (passwordType === 'password') {
			passwordType = 'text';
		} else {
			passwordType = 'password';
		}
	}

	function toggleConfirmPassword() {
		if (confirmPasswordType === 'password') {
			confirmPasswordType = 'text';
		} else {
			confirmPasswordType = 'password';
		}
	}
</script>

<Toaster />

<div class="grid h-full grid-cols-4 gap-0 overflow-hidden">
	<div class="col-span-3 h-full w-full">
		<img src={loginBackDrop} alt="login backdrop" class="object-cover" />
	</div>
	<div class="flex h-full w-full flex-col items-center space-y-10 bg-slate-100 py-16">
		<div class="text-sm font-medium">Dyslexia Management Learning App</div>
		<div class="text-sm font-medium">Login</div>
		<!-- <div class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100"> -->
		<Avatar border size="lg" />
		<!-- </div> -->
		<div class="text-xs font-medium text-gray-500">Welcome!</div>

		<div class="w-full">
			<ActionButton
				otherClasses="py-2 mx-auto align-middle w-2/3"
				label="Login"
				onClick={() => (showLoginModal = true)}
			/>
		</div>
		<button
			on:click={() => (showSignUpModal = true)}
			class="text-center text-xs font-medium text-blue-600"
		>
			New here? Sign Up
		</button>
	</div>
</div>

{#if showLoginModal}
	<Modal
		size="xs"
		title="User Login"
		open={showLoginModal}
		on:close={() => (showLoginModal = false)}
	>
		<div class="">
			<Form {schema} on:submit={submit}>
				<div class="flex flex-col space-y-6">
					<TextField name="username" required label="Username" />
					<TextField name="password" required label="Password" type="password" />
					<ActionButton
						disabled={loading}
						type="submit"
						label={loading ? 'Logging in...' : 'Login'}
						otherClasses="p-2 w-full mx-auto align-middle"
					/>
				</div>
			</Form>
		</div>
	</Modal>
{/if}

{#if showSignUpModal}
	<Modal
		size="xs"
		title="Sign Up"
		open={showSignUpModal}
		on:close={() => (showSignUpModal = false)}
	>
		<div class="">
			<div class="font-gray-500 py-2 text-center text-sm">
				Welcome! Enter to your details to sign up.
			</div>

			<Form schema={signUpSchema} on:submit={submitSignUp}>
				<div class="flex flex-col space-y-6">
					<TextField name="firstName" required label="First Name" />
					<TextField name="lastName" required label="Last Name" />
					<TextField name="username" required label="Username" />
                    <TextField name="email" required label="Email" />
					<div class="relative flex flex-col">
						<TextField name="password" required label="Password" type={passwordType} />
						<button type="button" on:click={togglePassword} class="absolute right-2 top-10">
							{#if passwordType === 'password'}
								<Icon icon="fluent:eye-20-filled" class="h-5 w-5 cursor-pointer" />
							{:else}
								<Icon icon="fluent:eye-off-20-filled" class="h-5 w-5 cursor-pointer" />
							{/if}
						</button>
					</div>

					<div class="relative flex flex-col">
						<TextField
							name="confirmPassword"
							required
							label="Confirm Password"
							type={confirmPasswordType}
						/>
						<button type="button" on:click={toggleConfirmPassword} class="absolute right-2 top-10">
							{#if passwordType === 'password'}
								<Icon icon="fluent:eye-20-filled" class="h-5 w-5 cursor-pointer" />
							{:else}
								<Icon icon="fluent:eye-off-20-filled" class="h-5 w-5 cursor-pointer" />
							{/if}
						</button>
					</div>
					<ActionButton
						disabled={signUpLoading}
						type="submit"
						label={signUpLoading ? 'Please wait...' : 'Sign Up'}
						otherClasses="p-2 w-full mx-auto align-middle"
					/>
				</div>
			</Form>
		</div>
	</Modal>
{/if}
