const Parser = require('rss-parser');

const parser = new Parser();

const feedUrl = 'https://www.fenoxo.com/feed/';

(async () => {

    //const feed = await parser.parseURL(feedUrl);

    process.exitCode = 199;

})();