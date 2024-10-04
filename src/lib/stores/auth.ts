export async function storeTokens(token: string, refreshToken: string) {
    localStorage.setItem('t', token);
    localStorage.setItem('r_t', refreshToken);
}

export function getUser(): boolean {
	let token;
	if (typeof window !== 'undefined') token = localStorage.getItem('t');
	return !!token;
}

export function getProfile(): any {
    let profile;
    if (typeof window !== 'undefined') profile = localStorage.getItem('p');
    return profile;
}

export async function initUser(token: string, refreshToken: string, profile: any) {
    localStorage.setItem('t', token);
    localStorage.setItem('r_t', refreshToken);
    localStorage.setItem('p', profile);
}
// export function init