// var test = require('selenium-webdriver/phantomjs');
const {Builder, By, Key, until} = require('selenium-webdriver');

driver = new Builder()
    .forBrowser('phantomjs')
    .build();

driver.manage().window().setSize(1440, 900);

fs = require('fs');
driver.get('https://arrow.wd1.myworkdayjobs.com/en-US/AC/login');

driver.wait(until.elementLocated(By.id('wd-Authentication-NO_METADATA_ID')), 10000)
    .then(function () {
        driver.findElement(
            By.xpath('//*[@data-automation-id="auth_container"]//div[@data-automation-id="userName"]/input'))
            .sendKeys('varunbhat.kn@gmail.com');

        driver.findElement(
            By.xpath('//*[@data-automation-id="auth_container"]//div[@data-automation-id="password"]/input'))
            .sendKeys('djptwm241@Sam', Key.RETURN);
    })
    .then(function () {
        driver.findElement(
            By.xpath('//*[@id="wd-Authentication-NO_METADATA_ID"]//div[@data-automation-id="click_filter"]'))
            .then(function (button) {
                console.log(button.getTagName());
                button.click();
            });

        button.click();

    })
// .then(function () {
//     driver.wait(until.elementLocated(By.id('wd-PageContent-vbox')), 5000)
//         .takeScreenshot().then(function (p1) {
//             return fs.writeFileSync('results/arrow_userhome.png', p1, 'base64');
//         }
//     );
// }).catch(function (p1) {
// console.log('not found');
// driver.findElement(By.xpath('//html')).takeScreenshot().then(function (p1) {
//         return fs.writeFileSync('results/arrow_err.png', p1, 'base64');
//     }
// );
// });


