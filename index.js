const vote = require("./Scraper");
const config = require("./modified/config");

const { WebhookClient } = require("discord.js");
const hook = new WebhookClient("743047259205140513", "la8fTnb1AXLfBqd0ly601mS9Hbzf-1_ncnbHbyuH5lD_Xn3gIQxYS4hP7cLmEohhTmGu");

(async () => {
    console.clear();
    for (let i = 0; i < config.tokens.length; i++) {
        const x = await vote(config.tokens[i], hook);
        if (x) continue;
        else break;
    };
})();
