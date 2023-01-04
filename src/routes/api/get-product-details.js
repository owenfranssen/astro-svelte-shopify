import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const productDetails = writable([]);

export const getProductDetails = async (handle) => {
	try {
		const shopifyResponse = await postToShopify({
			query: `
				query GetProduct($handle: String!) {
					productByHandle(handle: $handle) {
						id
						handle
						description
						descriptionHtml
						title
						seo {
							description
							title
						}
            metafield(key: "featured_products", namespace: "custom") {
              namespace
              key
            }
            collections (first: 5) {
              edges {
                node {
                  handle
                }
              }
            }
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
						tags
						availableForSale
						featuredImage {
							src
							transformedSrc
							id
							width
							height
						}
						images(first:20) {
							edges {
								node {
									id
									src
									url
									altText
									width
									height
								}
							}
						}
            options {
              id
              name
              values
            }
						totalInventory
						variants(first: 100) {
							edges {
								node {
									id
									availableForSale
									title
									quantityAvailable
									priceV2 {
										amount
										currencyCode
									},
									compareAtPriceV2 {
										amount
										currencyCode
									}
								}
							}
						}
					}
				}
      `,
			variables: {
				handle: handle,
			},
		});

		productDetails.set(shopifyResponse.productByHandle);
		return shopifyResponse.productByHandle;
	} catch (error) {
		console.log('getProductDetails: ', error);
	}
};
