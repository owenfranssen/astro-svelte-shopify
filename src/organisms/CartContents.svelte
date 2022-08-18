<script>
	import {onMount} from 'svelte';
	import {count} from '../assets/scripts/stores.js';

	let items = [];
	onMount(() => {
		const cart = JSON.parse(localStorage.getItem('cart'));
		items = cart.lines.edges;

		// TODO: remove console.log
		console.log(items);
	});

	const itemTotal = (price, quantity) => {
		const totalPrice = Number(price) * Number(quantity);
		return totalPrice.toFixed(2);
	}

	const removeItem = async (lineId) => {
		const removeItemFromCart = await fetch('/api/remove-from-cart', {
			method: 'POST',
			body: JSON.stringify({
				cartId: localStorage.getItem('cartId'),
				lineId
			})
		})
			.then((res) => res.json())
			.then((data) => data);

		localStorage.setItem('cartId', removeItemFromCart.id);
		localStorage.setItem('cart', JSON.stringify(removeItemFromCart));
		count.decrement(1); // TODO: should be quantity of removed items, min 1
		/*location.reload();*/
	}
</script>

<div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
	<div class="flow-root">
		{#if items.length > 0}
			<ul role="list" class="-my-6 divide-y divide-gray-200">
				{#each items as { node: item } }
					{#if item.quantity > 0}
						<li class="flex py-6">
							<div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
								<img src="https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg" alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." class="h-full w-full object-cover object-center">
							</div>

							<div class="ml-4 flex flex-1 flex-col">
								<div>
									<div class="flex justify-between text-base font-medium text-gray-900">
										<h3>
											<a href="#"> {item.merchandise.product.title} </a>
										</h3>
										<p class="ml-4">
											{item.merchandise.priceV2.currencyCode}
											{itemTotal(item.merchandise.priceV2.amount, item.quantity)}
										</p>
									</div>
									{#if item.merchandise.title != item.merchandise.product.title}
										<p class="mt-1 text-sm text-gray-500">{item.merchandise.title}</p>
									{/if}
								</div>
								<div class="flex flex-1 items-end justify-between text-sm">
									<p class="text-gray-500">Qty {item.quantity}</p>

									<div class="flex">
										<button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" on:click={removeItem}>Remove</button>
									</div>
								</div>
							</div>
						</li>
					{/if}
				{/each}
			</ul>
		{:else}
			<section class="-my-6 divide-y divide-gray-200">
				<p class="cart-page-message">Your cart is empty, fill it up!</p>
				<a href="/" class="cart-page-button is-dark"> Back to Products </a>
			</section>
		{/if}
	</div>
</div>

<div class="border-t border-gray-200 pt-6 px-4 sm:px-6">
	<div class="flex justify-between text-base font-medium text-gray-900">
		<p>Subtotal</p>
		<p>$262.00</p>
	</div>
</div>