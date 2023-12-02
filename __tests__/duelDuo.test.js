const { Builder, Browser, By, until } = require("selenium-webdriver");
require("chromedriver");
const chrome = require("selenium-webdriver/chrome");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:3000");
    await driver.wait(until.titleIs("Duel Duo"), 3000);
  });

  test("clicking the 'draw' button displays 5 robot div's choices", async () => {
    await driver.get("http://localhost:3000");
    await driver.findElement(By.id('draw')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[@id='choices']/div[1]/button")),4000);
   });

  test("Check that clicking an 'Add to Duo' button displays a robot div within a the div with id ='player-duo'", async () => {
    await driver.get("http://localhost:3000");
    await driver.findElement(By.id('draw')).click();
    await driver.wait(until.elementLocated(By.xpath("//*[@id='choices']/div[1]/button")),50000);

    await driver.findElement(By.xpath("//*[@id='choices']/div[1]/button")).click(); 
    await driver.wait(until.elementLocated(By.xpath("//*[@id='player-duo']/div[1]/button")),50000);
   });
});