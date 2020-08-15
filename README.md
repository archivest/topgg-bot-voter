## Top.gg Bot Voter

A simple Top.gg bot voter made with puppeteer and love.

You can use this application to get inumerous votes on your bot on [Top.gg](https://top.gg) but you will require `Discord User tokens`.

<hr></hr>

## Instructions

### Downloading

-   Download the source or clone the repo with `git clone`.
-   Install [`NodeJS`](https://nodejs.org).
-   After installing [`NodeJS`](https://nodejs.org) run `npm i` in the terminal to install the dependencies.
-   Rename `config.example.js` to `config.js` and change `botID` to the id you want and add tokens so the bot can vote.
-   After this all you can run `npm start`.

### Running it periodically

I haven't tested it out yet, but you can use [`cron`](https://www.npmjs.com/package/cron) library. [`Cron`](https://www.npmjs.com/package/cron) basically runs a function periodically according to what you have set on his config, as [Top.gg](https://top.gg) gives you a 12 hours delay to vote, you can use the code below:

```js
const { CronJob } = require("cron");

const job = new CronJob(
    "0 */12 * * * *",
    () => {
        console.log("You will see this message every 12 hours");
        //...
    },
    null,
    true,
    "America/Sao_Paulo" // Your timezone, can be found here: https://momentjs.com/timezone/
);

job.start();
```

Or if you are lazy, we already made it for you, just type `npm run cron` in terminal.

## Any problems?
Contact me on Discord `notsapinho#2975`
