const logger = require("ora");
const config = require("./config");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const spinner = {
    interval: 60,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
};

function vote(token) {
    return new Promise(async function (resolve, reject) {
        await puppeteer
            .launch({
                // For Linux or WSL

                //executablePath: "/usr/bin/chromium-browser",
                //args: ["--disable-gpu", "--disable-dev-shm-usage", "--disable-setuid-sandbox", "--no-first-run", "--no-sandbox", "--no-zygote", "--single-process"],

                // For Windows

                executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",

                headless: false, // Open chrome or not(true means that is off)
                slowMo: 10
            })
            .then(async (browser) => {
                console.log(`[RUNNING AS]: ${token}`);

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
                    "https://discord.com/login?redirect_to=%2Foauth2%2Fauthorize%3Fclient_id%3D264434993625956352%26scope%3Didentify%26redirect_uri%3Dhttps%253A%252F%252Ftop.gg%252Flogin%252Fcallback%26response_type%3Dcode",
                    { waitUntil: "networkidle0" }
                );

                connectLog.succeed("[CONNECTED TO DISCORD]");

                const discordLog = logger({
                    text: "[LOGGING INTO DISCORD]",
                    spinner
                }).start();

                await page.evaluate((_) => {
                    function login(_token) {
                        document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage.token = `"${_token}"`;
                        setTimeout(() => {
                            location.reload();
                        }, 200);
                    }

                    login(_);
                }, token);

                await page.waitForNavigation({ waitUntil: "networkidle0" });

                if (page.url() === "https://discord.com/login") {
                    await browser.close();
                    return resolve(discordLog.fail("[COULDN'T CONNECT TO DISCORD]"));
                }

                discordLog.succeed("[LOGGED INTO DISCORD]");

                const oauth2Log = logger({
                    text: "[LOGGED INTO OAUTH2]",
                    spinner
                }).start();

                await page.waitForNavigation({ waitUntil: "networkidle0" });

                await page.evaluate((_) => {
                    Array.from(document.querySelectorAll("div"))
                        .filter((e) => e.innerText == "Authorize")[0]
                        .parentElement.click();
                });

                await page.waitForNavigation({ waitUntil: "networkidle0" });

                await page.waitForSelector("#home-page");

                oauth2Log.succeed("[LOGGED INTO OAUTH2]");

                await page.goto(`https://top.gg/bot/${config.botID}/vote`, { waitUntil: "networkidle0" });

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

                if (!btn) return resolve(voteLog.fail("[BLOCKED TOKEN]"));

                await page.waitFor(3000);

                const text = await page.evaluate((_) => {
                    return document.querySelector("#votingvoted").innerText;
                });

                if (text != "You already voted for this bot. Try again in 12 hours.") {
                    voteLog.succeed(`[VOTED TO ${config.botID}]`);
                } else if (!text) {
                    await browser.close();
                    return resolve(voteLog.fail(`[BLOCKED TOKEN]`));
                } else {
                    await browser.close();
                    return voteLog.fail(`[ALREADY VOTED TO ${config.botID}]`);
                }

                await page.screenshot({ path: `./prints/${token}.png` });

                await browser.close();

                console.log("--------------------------------------");

                resolve(true);
            });
    });
}

module.exports = vote;
