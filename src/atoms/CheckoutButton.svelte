<script>
	import {checkoutLink} from '../assets/scripts/stores.js';
</script>

<a href={`${$checkoutLink.replaceAll('"', '')}`} class="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
