import {postToShopify} from './postToShopify';

const Cart = {
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

	createCartWithItem: async function (itemId, quantity) {
		try {
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
			return shopifyResponse;
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

	getCheckoutUrl: async function ({cartId}) {
		try {
			const shopifyResponse = await postToShopify({
				query: `
					query checkoutURL(cartId: $cartId) {
						cart(id: $cartId) {
							checkoutUrl
						}
					}
				`,
				variables: {
					cartId,
				},
			});
			return shopifyResponse;
		} catch (error) {
			console.log('removeItemFromCart: ', error);
		}
	},

	removeItemFromCart: async function ({cartId, lineId}) {
		try {
			const shopifyResponse = await postToShopify({
				query: `
					mutation removeItemFromCart($cartId: ID!, $lineIds: [ID!]!) {
						cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
					lineIds: [lineId],
				},
			});

			return shopifyResponse;
		} catch (error) {
			console.log('removeItemFromCart: ', error);
		}
	},
};

export default Cart;
