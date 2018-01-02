var casper = require('casper').create(),
    xp = require('casper').selectXPath;


casper.options.viewportSize = {
    width: 1440, height: 900
};

casper.options.onResourceRequested = function (cp, req) {
    console.log("Requested: " + req.url);
};

casper.options.onResourceRequested = function (cp, req) {
    console.log("Requested: " + req.url);
};


casper.on('remote.message', function (message) {
    this.echo(message);
});

company = require('./company_data');

Object.keys(company).forEach(function (company_name) {
    console.log(company[company_name].url);

    // Wait for login page to load
    casper.start(company[company_name].url, function () {
        // casper.page.onConsoleMessage(function (data) {
        //     console.log('PageLog: ' + data);
        // });
        casper.page.injectJs('casperInject.js');
        // this.evaluate(function (company_name) {
        //     vb_hacks.company_name = company_name;
        // }, company_name);
        console.log('data');
        this.waitForSelector('#wd-Authentication-NO_METADATA_ID');
    })

    // Fill the login form and submit
        .then(function () {
            casper.capture('results/' + company_name + '_beforelogin.png');

            this.fillXPath(xp('//*[@data-automation-id="auth_container"]'), {
                '//div[@data-automation-id="userName"]/input': 'varunbhat.kn@gmail.com',
                '//div[@data-automation-id="password"]/input': 'djptwm241@Sam'
            }, true);
        })
        .then(function () {
            this.evaluate(function () {
                var submit = document.evaluate(
                    '//*[@data-automation-id="auth_container"]//div[@data-automation-id="click_filter"]',
                    document, null, 0, null).iterateNext();
                console.log(submit);
                console.log(submit.click());
            });
            // this.click(xp('//*[@data-automation-id="auth_container"]//button[@data-automation-id="goButton"]'));
            // this.click(xp('//*[@data-automation-id="auth_container"]//div[@data-automation-id="click_filter"]'));
        })
        // .then(function () {
        //     this.click('div[data-automation-id="click_filter"]');
        // })

        // .then(function () {
        //     this.waitForSelector('#wd-Authentication-NO_METADATA_ID');
        //     casper.capture('results/' + company_name + '_aftersubmit.png');
        //     console.log('login page disappered');
        // })

        .then(function () {
            // casper.capture('results/' + company_name + '_aftersubmit.png');
            this.waitForSelector('#wd-PageContent-vbox');
            casper.capture('results/' + company_name + '_afterlogin.png');
        });
});

casper.run();