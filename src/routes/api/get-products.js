import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const products = writable([]);

// Product in specified collection (by collection handle)
export const getProductsInCollection = async (handle, limit = 10) => {
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `
        query Collection($handle: String!, $limit: Int) {
          collection(handle: $handle) {
            id
            handle
            title
            description
            descriptionHtml
            image {
              id
              url
              altText
              height
              width
            }
            products(sortKey: TITLE, first: $limit) {
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
                  compareAtPriceRange {
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  featuredImage {
                        src
                        altText
                        width
                        height
                  }
                }
              }
            }
          }
        }
      `,
			variables: {
				handle,
        limit
			},
		});
		products.set(shopifyResponse.collection);
		return shopifyResponse.collection;
	} catch (error) {
		console.log('getProductsInCollection error: ', error);
	}
};

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
