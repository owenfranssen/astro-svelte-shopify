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

if (!Theme.hasOwnProperty('jsCartDrawer')) {
	('use strict');

	Theme.jscartDrawer = {
		init() {
			console.log('Cart drawer: initialising');
		},
	};
}
