import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const collectionDetails = writable([]);

export const getProductsInCollection = async (handle) => {
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `
        query Collection($handle: String) {
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
            products(sortKey: TITLE, first: 10) {
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
        }
      `,
			variables: {
				handle,
			},
		});
		collectionDetails.set(shopifyResponse.collection);
		return shopifyResponse.collection;
	} catch (error) {
		console.log('getProductsInCollection error: ', error);
	}
};
