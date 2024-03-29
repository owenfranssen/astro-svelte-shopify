import {writable} from 'svelte/store';

/**
 * Cart
 */
export const cartItems = writable(
	JSON.parse(localStorage.getItem('cart'))?.lines.edges ?? []
);

/**
 * Get checkout url
 */
function createCheckoutLink() {
	const {subscribe, set, update} = writable('#');
	return {
		subscribe,
		set: (url) => update((old) => url),
	};
}
export const checkoutLink = createCheckoutLink();

/**
 * Product form error message
 */
export const formError = writable('');

/**
 * Product form selected variant
 */
export const selectedVariant = writable({});

/**
 * Toast notifications
 * https://svelte.dev/repl/0091c8b604b74ed88bb7b6d174504f50?version=3.35.0
 */
export const toasts = writable([]);

export const addToast = (toast) => {
	// Create a unique ID so we can easily find/remove it
	// if it is dismissible/has a timeout.
	const id = Math.floor(Math.random() * 10000);

	// Setup some sensible defaults for a toast.
	const defaults = {
		id,
		type: 'info',
		dismissible: true,
		timeout: 3000,
	};

	// Push the toast to the top of the list of toasts
	toasts.update((all) => [{...defaults, ...toast}, ...all]);

	// If toast is dismissible, dismiss it after "timeout" amount of time.
	if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

export const dismissToast = (id) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

/**
 * Recent items
 */
function createRecentlyViewedItems() {
	const {subscribe, set} = writable(JSON.parse(localStorage.getItem('recentlyViewedItems')) ?? []);
	return {
		subscribe,
		set: (obj) => {
			localStorage.setItem('recentlyViewedItems', JSON.stringify(obj));
			set(obj);
		},
	};
}
export const recentlyViewedItems = createRecentlyViewedItems();
