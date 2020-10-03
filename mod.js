'use strict';

// Makes a request to the youtube api
async function makeRequest(endpoint, apiKey) {
	return await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}&key=${apiKey}`)
	.then((res) => res.json());
}

/**
 * @param {string} videoId The videos ID or the entire URL
 * @param {string} apiKey A google api key with access to youtube v3
 * @returns {Generator} A generator that returns the liveStreamChat when iterated over
 */
export default async function* getChat(videoId, apiKey) {
	// Aborts if arguments are invalid
	if (typeof videoId !== 'string') throw new Error("Argument 'videoId' must be a string");
	if (typeof apiKey !== 'string') throw new Error("Argument 'apiKey' must be a string");

	// Converts URL to videoID
	videoId = videoId.replace('https://www.youtube.com/watch?v=', '');

	// Gets liveChatId from videoId
	const streamInfo = await makeRequest(`videos?part=liveStreamingDetails&id=${videoId}`, apiKey);
	if (!streamInfo.items[0]) throw new Error("Unable to find livestream");
	const chatID = streamInfo.items[0].liveStreamingDetails.activeLiveChatId;

	// Aditional query parameter to only request new messages
	let page = '';

	// Gets chat messages repeatedly
	while (1) {
		// Yields for every new chat message
		const time = Date.now();
		const res = await makeRequest(`liveChat/messages?part=snippet,authorDetails&liveChatId=${chatID}${page}`, apiKey);
		page = `&pageToken=${res.nextPageToken}`;
		for (const item of res.items) {
			yield item;
		};

		// Waits remaining pollinginterval before making another request
		await new Promise((resolve) => setTimeout(resolve, res.pollingIntervalMillis - Date.now() + time));
	}
}
