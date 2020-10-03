'use strict';

const https = require('https');

// Makes a request to the youtube api
async function makeRequest(endpoint, apiKey) {
	return new Promise((resolve) => {
		https.get(`https://www.googleapis.com/youtube/v3/${endpoint}&key=${apiKey}`, (res) => {
			let data = '';
			res.on('data', (chunk) => data += chunk);
			res.on('end', () => resolve(JSON.parse(data)));
		});
	});
}

/**
 * @param {string} videoId The videos ID or the entire URL
 * @param {string} apiKey A google api key with access to youtube v3
 * @returns {Generator} A generator that returns the liveStreamChat when iterated over
 */
async function* getChat(videoId, apiKey) {
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

module.exports = getChat;
