import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const collections = writable([]);

export const getCollections = async () => {
	try {
		// @ts-ignore
		const shopifyResponse = await postToShopify({
			query: `{
				collections(first: 250) {
					edges {
						node {
							id
							title
							handle
							description
							image {
								url
								src
								altText
							}
						}
					}
				}
			}`
		});
		collections.set(shopifyResponse.collections.edges);
		return shopifyResponse.collections.edges;
	} catch (error) {
		console.log('getCollections error: ', error);
	}
};