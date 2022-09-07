import Cart from '../../routes/api/utils/cart.js';

export async function post({params, request}) {
	const data = await request.json();
	let {cartId, itemId, quantity, update} = data;
	quantity = parseInt(quantity);

	if (cartId) {
		const options = {
			cartId,
			itemId,
			quantity,
		};
		const shopifyResponse = await Cart.addItemToCart(options);
		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cartLinesAdd.cart),
		};
	} else {
		// Init new cart
		const shopifyResponse = await Cart.createCartWithItem(itemId, quantity);
		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cartCreate.cart),
		};
	}
}
