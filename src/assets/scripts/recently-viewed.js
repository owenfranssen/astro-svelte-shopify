/**
 * Recently viewed products
 *
 * Functions to control logging curent product
 *
 */
import Theme from './theme-settings.js';

if (!Object.prototype.hasOwnProperty.call(Theme, 'jsRecentlyViewed')) {
	('use strict');

	Theme.jsRecentlyViewed = {
		init() {
			console.log('Recently viewed: initialising');
		},

		addItem() {
			/**
			 * Get product handle
			 * get cookie or localstorage
			 * add current product
			 * remove duplicates
			 * return json
			 */
		},

		getItems() {
			/**
			 * get cookie or localstorage
			 * return json
			 */
		},

		removeItem() {
			/**
			 * get cookie or localstorage
			 * remove all occurences of specified item
			 * return json
			 */
		},
	};
}
