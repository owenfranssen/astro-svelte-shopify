import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const brands = writable([]);

// Get list of brands in store
export const getBrandsList = async (limit = 10) => {
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `
				query brands($limit: Int!) {
					shop {
						productVendors(first: $limit) {
							edges {
								node
							}
						}
					}
				}
			`,
			variables: {
				limit
			},
			api: 'admin'
		});
		brands.set(shopifyResponse.shop.productVendors.edges);
		return shopifyResponse;
	} catch (error) {
		console.log(error);
	}
};

// Get brand collection
export const getBrandDetails = async (handle) => {
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `
				query getBrand($handle: String!) {
					collectionByHandle(handle: $handle) {
						id,
						handle,
						title,
						description,
						descriptionHtml,
						seo {
							description
							title
						},
						image {
							id
							altText
							src
							url
						}
					}
				}
			`,
			variables: {
				handle
			}
		});
		brands.set(shopifyResponse.collectionByHandle);
		return shopifyResponse;
	} catch (error) {
		console.log(error);
	}
};