export const postToShopify = async ({ query, variables }) => {
	try {
		const url = import.meta.env.API_ENDPOINT;
		// @ts-ignore
		const result = await fetch(url, {
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
