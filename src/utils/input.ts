export function debounce<T extends (...args: any[]) => void>(func: T, delay = 300) {
	let timer: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timer) clearTimeout(timer);

		timer = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

export function throttle<T extends (...args: any[]) => void>(func: T, delay = 300) {
	let lastCall = 0;

	return (...args: Parameters<T>) => {
		const now = Date.now();

		if (now - lastCall >= delay) {
			lastCall = now;
			func(...args);
		}
	};
}
