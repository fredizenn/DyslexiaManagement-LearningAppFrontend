import { goto } from "$app/navigation";
import { writable } from "svelte/store";

export const isAuthenticated = writable(false);
export async function storeTokens(token: string, refreshToken: string) {
    localStorage.setItem('t', token);
    localStorage.setItem('r_t', refreshToken);
}

export function getUser(): boolean {
	let token;
	if (typeof window !== 'undefined') token = localStorage.getItem('t');
    isAuthenticated.set(!!token);
	return !!token;
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
// export function init