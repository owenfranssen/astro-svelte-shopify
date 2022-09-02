<script>
	import {cartItems} from '../assets/scripts/stores.js';

  const getCheckoutLink = async () => {
    try {
      const getCheckoutResponse = await fetch('/api/get-checkout-link', {
        method: 'POST',
        body: JSON.stringify({
          cartId: localStorage.getItem('cartId')
        }
        ),
      });
       console.log('X: ', await getCheckoutResponse); // Todo: getting 404 return? check shopify storefront api call
    //   const data = await getCheckoutResponse.json();
    // console.log('in...')
    //   console.log('Y: ', data);
    //   return data;
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
