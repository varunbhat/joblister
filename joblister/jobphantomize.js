var fs = require('fs');

company = require('./company_data.js');

var retimize_interval = 0;

Object.keys(company).forEach(function (company_name) {
    var page = require('webpage').create();

    page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, ' +
        'like Gecko) Version/11.0.1 Safari/604.3.2';

    page.viewportSize = {
        width: 1440, height: 900
    };

    page.onConsoleMessage = function (msg) {
        console.log('Page Log: ' + msg);
        // fs.write('result.json', msg, 'w');
    };

    page.onUrlChanged = function (targetUrl) {
        console.log('New URL: ' + targetUrl);
    };

    page.onResourceRequested = function (req, networkRequest) {
        // console.log('requested: ' + JSON.stringify(req.url, undefined, 4));
    };

    page.onResourceReceived = function (res) {
        // console.log('Response (#' + res.id + ', stage "' + res.stage + '"): ' + JSON.stringify(res, null, 2));
        // console.log('received: ' + JSON.stringify(res.url, undefined, 4));
        // if (res.contentType === 'application/json' && res.stage === 'end') {
        // console.log('received: ' + JSON.stringify(res.url, undefined, 4));
        // var file_name = res.url.split('?')[0].split('/').splice(-1)[0];
        // fs.write('results/' + file_name + '.json', res.body, 'w');
        // }
    };

    page.evaluate(function () {
        // document.head.append = document.head.appendChild;
    });

    setTimeout(function () {
        page.open(company[company_name].url, function () {
            page.evaluate(function () {
                vb_hacks = {};

                (function (open) {
                    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                        this.addEventListener("readystatechange", function () {
                            if (XMLHttpRequest.DONE === this.readyState && this.getResponseHeader('Content-Type') === 'application/json') {
                                // console.log("AJAX response: " + url);
                                vb_hacks['data'] = vb_hacks['data'] || [];
                                vb_hacks['data'].push({url: url, data: JSON.parse(this.responseText)});
                            }
                        }, false);
                        open.apply(this, arguments);
                    };
                })(XMLHttpRequest.prototype.open);
            });

            login_fill = function () {
                page.evaluate(function () {
                    var username = document.evaluate(
                        '//*[@data-automation-id="auth_container"]//div[@data-automation-id="userName"]/input', document, null, 0, null)
                        .iterateNext();
                    var password = document.evaluate(
                        '//*[@data-automation-id="auth_container"]//div[@data-automation-id="password"]/input', document, null, 0, null)
                        .iterateNext();

                    var signin = document.evaluate(
                        '//*[@data-automation-id="auth_container"]//div[@data-automation-id="click_filter"]', document, null, 0, null)
                        .iterateNext();


                    // console.log(username, password, signin);
                    // console.log(username.value);
                    // console.log(password.value);
                    signin.click();
                });
            };

            setTimeout(function () {
                page.render('results/' + company_name + '_login.png');
            }, 4000);

            setTimeout(function () {
                login_fill();
            }, 4000);

            setTimeout(function () {
                page.render('results/' + company_name + '_userhome.png');
            }, 5900);

            setTimeout(function () {
                page.evaluate(function () {
                    var home_button = document.evaluate(
                        '//*[@id="workdayApplicationHeader"]//span[@class="workdayLogo"]', document, null, 0, null)
                        .iterateNext();
                    // console.log(home_button);
                    home_button.click();
                });
            }, 6000);

            setTimeout(function () {
                var data = page.evaluate(function () {
                    return JSON.stringify(vb_hacks);
                });

                fs.write('results/' + company_name + '_home.json', data, 'w');
            }, 9000);

            setTimeout(function () {
                page.render('results/' + company_name + '.png');
            }, 9000);
            // setInterval(phantom.exit, 10000);
        });
    }, retimize_interval);
    retimize_interval += 9100;
    // phantom.exit();
});

setTimeout(phantom.exit, retimize_interval);