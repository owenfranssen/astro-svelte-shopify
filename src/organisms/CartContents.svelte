<script>
	import {cartItems} from '../assets/scripts/stores.js';
  import {productUrl} from '../routes/api/utils/makeUrl.js';

	const cartTotal = (items, code='EUR') => {
		let totalPrice = 0;
		items.forEach(i => totalPrice += i.node.merchandise.priceV2.amount * i.node.quantity);
		return formatMoney(totalPrice, code);
	}

	const itemTotal = (price, quantity, code) => {
		const totalPrice = Number(price) * Number(quantity);
		return formatMoney(totalPrice, code);
	}

	const formatMoney = (amount, code) => {
		return new Intl.NumberFormat('en-IE', { style: 'currency', currency: code }).format(amount);
	}

	const removeItem = async (event) => {
		const removeItemFromCart = await fetch('/api/remove-from-cart', {
			method: 'POST',
			body: JSON.stringify({
				cartId: localStorage.getItem('cartId'),
				lineId: event.target.dataset.lineId
			})
		})
			.then((res) => res.json());

		localStorage.setItem('cartId', removeItemFromCart.id);
		localStorage.setItem('cart', JSON.stringify(removeItemFromCart));
    cartItems.set(removeItemFromCart.lines.edges);
	}
</script>

<div class="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
	<div class="flow-root">
    {#if $cartItems.length > 0}
      <ul role="list" class="-my-6 divide-y divide-gray-200">
        {#each $cartItems as { node: item } }
          {#if item.quantity > 0}
            <li class="flex py-6">
              <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img src="https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg" alt="Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt." class="h-full w-full object-cover object-center">
              </div>

              <div class="ml-4 flex flex-1 flex-col">
                <div>
                  <div class="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <a href={productUrl(item.merchandise.product.handle)}> {item.merchandise.product.title} </a>
                    </h3>
                    <p class="ml-4">
                      {itemTotal(item.merchandise.priceV2.amount, item.quantity, item.merchandise.priceV2.currencyCode)}
                    </p>
                  </div>
                  {#if item.merchandise.title != item.merchandise.product.title}
                    <p class="mt-1 text-sm text-gray-500">{item.merchandise.title}</p>
                  {/if}
                </div>
                <div class="flex flex-1 items-end justify-between text-sm">
                  <p class="text-gray-500">Qty {item.quantity}</p>

                  <div class="flex">
                    <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" data-line-id={item.id} on:click={removeItem}>Remove</button>
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
		<p>{cartTotal($cartItems)}</p>
	</div>
</div>
