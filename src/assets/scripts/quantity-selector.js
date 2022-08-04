/**
 * Product form quantity selector
 *
 */
import Theme from './theme-settings.js';

if (!Theme.hasOwnProperty('jsQuantitySelector')) {
	Theme.jsQuantitySelector = {
		init() {
			this.listen();
			this.updateControlsState();
		},

		listen() {
			console.log('QUantity Selector: event listeners')
			document.addEventListener('click', (event) => {
				if (
					event.target.matches('[data-update-quantity]') ||
					event.target.closest('[data-update-quantity] > *')
				) {
					this.onQuantityControlClick(event);
				}
			});

			['change', 'keyup', 'keydown'].forEach((trigger) =>
				document.addEventListener(trigger, (event) => {
					if (event.target.matches('[data-quantity-input]')) {
						this.updateQuantity(event, event.target.value);
					}
				})
			);
		},

		onQuantityControlClick(event) {
			const control = event.target.matches('[data-update-quantity]')
				? event.target
				: event.target.closest('[data-update-quantity]');
			if (control.disabled) return;

			const quantitySelect = event.target.closest('[data-quantity-select]'),
				input = quantitySelect.querySelector('[data-quantity-input]'),
				value = parseInt(input.value);

			if (control.dataset.updateQuantity === 'plus') input.value = value + 1;
			else input.value = value - 1;
			input.dispatchEvent(new Event('change', {bubbles: true}));
		},

		updateControlsState() {
			[...document.querySelectorAll('[data-quantity-select]')].forEach(
				(quantitySelect) => {
					const input = quantitySelect.querySelector('[data-quantity-input]'),
						ctrlMinus = quantitySelect.querySelector(
							'[data-update-quantity="minus"]'
						),
						ctrlPlus = quantitySelect.querySelector(
							'[data-update-quantity="plus"]'
						);

					let value = parseInt(input.value),
						maxQty = 100000000000000000;
					if (input.getAttribute('max') != null) {
						maxQty = input.getAttribute('max');
						if (parseInt(input.getAttribute('max')) < 1) {
							maxQty = 1;
						}
					}
					if (quantitySelect.classList.contains('disabled')) {
						ctrlMinus.disabled = true;
						ctrlPlus.disabled = true;
					} else {
						ctrlMinus.disabled = value == 1;
						ctrlPlus.disabled = value == maxQty;
					}
				}
			);
		},

		updateQuantity(event) {
			console.log('Quantity Selector: update quantity');
			const quantitySelect = event.target.closest('[data-quantity-select]'),
				input = quantitySelect.querySelector('[data-quantity-input]'),
				value = parseInt(input.value),
				minQty = input.getAttribute('min') || 0;
			let maxQty = input.getAttribute('max') ?? 100000000000000000;
			if (maxQty < 1) maxQty = 1;

			if (isNaN(value) || value < minQty) {
				input.value = minQty;
			} else if (value > maxQty) {
				input.value = maxQty;
			}

			this.updateControlsState();
		},
	};
}
