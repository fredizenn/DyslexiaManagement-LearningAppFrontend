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

export function convertToBinary(value: string) {
	const binaryData = atob(value);

	const byteArray = new Uint8Array(binaryData.length);
	for (let i = 0; i < binaryData.length; i++) {
		byteArray[i] = binaryData.charCodeAt(i);
	}

	// Create a Blob from the Uint8Array
	const blob = new Blob([byteArray], { type: 'image/jpeg' });
	return blob;
}

export function base64ToImage(base64String: string, fileName: string, imageAlt?: string) {
	const blob = new Blob(
		[
			new Uint8Array(
				atob(base64String)
					.split('')
					.map((char) => char.charCodeAt(0))
			)
		],
		{ type: 'image/jpeg' }
	);
	const url = URL.createObjectURL(blob);
	const img = document.createElement('img');
	img.src = url;
	const output = img.src;
	img.alt = imageAlt ?? fileName;
	imageAlt = img.alt;

	return {
		output,
		img,
		fileName,
		imageAlt
	};
}