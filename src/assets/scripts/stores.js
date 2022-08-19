import {writable} from 'svelte/store';

function createCartItems() {
	const {subscribe, set, update} = writable(0);
	return {
		subscribe,
		set: (items) => update(old => items),
	};
}
export const cartItems = createCartItems();
