<script>
	import {checkoutLink} from '../assets/scripts/stores.js';
</script>

<a href={$checkoutLink} class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>

<!-- getCheckoutLink returns a promise and doesnt appear to update even though the console logs the correct URL... -->
