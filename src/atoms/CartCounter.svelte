<script>
	import {onMount, onDestroy} from 'svelte';
	import {count} from '../assets/scripts/stores.js';

	onMount(() => {
		const cart = JSON.parse(localStorage.getItem('cart'));
		let itemCount = 0;
		for(let item of cart.lines.edges) {
			itemCount += item.node.quantity;
		}
		count.set(itemCount);
	});
	/* Help: https://svelte.dev/tutorial/updating-arrays-and-objects */
	/* Help: https://svelte.dev/tutorial/auto-subscriptions */
	/* Help: https://svelte.dev/tutorial/custom-stores */
</script>

<span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800" data-cart-count>{$count}</span>
