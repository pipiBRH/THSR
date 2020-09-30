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
  // 14:30 = 230P
  // 15:00 = 300P
  // 15:30 = 330P
  // 16:00 = 400P
  // 16:30 = 430P
  // 17:00 = 500P
  // 17:30 = 530P
  // 18:00 = 600P
  // 18:30 = 630P
  // 19:00 = 700P
  // 19:30 = 730P
  // 20:00 = 800P
  // 20:30 = 830P
  // 21:00 = 900P
  // 21:30 = 930P
  // 22:00 = 1000P
  // 22:30 = 1030P
  // 23:00 = 1100P
  // 23:30 = 1130P

  // ticket numbers
  // 0F = 0
  // 1F = 2
  // 2F = 3
  // 3F = 3
  // 4F = 4
  // 5F = 5
  // 6F = 6
  // 7F = 7
  // 8F = 8
  // 9F = 9
  // 10F = 10

  var startStation = "7";
  var destinationStation = "4";
  var tableDate = "2020/10/04";
  var tableTime = "700P";
  var ticketNumbers = "2F"
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
  await page.waitForSelector('[name="ticketPanel:rows:0:ticketAmount"]');
  await page.waitFor(1000);

  page.select('[name="selectStartStation"]', startStation);
  page.select('[name="selectDestinationStation"]', destinationStation);
  await page.focus('[name="toTimeInputField"]').then(async () => {
    await page.click('[name="toTimeInputField"]', { clickCount: 3 });
    await page.keyboard.type(tableDate);
  });
  page.select('[name="toTimeTable"]', tableTime);
  page.select('[name="ticketPanel:rows:0:ticketAmount"]', ticketNumbers);

  await page.waitFor(10000);

  var flag = true;
  while (flag) {
    await page.waitForSelector('[name="SubmitButton"]');
    await page.click('[name="SubmitButton"]');
    await page
      .waitForSelector("#BookingS2Form", { timeout: 1000 })
      .then(() => {
        flag = false;
      })
      .catch(async () => {
        console.log("No tickets to booking. Waiting for retry...");
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
