import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const collectionDetails = writable([]);

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
		collectionDetails.set(shopifyResponse.collection);
		return shopifyResponse.collection;
	} catch (error) {
		console.log('getProductsInCollection error: ', error);
	}
};
