const vote = require("./Scraper");
const config = require("./config");

(async () => {
    console.clear();
    for (let i = 0; i < config.tokens.length; i++) {
        const x = await vote(config.tokens[i]);
        if (x) continue;
        else break;
    }
    process.exit(0);
})();
