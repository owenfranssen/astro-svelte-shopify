import {getProductDetails} from '../../routes/api/get-product-details.js';

export async function post({params, request}) {
	const data = await request.json();
	let {product} = data;


	const shopifyResponse = await getProductDetails(product);
	return {
		statusCode: 200,
		body: JSON.stringify(shopifyResponse),
	};
}

export async function get() {
	return {
		statusCode: 200,
		body: '',
	};
}
