import {postToShopify} from './utils/postToShopify';

const Cart = {
	addItem: async function ({itemId, quantity}) {
		// cartid needs to be set/retrieved in/from a cookie/local storage?
		const cartId = localStorage.getItem('cartId');
		quantity = parseInt(quantity);
		if (cartId) {
			console.log('Adding item to an existing cart...');
			const response = await this.addItemToCart({
				cartId,
				itemId,
				quantity,
			});
			return JSON.stringify(response.cartLinesAdd.cart);
		} else {
			console.log('Creating new cart with item...');
			const response = await this.createCartWithItem({
				itemId,
				quantity,
			});
			return JSON.stringify(response.cartCreate.cart);
		}
	},

	addItemToCart: async function ({cartId, itemId, quantity}) {
		try {
			const shopifyResponse = postToShopify({
				query: `
          mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                lines(first: 10) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          priceV2 {
                            amount
                            currencyCode
                          }
                          product {
                            title
                            handle
                          }
                        }
                      }
                    }
                  }
                }
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalTaxAmount {
                    amount
                    currencyCode
                  }
                  totalDutyAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        `,
				variables: {
					cartId,
					lines: [
						{
							merchandiseId: itemId,
							quantity,
						},
					],
				},
			});

			return shopifyResponse;
		} catch (error) {
			console.log('addItemToCart error: ', error);
		}
	},

	createCartWithItem: async function ({itemId, quantity}) {
		try {
			// @ts-ignore
			const shopifyResponse = await postToShopify({
				query: `
          mutation createCart($cartInput: CartInput) {
            cartCreate(input: $cartInput) {
              cart {
                id
                createdAt
                updatedAt
                lines(first: 10) {
                  edges {
                    node {
                      id
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
                attributes {
                  key
                  value
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalTaxAmount {
                    amount
                    currencyCode
                  }
                  totalDutyAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        `,
				variables: {
					cartInput: {
						lines: [
							{
								quantity,
								merchandiseId: itemId,
							},
						],
					},
				},
			});
			console.log(await shopifyResponse);
			return await shopifyResponse.createCart;
		} catch (error) {
			console.log('createCartWithItem error: ', error);
		}
	},

	getContents: function () {
		/*
      query {
        cart(
          id: "gid://shopify/Cart/1"
        ) {
          id
          createdAt
          updatedAt
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
          attributes {
            key
            value
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
          buyerIdentity {
            email
            phone
            customer {
              id
            }
            countryCode
          }
        }
      }

    */
	},

	removeItemFromCart: function () {},
};

export default Cart;
