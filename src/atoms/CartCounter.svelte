<script>
	import {onMount} from 'svelte';

	let count = 0;
	onMount(() => {
		const cart = JSON.parse(localStorage.getItem('cart'));
		count = cart.lines.edges.length;

		// TODO: remove console.log
		console.log(items);
	});
</script>

<span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800" data-cart-count>{count}</span>
