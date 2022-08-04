import Theme from './theme-settings.js';

if (!Theme.hasOwnProperty('jsCartCounter')) {
	Theme.jsCartCounter = {
		update: () => {
			fetch('/cart.js')
				.then((response) => response.json())
				.then((data) => {
					[...document.querySelectorAll('[data-cart-state]')].forEach(
						(counter) => (counter.dataset.cartState = data.item_count)
					);
					[...document.querySelectorAll('[ data-cart-item-count]')].forEach(
						(counter) => {
							counter.innerText = data.item_count;
							counter.classList.toggle('hidden', !data.item_count);
						}
					);
				});
		},
	};
}
