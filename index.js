const logger = require("ora");
const config = require("./config");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const spinner = {
    interval: 60,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
};

console.clear();

function vote(token) {
    return new Promise(async function (resolve, reject) {
        await puppeteer
            .launch({
                executablePath: "/usr/bin/chromium-browser",
                headless: true,
                slowMo: 10,
                args: ["--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox", "--no-first-run", "--no-sandbox", "--no-zygote", "--single-process"]
                // args: ["--auto-open-devtools-for-tabs"]
            })
            .then(async (browser) => {
                console.log(`[EXECUTANDO COMO]: ${token}`);

                const page = await browser.newPage();

                await page.setViewport({
                    width: 1920,
                    height: 1080,
                    deviceScaleFactor: 1
                });

                const connectLog = logger({
                    text: "[CONNECTING TO DISCORD]",
                    spinner
                }).start();

                await page.goto(
                    "https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D264434993625956352%26scope%3Didentify%26redirect_uri%3Dhttps%253A%252F%252Ftop.gg%252Flogin%252Fcallback%26response_type%3Dcode"
                );

                await page.waitFor(8000);

                connectLog.succeed(`[CONNECTED TO DISCORD]`);

                const discordLog = logger({
                    text: "[LOGGING INTO DISCORD]",
                    spinner
                }).start();

                await page.evaluate((_) => {
                    function login(_token) {
                        document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token = `"${_token}"`;
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }

                    login(_);
                }, token);

                await page.waitFor(8000);

                if (page.url() == "https://discord.com/login") return resolve(discordLog.fail(`[COULDN'T CONNECT TO DISCORD]`));

                discordLog.succeed(`[LOGGED INTO DISCORD]`);

                const oauth2Log = logger({
                    text: "[LOGGING INTO OAUTH2]",
                    spinner
                }).start();

                await page.evaluate((_) => {
                    Array.from(document.querySelectorAll("div"))
                        .filter((e) => e.innerText == "Authorize")[0]
                        .parentElement.click();
                });

                await page.waitFor(8000);

                oauth2Log.succeed(`[LOGGING INTO OAUTH2]`);

                await page.goto(`https://top.gg/bot/${config.botID}/vote`);

                await page.waitFor(8000);

                const voteLog = logger({
                    text: "[VOTING]",
                    spinner
                }).start();

                const btn = await page.evaluate((_) => {
                    if (document.querySelector("#votingvoted")) {
                        document.querySelector("#votingvoted").click();
                        return true;
                    } else return false;
                });

                if (!btn) return resolve(voteLog.fail(`[BLOCKED TOKEN]`));

                await page.waitFor(10000);

                const text = await page.evaluate((_) => {
                    return document.querySelector("#votingvoted").innerText;
                });

                if (text != "You already voted for this bot. Try again in 12 hours.") {
                    voteLog.succeed(`[VOTED TO ${config.botID}]`);
                } else if (!text) return resolve(voteLog.fail(`[BLOCKED TOKEN]`));
                else {
                    voteLog.fail(`[ALREADY VOTED TO ${config.botID}]`);
                }

                await page.screenshot({ path: `./prints/${token}.png` });

                await browser.close();

                console.log("--------------------------------------");

                resolve(true);
            });
    });
}

(async () => {
    for (let i = 0; i < config.tokens.length; i++) {
        const x = await vote(config.tokens[i]);
        if (x) continue;
        else break;
    }
})();

// const { CronJob } = require("cron");

// const job = new CronJob(
//     "0 */12 * * * *",
//     () => {
//         console.log("You will see this message every second");
//     },
//     null,
//     true,
//     "America/Sao_Paulo"
// );

// job.start();
