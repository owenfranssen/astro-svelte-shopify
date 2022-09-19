<script>
import { productUrl } from '../routes/api/utils/makeUrl.js';
export let product = {};

const formatMoney = (amount) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

const showTag = ({content, type, cssClass}) => {
	/* ../atoms/Tag.astro */
	const style = `rounded bg-${type || 'blue-700'} text-white p-2 w-fit ${cssClass || ''}`;
	return `<span class="${style}">${content}</span>`;
}

const publishedDate = new Date(product.publishedAt);
let compareDate = new Date();
compareDate.setDate(compareDate.getDate()-21);

/**
 * Markup duplicated in:
 * - ./ProductCardSquare.astro
 * - ../atoms/Price.astro
 * - ../atoms/Image.astro
 * - ../atoms/Tag.astro
 * - ../molecules/products/Tags.astro
 */

console.log(product);
</script>

<div class="group relative">
	<!-- ../atoms/Tags.astro -->
	<div class="absolute -top-3 -right-3 flex flex-col items-end space-y-2">
		{#if product.compareAtPriceRange.minVariantPrice.amount > product.priceRange.minVariantPrice.amount}
			{showTag({content: "Sale", type: "sale"})}
		{/if}

		{#if publishedDate.getTime() > compareDate.getTime()}
			{showTag({content: "New", type: "new"})}
		{/if}

		{ product.tags.filter( tag => tag.startsWith('tag:'))
				.map( tag => {
					const content = tag.split(':');
					return showTag({content: content[1]});
			})
		}
	</div>
	<!-- /Tags -->

	<div class="w-full h-56 bg-gray-200 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 xl:h-80">
		<a href={productUrl(product.handle)}>
			<img src={product.featuredImage?.src} alt={product.featuredImage?.altText} height={product.featuredImage?.height} width={product.featuredImage?.width} class="w-full h-full object-center object-cover">
		</a>
	</div>
	<h3 class="mt-4 text-sm text-gray-700">
		<a href={productUrl(product.handle)}>
			<span class="absolute inset-0"></span>
			{product.title}
		</a>
	</h3>
	<p class="mt-1 text-sm text-gray-500">Natural</p>
	<div class="mt-1 text-sm font-medium text-gray-900">
		<!-- ../atoms/Price.astro -->
		<div class="flex space-x-3" data-product-price={product.id}>
			<p data-current-price>{formatMoney(product.priceRange.minVariantPrice.amount)}</p>
			{#if product.compareAtPriceRange.minVariantPrice.amount > 0}
				<p data-compare-price class="line-through text-gray-400">{formatMoney(product.compareAtPriceRange.minVariantPrice.amount)}</p>
			{/if}
		</div>
		<!-- /Price -->
	</div>
</div>
