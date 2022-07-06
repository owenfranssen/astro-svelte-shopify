import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const productDetails = writable([]);

export const getProductDetails = async (handle) => {
	try {
		const shopifyResponse = await postToShopify({
			query: `
				query GetProduct($handle: String!) {
					productByHandle(handle: $handle) {
						handle
						description
						descriptionHtml
						title
						seo {
							description
							title
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
						images(first:10) {
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
						variants(first: 10) {
							edges {
								node {
									title
									quantityAvailable
									priceV2 {
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
		console.log(error);
	}
};
