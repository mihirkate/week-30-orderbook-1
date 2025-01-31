import { Hono } from 'hono';

const app = new Hono();

app.get('/*', async (c) => {
	const url = new URL(c.req.url);
	const path = url.pathname.replace('/api/v1', ''); // Extract path after /api/v1
	const queryString = url.searchParams.toString();

	// Correct the target URL to the external API
	const targetUrl = `https://api.backpack.exchange/api/v1${path}?${queryString}`;
	console.log(`Target URL: ${targetUrl}`); // Log the target URL for debugging

	try {
		const response = await fetch(targetUrl, {
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			console.error(`API request failed with status: ${response.status}`); // Log error status
			return c.json(
				{ error: `API request failed with status: ${response.status}` },
				response.status // No need to cast
			);
		}

		const data = await response.json();

		return c.json(data, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	} catch (error) {
		console.error(`Fetch error: ${error}`); // Log the error
		return c.json(
			{ error: 'Failed to fetch data from external API' },
			500 // No need to cast here; 500 is a valid status code
		);
	}
});

export default app;