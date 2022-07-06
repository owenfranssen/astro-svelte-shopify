import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const collectionDetails = writable([]);

export const getProductsInCollection = async (handle) => {
	console.log({handle});
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `{
				query GetProductsInCollection($handle: String!) {
          collectionByHandle(handle: $handle) {
            id
            handle
            title
            description
            descriptionHtml
            productsCount
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
      }
	  `,
		});
    console.log(shopifyResponse);
		collectionDetails.set(shopifyResponse.collectionByHandle);
		return shopifyResponse.collectionByHandle;
	} catch (error) {
		console.log(error);
	}
};
