/**
 * Cart drawer - mini cart
 *
 * Functions to control contents,
 * manipulate item quantity,
 * fetch estimated price
 * and get checkout link
 *
 * Reference: https://shopify.dev/api/examples/cart
 */
import Theme from './theme-settings.js';

if (!Object.prototype.hasOwnProperty.call(Theme, 'jsCartDrawer')) {
	('use strict');

	Theme.jsCartDrawer = {
		init() {
			console.log('Cart drawer: initialising');
		},

		async getCheckoutLink() {
			try {
				const shopifyResponse = fetch('/api/get-checkout-link', {
					method: 'POST',
					body: JSON.stringify({
						cartId: localStorage.getItem('cartId'),
					}),
				}).then((response) => response.text());
				let url = await shopifyResponse;
				return url;
			} catch (error) {
				this.setErrorMessage(error);
				console.error('getCheckoutLink: ', error);
				return '#';
			}
		},
	};
}
