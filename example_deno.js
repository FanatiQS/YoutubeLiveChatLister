'use strict';

import getChat from "./mod.js";

for await (const item of getChat(Deno.args[0], Deno.args[1])) {
	console.log('\x1b[1m' + item.authorDetails.displayName + ':\x1b[0m', item.snippet.displayMessage + '\n');
}
