import Cart from '../../routes/api/utils/cart.js';

export async function post({params, request}) {
	const data = await request.json();
	let {cartId} = data;

	if (cartId) {
		const shopifyResponse = await Cart.getCheckoutUrl(cartId);

		console.log('Get Checkout Response: ', shopifyResponse.cart);
		const response = {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cart),
		};
		return response;
	} else {
		return '#';
	}
}
