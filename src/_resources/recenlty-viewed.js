export default () => {
	/*============================================================================
    Recently viewed - From Flex theme
  ==============================================================================*/

	const recentlyViewed = {
		init: function () {
			var productHandle, rvCookie, rvProducts, displayProducts, rvProductArray;

			if ($('.js-product_section[data-rv-handle]').length) {
				productHandle = $('.js-product_section').data('rv-handle').toString();
				rvCookie = Cookies.get('sf9__recentlyViewed');
				rvProducts = recentlyViewed.getCookieProducts(rvCookie, productHandle);
			} else if ($('.recently-viewed__section').length) {
				rvCookie = Cookies.get('sf9__recentlyViewed');
				rvProducts = recentlyViewed.getCookieProducts(rvCookie, productHandle);
			} else if ($('.js-sidebar-recently-viewed').length) {
				rvCookie = Cookies.get('sf9__recentlyViewed');
				rvProducts = recentlyViewed.getCookieProducts(rvCookie, productHandle);
			}

			if (rvProducts) {
				rvProductArray = unescape(rvProducts).split(',');
			}

			if (productHandle) {
				if (!$.inArray(productHandle, rvProductArray) !== -1) {
					displayProducts = [];
					rvProductArray.unshift(productHandle);
					$.each(rvProductArray, function (i, el) {
						if ($.inArray(el, displayProducts) === -1) displayProducts.push(el);
					});
				}

				recentlyViewed.setCookieProducts(displayProducts);
			} else {
				displayProducts = rvProductArray;
			}

			if ($('.recently-viewed__section').length) {
				var parent = '.recently-viewed__section';
				var recentlyViewedProductsLoaded = $(parent).data(
					'recently-viewed-items-loaded'
				);

				if (recentlyViewedProductsLoaded) {
					return false;
				}

				recentlyViewed.getProductInformation(
					parent,
					displayProducts,
					productHandle
				);
			} else if ($('.js-recently-viewed .rv-main').length) {
				var parent = '.js-recently-viewed';
				var recentlyViewedProductsLoaded = $(parent).data(
					'recently-viewed-items-loaded'
				);

				if (recentlyViewedProductsLoaded) {
					return false;
				}

				recentlyViewed.getProductInformation(
					parent,
					displayProducts,
					productHandle
				);
			}

			if ($('.sidebar .js-sidebar-recently-viewed').length) {
				var parent = '.sidebar .js-sidebar-recently-viewed';
				var recentlyViewedProductsLoaded = $(parent).data(
					'recently-viewed-items-loaded'
				);
				if (recentlyViewedProductsLoaded) {
					return false;
				}

				if (productHandle) {
					recentlyViewed.getProductInformation(
						parent,
						displayProducts,
						productHandle
					);
				} else {
					recentlyViewed.getProductInformation(parent, displayProducts);
				}
			}
		},
		getCookieProducts: function (rvCookie, productHandle) {
			if (!rvCookie && productHandle) {
				Cookies.set('sf9__recentlyViewed', productHandle, {
					expires: 30,
					path: '/',
				});
				rvCookie = Cookies.get('sf9__recentlyViewed');
			} else {
				rvCookie = Cookies.get('sf9__recentlyViewed');
			}

			return rvCookie;
		},
		setCookieProducts: function (rvProductArray) {
			Cookies.set('sf9__recentlyViewed', escape(rvProductArray.join(',')), {
				expires: 30,
				path: '/',
			});
		},
		getProductInformation: function (parent, displayProducts, productHandle) {
			// Add data-attribute 'recently-viewed-items-loaded="true" to parent container
			$(parent).attr('data-recently-viewed-items-loaded', 'true');

			if (productHandle) {
				displayProducts.splice($.inArray(productHandle, displayProducts), 1);
			}

			var productLimit = $(parent).data('visible-products');

			if (productLimit && displayProducts) {
				displayProducts = displayProducts.slice(0, productLimit);
			}

			$.each(displayProducts, function (index, value) {
				if (value) {
					$(parent).removeClass('hidden');

					$(parent).parents('.sidebar-block').show();

					$.ajax({
						type: 'GET',
						url: '/products/' + value + '?view=rv',
						success: function (data) {
							var rvProduct = $(data).find('.js-recently-viewed-product');
							rvProduct.removeClass('js-recently-viewed-product');
							$(parent)
								.find(' .rv-box-' + index)
								.append(rvProduct);

							if (Currency.show_multiple_currencies) {
								currencyConverter.convertCurrencies();
							}

							// Initialize show secondary media on hover feature
							if (Shopify.theme_settings.collection_secondary_image) {
								imageFunctions.showSecondaryImage();
							}

							var $video = rvProduct.find(
								'[data-html5-video] video, [data-youtube-video]'
							);
							if ($video.length > 0) {
								videoFeature.setupPlayerForRecentlyViewedProducts(
									rvProduct.find(
										'[data-html5-video] video, [data-youtube-video]'
									)
								);
							}
						},
						error: function (x, t, m) {
							console.log(x);
							console.log(t);
							console.log(m);
						},
						dataType: 'html',
					});
				}

				if ($(parent).find('.rv-main').hasClass('js-rv-slider')) {
					if (displayProducts.length <= productLimit) {
						$('.js-rv-slider .gallery-cell')
							.eq(displayProducts.length)
							.nextAll()
							.addBack()
							.remove();
					} else {
						$('.js-rv-slider .gallery-cell')
							.eq(productLimit)
							.nextAll()
							.addBack()
							.remove();
					}
					recentlyViewed.createSlider(parent, productLimit);
				} else if ($(parent).find('.rv-main').hasClass('js-rv-grid')) {
					if (displayProducts.length <= productLimit) {
						$('.js-rv-grid .thumbnail')
							.eq(displayProducts.length)
							.nextAll()
							.addBack()
							.remove();
					} else {
						$('.js-rv-grid .thumbnail')
							.eq(productLimit)
							.nextAll()
							.addBack()
							.remove();
					}
				}
			});
		},

		createSlider: function (el, productsAvailable) {
			var products_per_slide = $('.js-rv-slider').data('products-per-slide');
			var products_generated = $('.js-rv-slider').find('.gallery-cell').length;
			var products_available = $('.js-rv-slider').data('products-available');
			var prevNextButtons = products_generated / products_per_slide > 1;
			var initialIndex;
			var cellAlign = 'left';
			var wrapAround = true;

			var arrowShape =
				'M95,48H9.83L41,16.86A2,2,0,0,0,38.14,14L3.59,48.58a1.79,1.79,0,0,0-.25.31,1.19,1.19,0,0,0-.09.15l-.1.2-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31L38.14,86A2,2,0,0,0,41,86a2,2,0,0,0,0-2.83L9.83,52H95a2,2,0,0,0,0-4Z';

			if (products_per_slide >= products_generated) {
				cellAlign = 'center';
				wrapAround = false;
				prevNextButtons = false;
			}

			if (
				(products_per_slide == '2' &&
					products_available > products_per_slide) ||
				(products_per_slide == '4' &&
					products_available > products_per_slide) ||
				(products_per_slide == '6' && products_available > products_per_slide)
			) {
				initialIndex = 0;
			} else if (products_per_slide == '3' && products_available) {
				initialIndex = 1;
			} else if (products_per_slide == '5' && products_available) {
				initialIndex = 2;
			} else if (products_per_slide == '7' && products_available) {
				initialIndex = 3;
			}

			$('.js-rv-slider').flickity({
				lazyLoad: 2,
				imagesLoaded: true,
				adaptiveHeight: true,
				prevNextButtons: prevNextButtons,
				wrapAround: wrapAround,
				cellAlign: cellAlign,
				cellSelector: '.gallery-cell',
				pageDots: $('.js-rv-slider').data('use-page-dots'),
				freeScroll: true,
				arrowShape: arrowShape,
				initialIndex: initialIndex,
				groupCells: products_per_slide,
				setGallerySize: false,
			});

			// wrapAround: true,
			// adaptiveHeight: true,
			// dragThreshold: 10,
			// imagesLoaded: true,
			// pageDots: false,
			// prevNextButtons: $productGallery.data('media-count') > 1 || $slides.length > 1 ? true : false,
			// autoPlay: slideshowSpeed * 1000,
			// fade: slideshowTransition === 'fade' ? true : false,
			// watchCSS: this.template === 'image-scroll' && !$productGallery.hasClass('js-gallery-modal') ? true : false,
			// // Disables Flickity for main product gallery on image-scroll template
			// arrowShape: arrowShape

			$('.js-rv-slider').addClass('slider-initialized');
		},
	};

	recentlyViewed.init();
};
