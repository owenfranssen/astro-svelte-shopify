/**
 * Product form actions
 *
 * - Variant selection
 *     - Update prices
 *     - Update avialability
 *     - update images
 * - Add to cart
 *     - https://shopify.dev/api/examples/cart
 *
 * TODO: set quantity selector state on first page load
 */
import Theme from './theme-settings.js';
import {cartItems, addToast, checkoutLink} from './stores.js';

if (!Theme.hasOwnProperty('jsProductForm')) {
	Theme.jsProductForm = {
		init() {
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

			// TODO: add micro-interactions

			if (this.form !== null) {
				const id =
						this.form.querySelector('select[name="id"]').value ||
						this.form.querySelector('select[name="id"]').dataset
							.variantSelected,
					qty = parseInt(
						this.form.querySelector('select[name="quantity"]').value
					);

				try {
					const addToCartResponse = await fetch('/api/add-to-cart', {
						method: 'POST',
						body: JSON.stringify({
							cartId: localStorage.getItem('cartId'),
							itemId: id,
							quantity: qty, // TODO: if item already in cart, increase qty
						}),
					});
					const data = await addToCartResponse.json();
					console.log(await data);
					cartItems.set(data.lines.edges);
					localStorage.setItem('cartId', data.id);
					localStorage.setItem('cart', JSON.stringify(data));
					// object doesnt contain checkout url... use getCheckoutUrl() ?
					//checkoutLink.set(data.checkoutUrl);
					//localStorage.setItem('checkoutLink', data.checkoutUrl);
					this.toggleAddtocart(false);
					addToast({message: 'Added to cart', type: 'cart', timeout: 3000}); // addToast({ message, type, dismissible, timeout })
				} catch (error) {
					this.setErrorMessage(error);
					console.error('addToCart: ', error);
					checkoutLink.set('#');
				}

				// TODO:
				// * cart open
				// * cart contents update - setting cartItems should do this?
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
			// this.updateURL();
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

		setInitialSelection(form) {
			if (form) {
				const masterSelect = form.querySelector('[name="id"]');
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
				}
			}
		},

		updatePrice(productId) {
			const currentVariant = this.currentVariant;
			Array.from(
				document.querySelectorAll(`[data-product-price="${productId}"]`)
			).forEach((element) => {
				const compare_at = currentVariant.node.compareAtPriceV2?.amount ?? 0,
					price = currentVariant.node.priceV2.amount,
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

			const optionCount = parseInt(this.getForm().dataset.productOptionCount);

			for (let option of options) {
				const index = option.closest('[data-option-index]').dataset.optionIndex;
				searchString[index] = option.value;
				// if (optionCount > index) {
				//   console.log(option);
				// 	for (let i = index + 1; i < optionCount; i++) {
				//     console.log({i});
				// 		Array.from(`fieldset[data-option-index=${i}]`).forEach((o) => {
				// 			searchString[i] = o.value;
				// 			console.log(searchString);
				// 			option.disabled = !validMasterOptions.some((masterOption) =>
				// 				masterOption.textContent.includes(searchString.join(' / '))
				// 			);
				// 		});
				// 	}
				// } else {
				//	console.log(searchString);
				option.disabled = !validMasterOptions.some((masterOption) =>
					masterOption.textContent.includes(searchString.join(' / '))
				);
				//}
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
