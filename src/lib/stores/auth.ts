import { goto } from "$app/navigation";
import { P } from "flowbite-svelte";
import { writable } from "svelte/store";

export const isAuthenticated = writable(false);
export const fontSize = writable('10');
export async function storeTokens(token: string, refreshToken: string) {
    localStorage.setItem('t', token);
    localStorage.setItem('r_t', refreshToken);
}

export function getUser(): boolean {
	let token;
	if (typeof window !== 'undefined') token = localStorage.getItem('t');
    if (token) {
        return true
    } else {
        return false
    }
    // isAuthenticated.set(!!token);
	// return !!token;
}

export function getProfile(): any {
    let profile;
    if (typeof window !== 'undefined') profile = localStorage.getItem('p');
    isAuthenticated.set(!!profile);
    return profile;
}

export async function initUser(token: string, refreshToken: string, profile: any) {
    localStorage.setItem('t', token);
    localStorage.setItem('r_t', refreshToken);
    localStorage.setItem('p', profile);
   
    isAuthenticated.set(true);
}

export async function logout() {
    localStorage.removeItem('t');
    localStorage.removeItem('r_t');
    localStorage.removeItem('p');
    goto('/login');
    isAuthenticated.set(false);
}

export async function init() {
	if (typeof window !== 'undefined') {
		const savedToken: any = localStorage.getItem('t');
        const rToken: any = localStorage.getItem('r_t');
		const savedProfile: any = localStorage.getItem('p');
		
		if (savedToken) {
			await initUser(savedToken, rToken, savedProfile);
		} 

        isAuthenticated.set(!!savedToken);
	
	}
}
// export function init