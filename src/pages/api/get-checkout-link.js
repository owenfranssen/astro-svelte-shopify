import Cart from '../../routes/api/utils/cart.js';

export async function post({params, request}) {
	const data = await request.json();
	let {cartId} = data;
	if (cartId) {
		const shopifyResponse = await Cart.getCheckoutUrl(cartId);

		const response = {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse),
		};
		return response;
	} else {
		return '#';
	}
}
