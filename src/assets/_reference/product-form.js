if (typeof Shopify === 'undefined') {
	window.Shopify = {};
}

if (typeof Shopify.theme === 'undefined') {
	window.Shopify.theme = {};
}

if (typeof Shopify.theme.jsProductForm === 'undefined') {
	Shopify.theme.jsProductForm = {
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
					this.onQuantityChange(event);
				}
			});
		},

		addToCart(event) {
			if (Shopify.theme.settings.cart_action == 'ajaxcart') {
				event.preventDefault();
				this.form = event.target;
				const button = this.form.querySelector('[data-add-to-cart]');

				if (button.disabled) return;

				this.setErrorMessage();
				this.toggleAddtocart(true);

				// TODO: add micro-interactions

				if (this.form !== null) {
					const formData = new URLSearchParams(new FormData(this.form)),
						self = this;

					fetch(Shopify.theme.routes.cart_add, {
						method: 'POST',
						body: new URLSearchParams(new FormData(this.form)),
					})
						.then(() => {
							Shopify.theme.jsCartCounter.update();
							Shopify.theme.jsAjaxCart.onCartChange();
							Shopify.theme.jsAjaxCart.openCart();
						})
						.catch((error) => console.error(error))
						.finally(() => self.toggleAddtocart(false));
					// add any animations or class changes for completion. re-enable button if disabled.
					return false;
				}
			}
		},

		changeVariant(event) {
			this.element = event.target;
			this.getForm();
			this.getSelection();
			this.updateMasterId();
			this.updateURL();
			this.updateProductData();
			this.updateMedia();

			if (!this.currentVariant) {
				this.toggleAddtocart(true, Shopify.theme.strings.unavailable);
				this.toggleAdditionalPayment(true);
				this.toggleQuantitySelector(true);
			} else {
				this.toggleAddtocart(
					!this.currentVariant.available,
					!this.currentVariant.available ? Shopify.theme.strings.sold_out : null
				);
				this.toggleQuantitySelector(!this.currentVariant.available);
				this.toggleAdditionalPayment(!this.currentVariant.available);
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
				this.getForm().querySelector(
					`[type="application/json"][data-product-id="${
						this.getForm().dataset.productId
					}"`
				).textContent
			);
			const inventoryData = JSON.parse(
				this.getForm()
					.querySelector(
						`[type="application/json"][data-product-stock="${
							this.getForm().dataset.productId
						}"`
					)
					.textContent.replace('},]', '}]')
			);
			for (const index in variantData) {
				variantData[index] = {
					...variantData[index],
					...inventoryData[index],
				};
			}
			return (this.variantData = variantData);
		},

		onQuantityChange(event) {
			this.form = event.target.closest('[data-product-form]');
			this.getForm().querySelector('[name="quantity"]').value =
				event.target.value;
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

		toggleAdditionalPayment(disable) {},

		toggleAddtocart(disable = true, text) {
			const addToCart = this.getForm().querySelector('[data-add-to-cart]');
			if (addToCart != null) {
				addToCart.classList.toggle('enabled', !disable);
				addToCart.disabled = disable;
				addToCart.setAttribute('aria-disabled', disable);
				addToCart.textContent = text ?? Shopify.theme.strings.add_to_cart;
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

		updateMedia() {
			if (!this.currentVariant) return;
			if (!this.currentVariant.featured_media) return;
			const productId = this.getForm().dataset.productId,
				mediaId = this.currentVariant.featured_media.id,
				mediaGallery = document.querySelector(
					`[data-product-gallery="${productId}"]`
				),
				mediaItem = mediaGallery.querySelector(`[data-media-id="${mediaId}"]`);
			if (mediaItem != null) {
				mediaItem.checked = true;
			} else {
				document.querySelector('[data-media-id]').checked = true;
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
					(element) => (element.textContent = Shopify.theme.strings.unavailable)
				);
				[
					...document.querySelectorAll(`[data-product-sku="${productId}"]`),
				].forEach((element) => (element.textContent = ''));
				this.updateQuantity(productId, true);
			} else {
				this.updatePrice(productId);
				this.updateStockMessage(productId);
				this.updateSku(productId);
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
					this.toggleAddtocart(true, Shopify.theme.strings.sold_out);
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
					? Shopify.theme.strings.available
					: Shopify.theme.strings.sold_out;
				element.classList.toggle('product__in-stock', currentVariant.available);
				element.classList.toggle(
					'product__not-available',
					!currentVariant.available
				);
			});
		},

		updateSku(productId) {
			const currentVariant = this.currentVariant;
			[
				...document.querySelectorAll(`[data-product-sku="${productId}"]`),
			].forEach((element) => (element.textContent = currentVariant.sku));
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
