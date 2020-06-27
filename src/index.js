const puppeteer = require("puppeteer");

(async () => {
  var startStation = "7";
  var destinationStation = "4";
  var tableDate = "2020/06/27";
  var tableTime = "600P";

  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ignoreHTTPSErrors: true,
    defaultViewport: { width: 1000, height: 1000 },
  });
  const page = await browser.newPage();
  await page.goto("https://irs.thsrc.com.tw/IMINT/?locale=tw");
  await page
    .waitForSelector('[name="confirm"]')
    .then(async () => {
      await page.click('[name="confirm"]');
    })
    .catch(() => {
      console.log("No confirm require");
    });
  await page.waitForSelector("#BookingS1Form_homeCaptcha_passCode");
  await page.waitForSelector('[name="selectStartStation"]');
  await page.waitForSelector('[name="selectDestinationStation"]');
  await page.waitForSelector('[name="toTimeInputField"]');
  await page.waitForSelector('[name="toTimeTable"]');
  await page.waitFor(1000);

  page.select('[name="selectStartStation"]', startStation);
  page.select('[name="selectDestinationStation"]', destinationStation);
  await page.focus('[name="toTimeInputField"]').then(async () => {
    await page.keyboard.type(tableDate);
  });
  page.select('[name="toTimeTable"]', tableTime);

  await page.waitFor(10000);
    var flag = true;
    while (flag) {
      await page.click('[name="SubmitButton"]');
      await page
        .waitForSelector("#BookingS2Form", { timeout: 2000 })
        .then(() => {
          flag = false;
        })
        .catch(async () => {
          console.log("No tickets to table");
        });
    }


    await browser.close();
})();
