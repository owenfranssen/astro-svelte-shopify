const makeUrl = (type, handle) => `/${type}s/${handle}/`;

export const collectionUrl = (handle) => makeUrl('collection', handle);

export const productUrl = (handle) => makeUrl('product', handle);
