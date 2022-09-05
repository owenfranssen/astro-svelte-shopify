<script>
	import {cartItems} from '../assets/scripts/stores.js';

  const getCheckoutLink = async () => {
    try {
      const shopifyResponse = fetch('/api/get-checkout-link', {
        method: 'POST',
        body: JSON.stringify({
          cartId: localStorage.getItem('cartId')
        }),
      })
			.then( response => response.text());
			// .then( response => response )
			// .catch( error => console.error('getCheckoutLink() error: ', error));
console.log('A: ', await shopifyResponse);
			let x = await shopifyResponse;
			x= JSON.parse(x);
			// const x = JSON.parse(shopifyResponse);
			// console.log('B: ', x);
			return x.checkoutUrl;

    } catch (error) {
      this.setErrorMessage(error);
      console.error('getCheckoutLink: ', error);
      return '#';
    }
  }
</script>

{#key cartItems}
<a href={getCheckoutLink()} class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
{/key}

<!-- getCheckoutLink returns a promise and doesnt appear to update even though the console logs the correct URL... -->