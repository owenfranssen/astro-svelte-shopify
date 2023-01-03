/**
 * Product form actions
 *
 * - Variant selection
 *     - Update prices
 *     - Update availability
 *     - Update images
 * - Add to cart
 *     - https://shopify.dev/api/examples/cart
 */

/* FIX: If one option combo is out of stock, all options are disabled */
/* TODO: set quantity selector state on first page load */
/* TODO: Update images */
import Theme from './theme-settings.js';
import {
	cartItems,
	addToast,
	checkoutLink,
	formError,
	selectedVariant,
} from './stores.js';

if (!Object.prototype.hasOwnProperty.call(Theme, 'jsProductForm')) {
	Theme.jsProductForm = {
		init() {
			this.addToCartStart = new Event('e__cart_add_start');
			this.addToCartSuccess = new Event('e__cart_add_success');
			this.addToCartFailed = new Event('e__cart_add_fail');
			const forms = document.querySelectorAll('[data-product-form]');
			if (forms != null) {
				this.listen();

				Array.from(forms).forEach((form) => this.setInitialSelection(form));
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

			button.dispatchEvent(this.addToCartStart);

			// TODO: add micro-interactions to add to cart button

			if (this.form !== null) {
				let id =
						this.form.querySelector('select[name="id"]').value ||
						this.form.querySelector('select[name="id"]').dataset
							.variantSelected,
					qty = parseInt(
						this.form.querySelector('select[name="quantity"]').value
					),
					update = false;

				this.setErrorMessage('');

				try {
					const addToCartResponse = await fetch('/api/add-to-cart', {
						method: 'POST',
						body: JSON.stringify({
							cartId: localStorage.getItem('cartId'),
							itemId: id,
							quantity: qty,
							update: update,
						}),
					});
					const data = await addToCartResponse.json();
					if (!localStorage.getItem('cartId')) {
						localStorage.setItem('cartId', data.id);
						localStorage.setItem('checkoutUrl', data.checkoutUrl);
						checkoutLink.set(data.checkoutUrl);
					}
					const oldCart = localStorage.getItem('cart');
					if (oldCart == JSON.stringify(data)) {
						this.setErrorMessage(
							'All available items are in your shopping bag'
						);
						button.dispatchEvent(this.addToCartFailed);
					} else {
						localStorage.setItem('cart', JSON.stringify(data));
						cartItems.set(data.lines.edges);
						button.dispatchEvent(this.addToCartSuccess);
						addToast({message: 'Added to cart', type: 'cart', timeout: 3000});
					}
					this.toggleAddtocart(false);
				} catch (error) {
					this.setErrorMessage(error);
					console.error('addToCart: ', error);
					checkoutLink.set('#');
					button.dispatchEvent(this.addToCartFail);
				}
			}
			return false;
		},

		changeQuantity(event) {
			this.form = event.target.closest('[data-product-form]');
			this.getForm().querySelector('[name="quantity"]').value =
				event.target.value;
		},

		changeVariant(event) {
			this.element = event.target;
			this.getForm();
			this.getSelection();
			this.updateMasterId();
			this.updateProductData();
			this.updateVariantOptions(
				event.target.closest('fieldset').dataset.optionIndex
			);
			// TODO: this.updateURL();
			// TODO: this.updateMedia();

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
			for (const index in variantData) {
				variantData[index] = {
					...variantData[index]
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
				if (message !== false) {
					formError.set(message);
				}
			}
		},

		setInitialSelection(form) {
			// TODO: Check logic - some page loads disabled add to cart...
			if (form) {
				const masterSelect = form.querySelector('[name="id"]');
				if (masterSelect.options.length > 0) {
					masterSelect.options[masterSelect.selectedIndex].textContent
						.split('-')[0]
						.split('/')
						.map((value) => value.trim())
						.forEach((option, index) => {
							const input = form.querySelector(
								`fieldset[data-option-index="${index}"] input[value="${option}"]`
							);
							if (input) {
								input.checked = true;
							}
						});
					selectedVariant.set(masterSelect.value);
				} else {
					this.toggleAddtocart(true, '', form);
				}
			}
		},

		toggleAddtocart(disable = true, text, form) {
			const addToCart = (form || this.getForm()).querySelector(
				'[data-add-to-cart]'
			);
			if (addToCart != null) {
				addToCart.disabled = disable;
				addToCart.setAttribute('aria-disabled', disable);
				if (text)
					addToCart.querySelector('.default').textContent =
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
				const masterSelect = this.getForm().querySelector('[name="id"]');
				const validOptions = Array.from(masterSelect.options).filter(
					(option) => {
						const searchString = option.textContent
							.split('-')[0]
							.split('/')
							.map((value) => value.trim())
							.join(' / ');
						return searchString == this.currentVariant.node.title;
					}
				);
				if (validOptions.length) {
					masterSelect.value = validOptions[0].value;
					masterSelect.dataset.variantSelected = validOptions[0].value;
					selectedVariant.set(masterSelect.value);
				}
			}
		},

		updatePrice(productId) {
			const currentVariant = this.currentVariant;
			Array.from(
				document.querySelectorAll(`[data-product-price="${productId}"]`)
			).forEach((element) => {
				const compare_at = currentVariant.node?.compareAtPriceV2?.amount ?? 0,
					price = currentVariant.node?.priceV2.amount ?? 0,
					onSale = compare_at > price;
				const domCurrentPrice = element.querySelector('[data-current-price]'),
					domComparePrice = element.querySelector('[data-compare-price]');
				if (domCurrentPrice) {
					domCurrentPrice.textContent = this.formatMoney(price);
					domCurrentPrice.classList.toggle('price--on-sale', onSale);
				}
				if (domComparePrice) {
					domComparePrice.classList.toggle('hidden', !onSale);
					if (onSale) {
						domComparePrice.textContent = this.formatMoney(compare_at);
					}
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
						(element.querySelector('[data-current-price]').textContent = '') // errors if only 1 option...
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
				this.updateQuantity(true);
			} else {
				this.updatePrice(productId);
				this.updateStockMessage(productId);
				this.updateQuantity();
			}
		},

		updateQuantity(disabled = false) {
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

		updateVariantOptions(optionIndex) {
			const selected = this.getForm().querySelector(
				`fieldset[data-option-index="${optionIndex}"] [data-product-option]:checked, select[data-product-option="${optionIndex}"]`
			).value;

			let searchString = Array();
			searchString[optionIndex] = selected;

			const validMasterOptions = Array.from(
				this.getForm().querySelector('select[name="id"]').options
			).filter((option) => option.textContent.includes(selected));

			const options = Array.from(
				this.getForm().querySelectorAll(
					`fieldset[data-option-index]:not([data-option-index="${optionIndex}"]) [data-product-option], select[data-option-index]:not([data-product-option="${optionIndex}"]) option`
				)
			);

			for (let option of options) {
				const index = option.closest('[data-option-index]').dataset.optionIndex;
				searchString[index] = option.value;
				option.disabled = !validMasterOptions.some((masterOption) =>
					masterOption.textContent.includes(searchString.join(' / '))
				);

				if (option.disabled) {
					option.checked = false;
					option.selected = false;
				}
			}
		},

		updateVariantInput() {
			const quantityInput = this.form.querySelector('[data-variant-selected]');
			quantityInput.value = this.currentVariant.node.title;
			quantityInput.dispatchEvent(new Event('change', {bubbles: true}));
		},
	};
}
