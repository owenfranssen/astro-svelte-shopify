import { writable } from "svelte/store";
import { postToShopify } from "./src/routes/api/utils/postToShopify";

export const productDetails = writable([]);

export const getProductDetails = async (handle) => {
  try {
    const shopifyResponse = await postToShopify({
      query: `
        query getProduct($handle: String!) {
          product(handle: $handle) {
            id
            handle
            description
            title
            totalInventory
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  quantityAvailable
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 20) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
          }
        }
      `,
      variables: {
        handle: handle,
      },
    });

    productDetails.set(shopifyResponse.productByHandle);
    return shopifyResponse.productByHandle;
  } catch (error) {
    console.log(error);
  }
};
