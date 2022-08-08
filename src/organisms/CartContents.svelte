<script>
	import Cart from '../routes/api/cart.js';
	import {onMount} from 'svelte';

	let items = [];
	onMount(() => {

	});
</script>

<!-- Svelete cart contents component -->
<div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
	<div class="flow-root">
		<ul role="list" class="-my-6 divide-y divide-gray-200">
			{#each $items as item }
				{#if item.quantity > 0}
					<li class="flex py-6">
						<div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
							<img src="https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg" alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." class="h-full w-full object-cover object-center">
						</div>

						<div class="ml-4 flex flex-1 flex-col">
							<div>
								<div class="flex justify-between text-base font-medium text-gray-900">
									<h3>
										<a href="#"> Throwback Hip Bag </a>
									</h3>
									<p class="ml-4">$90.00</p>
								</div>
								<p class="mt-1 text-sm text-gray-500">Salmon</p>
							</div>
							<div class="flex flex-1 items-end justify-between text-sm">
								<p class="text-gray-500">Qty 1</p>

								<div class="flex">
									<button type="button" class="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
								</div>
							</div>
						</div>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
</div>

<div class="border-t border-gray-200 pt-6 px-4 sm:px-6">
	<div class="flex justify-between text-base font-medium text-gray-900">
		<p>Subtotal</p>
		<p>$262.00</p>
	</div>
</div>