<script>
import {onMount} from 'svelte';
import {cartItems, checkoutLink} from '../assets/scripts/stores.js';
import Theme from '../assets/scripts/theme-settings.js';

onMount(async () => {
	if(!$cartItems) {
		const data = localStorage.getItem('cart');
		if(data) {
			cartItems.set(JSON.parse(data).lines.edges);
		}

		const cartId = localStorage.getItem('cartId');
		if(cartId) {
			checkoutLink.set(await Theme.jsCartDrawer.getCheckoutLink());
		}
	}
})

const updateCount = (list) => {
	let qty = 0;
	if (list.length > 0) {
		for (const item of list) {
			qty += item.node.quantity;
		}
	}
	return qty ?? 0;
}

let cartCount = 0;
const unsubscribe = cartItems.subscribe(value => {
	cartCount = updateCount(value);
});
</script>

<span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800" data-cart-count>{cartCount}</span>
