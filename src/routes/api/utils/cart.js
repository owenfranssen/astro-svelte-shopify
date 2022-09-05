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
		console.log('CreatCartWithItem(): ', itemId, quantity);
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
			console.log(await shopifyResponse);
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
