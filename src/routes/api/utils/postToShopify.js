export const postToShopify = async ({query, variables, api = 'storefront'}) => {
	if (api == 'admin') {
		return postToShopifyAdminAPI({query, variables});
	} else {
		return postToShopifyStorefrontAPI({query, variables});
	}
};

export const postToShopifyStorefrontAPI = async ({query, variables}) => {
	try {
		const url = import.meta.env.API_ENDPOINT;
    console.log({url})
		// @ts-ignore
		const result = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': import.meta.env.API_TOKEN,
			},
			body: JSON.stringify({query, variables}),
		}).then((res) => res.json());

		if (result.errors) {
			console.log({errors: result.errors});
		} else if (!result || !result.data) {
			return 'No results found.';
		}

		return result.data;
	} catch (error) {
		console.log('postToShopifyStorefrontAPI: ', error);
	}
};

export const postToShopifyAdminAPI = async ({query, variables}) => {
	const url = import.meta.env.ADMIN_API_ENDPOINT;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Access-Token': import.meta.env.ADMIN_API_TOKEN,
		},
		body: JSON.stringify({query, variables}),
	};

	try {
		// @ts-ignore
		const result = await fetch(url, options).then((res) => res.json());

		if (result.errors) {
			console.log({errors: result.errors});
		} else if (!result || !result.data) {
			return 'No results found.';
		}

		return result.data;
	} catch (error) {
		console.log('postToShopifyAdminAPI: ', error);
	}
};
