import Cart from '../../routes/api/utils/cart.js';

export async function post({params, request}) {
	const data = await request.json();
	const {cartId, lineId} = data;

	try {
		const shopifyResponse = await Cart.removeItemFromCart({
			cartId,
			lineId,
		});
		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cartLinesRemove.cart),
		};
	} catch (error) {
		console.log('remove-from-cart.js: ', error);
	}
}
