import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const products = writable([]);

export const getProducts = async () => {
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `{
	     products(sortKey: TITLE, first: 100) {
	      edges {
	        node {
	          id
	          handle
	          description
	          title
	          totalInventory
	          productType
	          variants(first: 5) {
	            edges {
	              node {
	                id
	                title
	                quantityAvailable
	                price
	              }
	            }
	          }
	          priceRange {
	            maxVariantPrice {
	              amount
	              currencyCode
	            }
	            minVariantPrice {
	              amount
	              currencyCode
	            }
	          }
	          images(first: 1) {
	            edges {
	              node {
	                src
	                altText
	              }
	            }
	          }
	        }
	      }
	    }
    }
	  `,
		});
		products.set(shopifyResponse.products.edges);
		return shopifyResponse;
	} catch (error) {
		console.log(error);
	}
};
