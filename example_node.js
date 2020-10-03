'use strict';

const getChat = require('./index.js');

(async () => {
	for await (const item of getChat(process.argv[2], process.argv[3])) {
		console.log('\x1b[1m' + item.authorDetails.displayName + ':\x1b[0m', item.snippet.displayMessage + '\n');
	}
})();
