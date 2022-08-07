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
import Cart from '../../routes/api/cart.js';

if (!Theme.hasOwnProperty('jsProductForm')) {
	Theme.jsProductForm = {
		init() {
			console.log('initialising Product Forms');
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
			console.log('Product Form: event listeners');
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
				console.log('Product Form: add to cart xhr request');
				const formData = new URLSearchParams(new FormData(this.form)),
					self = this;

				const addToCart = await Cart.addItem({id, qty});

				/*
          const addToCart = async () => {
            // add selected product to cart
            try {
              const addToCartResponse = await fetch('/api/add-to-cart', {
                method: 'POST',
                body: JSON.stringify({
                  cartId: localStorage.getItem('cartId'),
                  itemId: selectedProduct,
                  quantity: quantity
                })
              });
              const data = await addToCartResponse.json();

              // save new cart to localStorage
              localStorage.setItem('cartId', data.id);
              localStorage.setItem('cart', JSON.stringify(data));
              location.reload();

            } catch (e) {
              console.log(e);
            }
          };
        */

				fetch(Theme.Routes.cart_add, {
					// TODO: replace route
					method: 'POST',
					body: formData,
				})
					.then(() => {
						//Theme.jsCartCounter.update(); // TODO: Add Theme.jsCartCounter
						//Theme.jsAjaxCart.onCartChange(); // TODO: Add Theme.jsAjaxCart
						//Theme.jsAjaxCart.openCart();
					})
					.catch((error) => console.error(error))
					.finally(() => self.toggleAddtocart(false));
				// add any animations or class changes for completion. re-enable button if disabled.
				return false;
			}
		},

		changeQuantity(event) {
			console.log('Product Form: change quantity');
			this.form = event.target.closest('[data-product-form]');
			this.getForm().querySelector('[name="quantity"]').value =
				event.target.value;
		},

		changeVariant(event) {
			console.log('Product Form: change variant');
			this.element = event.target;
			this.getForm();
			this.getSelection();
			this.updateMasterId();
			this.updateURL();
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
					!this.currentVariant.available,
					!this.currentVariant.available
						? Theme.Settings.locale.product_form.sold_out
						: null
				);
				this.toggleQuantitySelector(!this.currentVariant.available);
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
				return !variant.options
					.map((option, index) => {
						return this.selection[index] === option;
					})
					.includes(false);
			});
			if (this.currentVariant) {
				this.getForm().querySelector('[name="id"]').value =
					this.currentVariant.id;
			}
		},

		updatePrice(productId) {
			const currentVariant = this.currentVariant;
			[
				...document.querySelectorAll(`[data-product-price="${productId}"]`),
			].forEach((element) => {
				const onSale = currentVariant.compare_at_price > currentVariant.price;
				element.querySelector('[data-price-current]').textContent =
					Shopify.formatMoney(currentVariant.price);
				element
					.querySelector('.price')
					.classList.toggle('price--on-sale', onSale);
				element
					.querySelector('.price__was-price')
					.classList.toggle('hidden', !onSale);
				if (onSale) {
					element.querySelector('[data-price-compare]').textContent =
						Shopify.formatMoney(currentVariant.compare_at_price);
				}
			});
		},

		updateProductData() {
			const productId = this.getForm().dataset.productId;
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
			const quantityInput = this.getForm().querySelector(
				`[data-quantity-select] [data-quantity-input]`
			);
			quantityInput.disabled = disabled;
			if (!disabled) {
				const max = this.currentVariant.inventory_quantity ?? 0;
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
			if (!this.currentVariant) return;
			window.history.replaceState(
				{},
				'',
				`${this.getForm().dataset.productUrl}?variant=${this.currentVariant.id}`
			);
		},

		updateVariantInput() {
			const quantityInput = this.form.querySelector('[data-variant-selected]');
			quantityInput.value = this.currentVariant.id;
			quantityInput.dispatchEvent(new Event('change', {bubbles: true}));
		},
	};
}
