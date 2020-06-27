const puppeteer = require("puppeteer");

(async () => {
  // Station code
  // 南港 = 1
  // 台北 = 2
  // 板橋 = 3
  // 桃園 = 4
  // 新竹 = 5
  // 苗栗 = 6
  // 台中 = 7
  // 彰化 = 8
  // 雲林 = 9
  // 嘉義 = 10
  // 台南 = 11
  // 左營 = 12

  // table time code
  // 00:00 = 1201A
  // 00:30 = 1230A
  // 05:00 = 500A
  // 05:30 = 530A
  // 06:00 = 600A
  // 06:30 = 630A
  // 07:00 = 700A
  // 07:30 = 730A
  // 08:00 = 800A
  // 08:30 = 830A
  // 09:00 = 900A
  // 09:30 = 930A
  // 10:00 = 1000A
  // 10:30 = 1030A
  // 11:00 = 1100A
  // 11:30 = 1130A
  // 12:00 = 1200N
  // 12:30 = 1230P
  // 13:00 = 100P
  // 13:30 = 130P
  // 14:00 = 200P

  var startStation = "7";
  var destinationStation = "4";
  var tableDate = "2020/06/27";
  var tableTime = "800P";
  var idNumber = "your id number";
  var phone = "your phone number";
  var email = "your email";

  const browser = await puppeteer.launch({
    headless: false,
    // devtools: true,
    ignoreHTTPSErrors: true,
    // slowMo: 20,
    defaultViewport: { width: 1000, height: 1000 },
    ignoreDefaultArgs: ["--enable-automation"],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });
  });

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
    await page.click('[name="toTimeInputField"]', { clickCount: 3 });
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
  await page.waitForSelector('[name="SubmitButton"]');
  await page.click('[name="SubmitButton"]');

  await page.waitForSelector("#idNumber");
  await page.waitForSelector("#mobilePhone");
  await page.waitForSelector("#memberSystemCheckBox");
  await page.waitForSelector("#memberSystemCheckBox");
  await page.waitForSelector('[name="agree"]');
  await page.waitForSelector('[name="email"]');

  await page.focus("#idNumber").then(async () => {
    await page.keyboard.type(idNumber);
  });
  await page.focus("#mobilePhone").then(async () => {
    await page.keyboard.type(phone);
  });
  await page.focus('[name="email"]').then(async () => {
    await page.keyboard.type(email);
  });
  await page.click("#memberSystemCheckBox");
  await page.click("#memberSystemCheckBox");
  await page.click('[name="agree"]');
  await page.click("#isSubmit");

  //   await browser.close();
})();
