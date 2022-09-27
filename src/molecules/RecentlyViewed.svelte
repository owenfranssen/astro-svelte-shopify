<script>
import {onMount} from 'svelte';

import ProductCard from './ProductCardSquare.svelte';
import { recentlyViewedItems } from "../assets/scripts/stores.js";

export let productHandle;
let items = [];
//import '../assets/scripts/recently-viewed.js';
/**
 * TODO:
 * Load products from localstorage recently viewed
 *  - hydrate product cards so updated as vistors navigate
 * Add slideshow/carousel for products > 3
 */

onMount( async () => {
	if(!$recentlyViewedItems.includes(productHandle)) {
		let tempArray = Array.from($recentlyViewedItems);
		tempArray.unshift(productHandle);
		recentlyViewedItems.set(tempArray);
	} else {
		// console.log('The current product is already in the recently viewed list');
	}

	items = await Promise.all( $recentlyViewedItems.map( async (item) => {
    /* Fetch product data by handle */
    const response = await fetch('/api/get-product', {
      method: 'POST',
      body: JSON.stringify({
        product: item,
      }),
    }).then((res) => res.json());
    return await response;
	}) );
});

// window.addEventListener('load', () => {
// 	const handle = document.querySelector('main').dataset.productHandle;
// 	Theme.jsRecentlyViewed.addItem(handle);
// });
</script>

{#each items as item, index}
	<ProductCard product={item} />
{/each}
