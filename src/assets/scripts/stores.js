import {writable} from 'svelte/store';

function createCount() {
	const {subscribe, set, update} = writable(0);
	return {
		subscribe,
		increment: (i = 1) => update((n) => n + i),
		decrement: (i = 1) => update((n) => n - i),
		reset: () => set(0),
		set: (i) => set(i),
	};
}

export const count = createCount();
