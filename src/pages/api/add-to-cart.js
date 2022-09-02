import Cart from '../../routes/api/utils/cart.js';

export async function post({params, request}) {
	const data = await request.json();
	let {cartId, itemId, quantity} = data;
	quantity = parseInt(quantity);

	console.log('Calling add to cart API', data);

	if (cartId) {
		const shopifyResponse = await Cart.addItemToCart({
			cartId,
			itemId,
			quantity,
		});

		console.log('Response: ', shopifyResponse.cartLinesAdd.cart);

		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cartLinesAdd.cart),
		};
	} else {
		const shopifyResponse = await Cart.createCartWithItem(itemId, quantity);
		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cartCreate.cart),
		};
	}
}
