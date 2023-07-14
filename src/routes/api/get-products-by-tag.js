import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const products = writable([]);

// Products by specified tag
export const getProductsByTag = async (query, limit = 10, after = null) => {
	try {
		// @ts-ignore
		const graphQL = `query ProductsByTag($query: String!, $limit: Int, $after: String) {
				products(first: $limit, after: $after, query: $query, sortKey: TITLE) {
					edges {
						node {
							id
							handle
							description
							title
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
							tags
						}
					}
				}
			}
		`;
		const shopifyResponse = await postToShopify({
			query: graphQL,
			variables: {
				query,
				limit,
				after,
			},
		});
		products.set(shopifyResponse.products);
		return shopifyResponse.products;
	} catch (error) {
		console.log('getProductsByTag error: ', error);
	}
};
