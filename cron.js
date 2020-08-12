const { CronJob } = require("cron");
const config = require("./config");
const vote = require("./Scraper");

const job = new CronJob(
    "0 */12 * * * *",
    async () => {
        for (let i = 0; i < config.tokens.length; i++) {
            const x = await vote(config.tokens[i]);
            if (x) continue;
            else break;
        }
    },
    null,
    true,
    "America/Sao_Paulo" //Change to your timezone
);

job.start();
