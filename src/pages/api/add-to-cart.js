import Cart from '../../routes/api/utils/cart.js';

export async function post({params, request}) {
	const data = await request.json();
	let {cartId, itemId, quantity} = data;
	quantity = parseInt(quantity);

	if (cartId) {
		console.log('--------------------------------');
		console.log('Adding to existing cart...');
		console.log('--------------------------------');
		const shopifyResponse = await Cart.addItemToCart({
			cartId,
			itemId,
			quantity,
		});

		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cartLinesAdd.cart),
		};
	} else {
		console.log('--------------------------------');
		console.log('Creating new cart with item...');
		console.log('--------------------------------');
		const shopifyResponse = await Cart.createCartWithItem(itemId, quantity);
		return {
			statusCode: 200,
			body: JSON.stringify(shopifyResponse.cartCreate.cart),
		};
	}
}
