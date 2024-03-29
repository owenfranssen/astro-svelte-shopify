import {postToShopify, postToShopifyStorefrontAPI} from './postToShopify';

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
													image {
														url
														altText
													}
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
			return await shopifyResponse;
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
								checkoutUrl
                lines(first: 10) {
                  edges {
                    node {
                      id
											quantity
                      merchandise {
                        ... on ProductVariant {
                          id
													title
													image {
														url
														altText
													}
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
			return await shopifyResponse;
		} catch (error) {
			console.log('createCartWithItem error: ', error);
		}
	},

	getCheckoutUrl: async function (cartId) {
		try {
			const query = `
					query checkoutURL($cartId: ID!) {
						cart(id: $cartId) {
							checkoutUrl
						}
					}
				`;
			const shopifyResponse = await postToShopifyStorefrontAPI({
				query: query,
				variables: {
					cartId,
				},
			});
			return shopifyResponse.cart.checkoutUrl ?? '';
		} catch (error) {
			console.log('getCheckoutUrl() error: ', error);
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
													image {
														url
														altText
													}
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

	updateItemInCart: async function ({cartId, itemId, quantity}) {
		try {
			const shopifyResponse = await postToShopify({
				query: `
					mutation updateItemInCart($cartId: ID!, $lines: [CartLineUpdateInput!]!){
						cartLinesUpdate(
							cartId: $cartId,
							lines: $lines,
						) {
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
												}
											}
										}
									}
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
					cartId,
					lines: [
						{
							id: itemId,
							quantity,
						},
					],
				},
			});
			return await shopifyResponse;
		} catch (error) {
			console.log('updateItemInCart error: ', error);
		}
	},
};

export default Cart;
