<script>
	import {formError} from '../assets/scripts/stores.js';

	$: console.log($formError);
</script>

<p class="text-sm mt-2 text-center text-red" data-product-form-error>{$formError}</p>