## Top.gg Bot Voter

A simple Top.gg bot voter made with puppeteer and love.

You can use this application to get inumerous votes on your bot on [Top.gg](https://top.gg) but you will require `Discord User tokens`.

<hr></hr>

## Instructions
### Downloading

- Download the source or clone the repo with `git clone`.
- If you don't have download [`NodeJS`](https://nodejs.org).
- After installing [`NodeJS`](https://nodejs.org) run `npm i` in the terminal to install the dependencies.
- Rename `config.example.js` to `config.js` and change `botID` to the id you want and add tokens so you can vote.
- After this all you can run `node index.js`.

### Running it periodically

I haven't tested it out yet, but you still can use [`cron`](https://www.npmjs.com/package/cron). [`Cron`](https://www.npmjs.com/package/cron) basically runs a function periodically according to what you have set on his config, as [Top.gg](https://top.gg) gives you a 12 hours delay to vote you can use the code below:

```javascript
const { CronJob } = require("cron");

const job = new CronJob(
    "0 */12 * * * *",
    () => {
        console.log("You will see this message every 12 hours");
        //...
    },
    null,
    true,
    "America/Sao_Paulo" // Your timestamp, can be found here: https://momentjs.com/timezone/
);

job.start();
```
