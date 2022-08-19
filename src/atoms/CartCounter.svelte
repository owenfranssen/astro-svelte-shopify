<script>
	import {onMount} from 'svelte';
	import {cartItems} from '../assets/scripts/stores.js';

  onMount(() => {
    if(!$cartItems) {
      const data = localStorage.getItem('cart');
      if(data) {
        cartItems.set(JSON.parse(data).lines.edges);
      }
    }
  })
</script>

<span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800" data-cart-count>{$cartItems.length ?? 0}</span>
