import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const collectionDetails = writable([]);

export const getProductsInCollection = async (handle, filters = []) => {
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `
        query Collection($handle: String, $filters: ) {
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
            products(first: 10, filters: $filters) {
              edges {
                node {
                  id
                  handle
                  description
                  title
                  totalInventory
                  productType
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
        filters
			},
		});
		collectionDetails.set(shopifyResponse.collection);
		return shopifyResponse.collection;
	} catch (error) {
		console.log('getProductsInCollection error: ', error);
	}
};
