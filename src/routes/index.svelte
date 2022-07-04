<script context="module">
  import { products, getProducts } from '../../store';
  export async function load(ctx) {
      const products = await getProducts();
      console.log(products);

      // products.update((items) => {
			// 	const updated = items.filter((product) => product.node.productType === productType);

			// 	return updated;
			// });

      return { props: { products } };
  }
</script>

<!-- <script>
  export let products;
</script> -->

<svelte:head>
  <title>Home</title>
</svelte:head>

<section>
  Shopify products:
  <h2>
    {#each $products as product}
      <p>{product.node.title} </p>
    {/each}
  </h2>
</section>
