/**
 * Product form actions
 *
 * - Variant selection
 *     - Update prices
 *     - Update avialability
 *     - update images
 * - Add to cart
 *     - https://shopify.dev/api/examples/cart
 */
import Theme from './theme-settings.js';

if (!Theme.hasOwnProperty('jsProductForm')) {
	Theme.jsProductForm = {
		init() {
			const forms = document.querySelectorAll('[data-product-form]');
			if (forms != null) {
				this.listen();

				document
					.querySelectorAll(
						'[data-product-option]:checked, select[data-product-option]'
					)
					.forEach((option) =>
						option.dispatchEvent(new Event('change', {bubbles: true}))
					);
			}
		},

		listen() {
			document.addEventListener('submit', (event) => {
				if (event.target.matches('[data-product-form]')) {
					this.addToCart(event);
				}
			});

			document.addEventListener('change', (event) => {
				if (
					event.target.matches(
						'[data-product-form] [data-product-option]:checked, [data-product-form] select[data-product-option]'
					)
				) {
					this.changeVariant(event);
				}
				if (event.target.matches('[data-quantity-input]')) {
					this.changeQuantity(event);
				}
			});
		},

		async addToCart(event) {
			event.preventDefault();
			this.form = event.target;
			const button = this.form.querySelector('[data-add-to-cart]');

			if (button.disabled) return;

			this.setErrorMessage();
			this.toggleAddtocart(true);

			// TODO: add micro-interactions

			if (this.form !== null) {
				const id = this.form.querySelector('select[name="id"]').value,
					qty = this.form.querySelector('select[name="quantity"]').value;

				const addToCartResponse = await fetch('/api/add-to-cart', {
					method: 'POST',
					body: JSON.stringify({
						cartId: localStorage.getItem('cartId'),
						itemId: id,
						quantity: qty,
					}),
				});
				const data = await addToCartResponse.json();

				localStorage.setItem('cartId', data.id);
				localStorage.setItem('cart', JSON.stringify(data));
				location.reload();
			}
		},

		changeQuantity(event) {
			console.log('Product Form: change quantity');
			this.form = event.target.closest('[data-product-form]');
			this.getForm().querySelector('[name="quantity"]').value =
				event.target.value;
		},

		changeVariant(event) {
			console.log('changeVariant()');
			this.element = event.target;
			this.getForm();
			this.getSelection();
			this.updateMasterId();
			// this.updateURL();
			this.updateProductData();
			//this.updateMedia();

			if (!this.currentVariant) {
				this.toggleAddtocart(
					true,
					Theme.Settings.locale.product_form.unavailable
				);
				this.toggleQuantitySelector(true);
			} else {
				this.toggleAddtocart(
					!this.currentVariant.node.availableForSale,
					!this.currentVariant.node.availableForSale
						? Theme.Settings.locale.product_form.sold_out
						: null
				);
				this.toggleQuantitySelector(!this.currentVariant.node.availableForSale);
				this.updateVariantInput();
			}
		},

		getForm() {
			return (this.form =
				this.form || this.element.closest('[data-product-form]'));
		},

		getSelection() {
			return (this.selection = [
				...this.getForm().querySelectorAll(
					'[data-product-option]:checked, select[data-product-option]'
				),
			].map((option) => {
				return option.value;
			}));
		},

		getVariantData() {
			if (this.variantData) return this.variantData;
			const variantData = JSON.parse(
				document.querySelector(
					`[type="application/json"][data-product-id="${
						this.getForm().dataset.productForm
					}"`
				).textContent
			);
			// const inventoryData = JSON.parse(
			// 	this.getForm()
			// 		.querySelector(
			// 			`[type="application/json"][data-product-stock="${
			// 				this.getForm().dataset.id
			// 			}"`
			// 		)
			// 		.textContent.replace('},]', '}]')
			// );
			for (const index in variantData) {
				variantData[index] = {
					...variantData[index],
					// ...inventoryData[index],
				};
			}
			return (this.variantData = variantData);
		},

		formatMoney(amount) {
			return new Intl.NumberFormat('en-IE', {
				style: 'currency',
				currency: 'EUR',
			}).format(amount);
		},

		setErrorMessage(message = false) {
			this.errorMessage =
				this.errorMessage ||
				this.getForm().querySelector('[data-product-form-error]');
			if (this.errorMessage != null) {
				this.errorMessage.toggleAttribute('hidden', !message);
				if (message) {
					this.errorMessage.textContent = message;
				}
			}
		},

		toggleAddtocart(disable = true, text) {
			const addToCart = this.getForm().querySelector('[data-add-to-cart]');
			if (addToCart != null) {
				addToCart.disabled = disable;
				addToCart.setAttribute('aria-disabled', disable);
				addToCart.textContent =
					text ?? Theme.Settings.locale.product_form.add_to_cart;
			}
		},

		toggleQuantitySelector(disable = false) {
			const quantitySelector = this.getForm().querySelector(
				'[data-quantity-select]'
			);
			if (quantitySelector != null) {
				quantitySelector.classList.toggle('enabled', !disable);
				quantitySelector.classList.toggle('disabled', disable);
				quantitySelector.setAttribute('aria-disabled', disable);
				quantitySelector
					.querySelectorAll('[data-quantity-input]')
					.forEach((element) => {
						element.disabled = disable;
						element.dispatchEvent(new Event('change', {bubbles: true}));
					});
			}
		},

		updateMasterId() {
			this.currentVariant = this.getVariantData().find((variant) => {
				const options = variant.node.title.split(' / ');
				return !options
					.map(
						(option, index) =>
							!this.selection[index] || this.selection[index] === option
					)
					.includes(false);
			});
			if (this.currentVariant) {
				console.log('Current variant: ', this.currentVariant);
				const select = this.getForm().querySelector('[name="id"]');
				let x = false;
				Array.from(select.options).some((option) => {
					if ((x = option.value == this.currentVariant.node.id)) {
						select.value = option.value;
					}
					return x;
				});
			}
		},

		updatePrice(productId) {
			console.log('updatePrice()');
			const currentVariant = this.currentVariant;
			console.log(currentVariant);
			Array.from(
				document.querySelectorAll(`[data-product-price="${productId}"]`)
			).forEach((element) => {
				console.log(element);
				const compare_at = currentVariant.node.compareAtPriceV2?.amount ?? 0,
					price = currentVariant.node.priceV2.amount,
					onSale = compare_at > price;
				element.querySelector('[data-current-price]').textContent =
					this.formatMoney(price);
				element
					.querySelector('[data-current-price]')
					.classList.toggle('price--on-sale', onSale);
				element
					.querySelector('[data-compare-price]')
					.classList.toggle('hidden', !onSale);
				if (onSale) {
					element.querySelector('[data-compare-price]').textContent =
						this.formatMoney(compare_at);
				}
			});
		},

		updateProductData() {
			const productId = this.getForm().dataset.productForm;
			if (!this.currentVariant) {
				[
					...document.querySelectorAll(`[data-product-price="${productId}"]`),
				].forEach(
					(element) =>
						(element.querySelector('[data-price-current]').textContent = '')
				);
				[
					...document.querySelectorAll(
						`[data-product-status="${productId}"] span`
					),
				].forEach(
					(element) =>
						(element.textContent =
							Theme.Settings.locale.product_form.unavailable)
				);
				[
					...document.querySelectorAll(`[data-product-sku="${productId}"]`),
				].forEach((element) => (element.textContent = ''));
				this.updateQuantity(productId, true);
			} else {
				this.updatePrice(productId);
				this.updateStockMessage(productId);
				this.updateQuantity(productId);
			}
		},

		updateQuantity(productId, disabled = false) {
			console.log('updateQuantity()');
			const quantityInput = this.getForm().querySelector(
				`[data-quantity-select] [data-quantity-input]`
			);
			quantityInput.disabled = disabled;
			if (!disabled) {
				const max = this.currentVariant.node.quantityAvailable ?? 0;
				quantityInput.setAttribute('max', max);
				if (max < 1) {
					quantityInput.disabled = true;
					this.toggleAddtocart(
						true,
						Theme.Settings.locale.product_form.sold_out
					);
				}
				quantityInput.dispatchEvent(new Event('change', {bubbles: true}));
			}
		},

		updateStockMessage(productId) {
			console.log('updateStockMessage()');
			const currentVariant = this.currentVariant;
			[
				...document.querySelectorAll(
					`[data-product-status="${productId}"] span`
				),
			].forEach((element) => {
				element.textContent = currentVariant.available
					? Theme.Settings.locale.product_form.available
					: Theme.Settings.locale.product_form.sold_out;
				element.classList.toggle('product__in-stock', currentVariant.available);
				element.classList.toggle(
					'product__not-available',
					!currentVariant.available
				);
			});
		},

		updateURL() {
			// if (!this.currentVariant) return;
			// console.log(this.currentVariant);
			// window.history.replaceState(
			// 	{},
			// 	'',
			// 	`${this.getForm().dataset.productUrl}?variant=${this.currentVariant.node.title}`
			// );
		},

		updateVariantInput() {
			const quantityInput = this.form.querySelector('[data-variant-selected]');
			quantityInput.value = this.currentVariant.node.title;
			quantityInput.dispatchEvent(new Event('change', {bubbles: true}));
		},
	};
}
