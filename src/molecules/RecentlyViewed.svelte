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

onMount( () => {
	if(!$recentlyViewedItems.includes(productHandle)) {
		let tempArray = Array.from($recentlyViewedItems);
		tempArray.unshift(productHandle);
		recentlyViewedItems.set(tempArray);
	} else {
		console.log('already in list');
	}

	items = $recentlyViewedItems.map( item => {
		console.log({item});
		/* Fetch product data by handle */
		return item
	});

	console.log(items);
});

// window.addEventListener('load', () => {
// 	const handle = document.querySelector('main').dataset.productHandle;
// 	Theme.jsRecentlyViewed.addItem(handle);
// });
</script>
<!--
{/* TODO: Hydrate this section */}
-->
{#each items as item}
	abc {item}
	<ProductCard product={item} />
	{item.handle}
{/each}
