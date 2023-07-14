import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const products = writable([]);

// All products
export const getAllProducts = async () => {
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
            publishedAt
            updatedAt
            createdAt
            availableForSale
	          variants(first: 5) {
	            edges {
	              node {
	                id
	                title
	                quantityAvailable
	                price {
										amount
										currencyCode
									}
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
		console.log('getAllProducts: ', error);
	}
};