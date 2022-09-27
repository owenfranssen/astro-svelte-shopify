<script>
import {onMount} from 'svelte';
import Theme from '../../assets/scripts/theme-settings.js';
import {selectedVariant} from '../../assets/scripts/stores.js';

$: $selectedVariant, update();

export let inStock = false;

const update = () => {
	// get variant data using $selectedVariant gid
	// set inStock = selectedVariant.availableForSale
}
</script>

<div class="mt-6 flex items-center">
	{#key inStock}
		{#if inStock}
			<svg class="flex-shrink-0 w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
			</svg>
			<p class="ml-2 text-sm text-gray-500">{Theme.Settings.locale.product.available}</p>
		{:else}
			<svg class="flex-shrink-0 w-5 h-5 text-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
			<p class="ml-2 text-sm text-gray-500">{Theme.Settings.locale.product.sold_out}</p>
		{/if}
	{/key}
</div>