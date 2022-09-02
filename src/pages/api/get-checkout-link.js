import Cart from '../../routes/api/utils/cart.js';

export async function post({params, request}) {
	const data = await request.json();
	let {cartId} = data;

	if (cartId) {
		const shopifyResponse = await Cart.getCheckoutUrl(cartId);

		console.log('Response: ', shopifyResponse.cart);

		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cart),
		};
	} else {
		return '#';
	}
}
