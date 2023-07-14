import {writable} from 'svelte/store';
import json from '../../data/collections.json';

export const collectionDetails = writable([]);

export const getCollectionDetails = (handle) => {
	try {
		const collections = json.collections;
		for (const collection of collections) {
			if (collection.handle == handle) {
				return collection;
			}
		}

		return false;
	} catch (error) {
		console.log('getCollectionDetails: ', error);
	}
};
