export const postToShopify = async ({ query, variables }) => {
	try {
		// @ts-ignore
		const result = await fetch(import.meta.env.API_ENDPOINT, { // endpoint is not complete....
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Storefront-Access-Token': import.meta.env.API_TOKEN
			},
			body: JSON.stringify({ query, variables })
		}).then((res) => res.json());

		if (result.errors) {
			console.log({ errors: result.errors });
		} else if (!result || !result.data) {
			console.log({ result });
			return 'No results found.';
		}

		return result.data;
	} catch (error) {
		console.log(error);
	}
};
