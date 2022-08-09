import Cart from '../../routes/api/utils/cart.js';

export async function post(request) {
	const {cartId, lineId} = JSON.parse(request.body);

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
