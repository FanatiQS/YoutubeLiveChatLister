This is a super basic NodeJS script that lists the chat messages from a youtube livestream in the terminal.

First, add your own google api key and make sure that `Youtube Data API v3` is enabled. Details on how to generate a project and api key can be found here: https://developers.google.com/maps/documentation/javascript/get-api-key. Run the script with the url to an active youtube livestream like this: `node index.js url`. The url can be either the full url, or just the video id (the part after the `v=` in the url).


## Run examples

### Node.js
Run the example file for node.js with `node example_node.js <youtube url> <api key>` and replace `<youtube url>` with a url to a youtube livestream and replace `<api key>` with your own google api key.

### Deno
Run the example file for deno with `deno run --allow-net --allow-read example_deno.js <youtube url> <api key>` and replace `<youtube url>` with a url to a youtube livestream and replace `<api key>` with your own google api key.

### Browser
In `example_browser.html`, replace the empty string for `url` with your youtube url and apikey with your api key.
Then set up a local http server with `python -m SimpleHTTPServer` or similar.
