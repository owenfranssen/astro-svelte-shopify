import {writable} from 'svelte/store';
import {postToShopify} from './utils/postToShopify';

export const collectionDetails = writable([]);

export const getCollectionDetails = async (handle) => {
	try {
		const shopifyResponse = await postToShopify({
			query: `
				query GetCollection($handle: String!) {
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
							url
							src
						}
					}
				}
      `,
			variables: {
				handle: handle,
			},
		});

		collectionDetails.set(shopifyResponse.collectionByHandle);
		return shopifyResponse.collectionByHandle;
	} catch (error) {
		console.log(error);
	}
};
