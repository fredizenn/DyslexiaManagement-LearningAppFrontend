import clsx, { type ClassValue } from 'clsx';
import toast from 'svelte-french-toast';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function successToast(message: string) {
	return toast.success(message, {
		style: 'border: 1px solid #0053B1FF; padding: 16px; color: #0053B1FF;',
		iconTheme: {
			primary: '#0053B1FF',
			secondary: '#FFFAEE'
		}
	});
}
