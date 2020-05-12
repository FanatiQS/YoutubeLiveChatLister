'use strict';

const https = require('https');
const apikey = '';

// Sends a request to googles api
function request(endpoint, callback) {
	https.get("https://www.googleapis.com/youtube/v3/" + endpoint + '&key=' + apikey, (res) => {
		let data = '';
		res.on('data', (chunk) => data += chunk);
		res.on('end', () => callback(JSON.parse(data)));
	});
};

// Continuosly fetches new chat messages
function getChatItems(chatID, callback) {
	const endpoint = 'liveChat/messages?liveChatId=' + chatID + '&part=snippet,authorDetails&pageToken=';
	request(endpoint, loop);

	// Looping requests based on api specified polling interval
	function loop(res) {
		// Loop after interval
		setTimeout(request, res.pollingIntervalMillis, endpoint + res.nextPageToken, loop);

		// Sends messages with author to action
		if (res.items) {
			res.items.forEach((item) => callback(item.snippet.displayMessage, item.authorDetails.displayName));
		}
		else {
			console.error(res);
		}
	};
}



// Gets youtube video id
const videoID = process.argv[2].replace('https://www.youtube.com/watch?v=', '');

// Gets live chat messages from stream using its video id
request('videos?part=liveStreamingDetails&id=' + videoID, (res) => {
	getChatItems(res.items[0].liveStreamingDetails.activeLiveChatId, (message, author) => {
		// if (message.match(/@[\S]+/) === null) return;
		console.log('\x1b[1m' + author + ':\x1b[0m', message + '\n');
	});
});
