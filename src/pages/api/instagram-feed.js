export async function post() {
	try {
		const url = `https://graph.instagram.com/me/media?fields=caption,permalink,media_type,media_url,thumbnail_url,username&access_token=${
				import.meta.env.INSTAGRAM_TOKEN
			}`,
			result = await fetch(url).then((response) => response.json());

		return {
			statusCode: 200,
			body: JSON.stringify(result),
		};
	} catch (err) {
		console.error('Error: ', err);
	}
}

export async function get() {
	return {
		statusCode: 200,
		body: '',
	};
}
