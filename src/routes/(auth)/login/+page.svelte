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
	import toast, { Toaster} from 'svelte-french-toast';
	import { initUser, storeTokens } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

    let showLoginModal = false;
    let loading = false;
    const schema = z.object({
		// firstName: z.string().min(1, 'Required'),
		// lastName: z.string().min(1, 'Required'),
		username: z.string().min(1, 'Required'),
		password: z.string().min(1, 'Required'),
		// email: z.string().email(),
		// roleId: z.number({ invalid_type_error: 'Required', required_error: 'Required' })
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
            })

            if (res.data.success) {
                storeTokens(res.data.data.token, res.data.data.refresh_token);
                const profile = await client.get('/profile/')
                if (profile.data.success) {
                    successToast(res.data.message);
                    initUser(res.data.data.token, res.data.data.refresh_token, JSON.stringify(profile.data.data.profile))
                    showLoginModal = false
                    loading = false
                    goto('/private/dashboard')
                } else {

                    toast.error(profile.data.message);
                    loading = false;
                }
            } else {
                toast.error(res.data.message);
                loading = false;
            }   
        } catch (error: any) {
            toast.error(error);
            loading = false;
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
		<div class="text-xs font-medium text-gray-500">
			Welcome!

			
		</div>

        <div class="w-full">
            <ActionButton otherClasses="py-2 mx-auto align-middle w-2/3" label="Login" onClick={() => showLoginModal = true} />
        </div>
	</div>
</div>

{#if showLoginModal}
    <Modal size="xs" title="User Login" open={showLoginModal} on:close={() => showLoginModal = false}>
        <div class="">
           <Form {schema} on:submit={submit}>
            <div class="flex flex-col space-y-6">
                <TextField name="username" required label="Username" />
                <TextField name="password" required label="Password" type="password" />
                <ActionButton disabled={loading}  type="submit" label={loading ? 'Logging in...' : 'Login'} otherClasses="mx-auto align-middle" />
            </div>
            </Form>
        </div>
    </Modal>
{/if}


