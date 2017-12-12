var fs = require('fs');


company = require('./company_data.js');
page_state = 0;

var retimize_interval = 0;

function next(exec_func, condition) {
    var interval = setInterval(function () {
        var ps = JSON.parse(
            page.evaluate(function (cond) {
                vb_hacks = vb_hacks || {};
                vb_hacks.page_state = vb_hacks.page_state || 0;
                vb_hacks.page_stage = vb_hacks.page_stage || 'initialized';

                if (vb_hacks.page_stage === 'initialized') {
                    vb_hacks.page_stage = document.evaluate(condition, document, null, 0, null).iterateNext() ?
                        'initialized' : 'complete';
                }

                return JSON.stringify({pagestate: vb_hacks.page_state, pagestage: vb_hacks.page_stage});
            }, condition)
        );

        if (ps.pagestate === page_state && ps.pagestage === 'complete') {
            page.evaluate(function () {
                vb_hacks.page_state = vb_hacks.page_state++;
                vb_hacks.page_stage = 'initialized';
            });
            exec_func();
            clearInterval(interval);
            page_state++;
        }
    }, 1000);
}

function page_settings(page) {
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

    return page;
}

function login_fill(page) {
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

        username.value = 'varunbhat.kn@gmail.com';
        password.value = 'djptwm241@Sam';

        signin.click();
    });
}

function page_initialize(page) {
    page.evaluate(function () {
        vb_hacks = document.vb_hacks || {};

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
}

Object.keys(company).forEach(function (company_name) {
    var page = page_settings(require('webpage').create());

    setTimeout(function () {
        page.open(company[company_name].url, function () {
            page_initialize(page);

            setTimeout(function () {
                page.render('results/' + company_name + '_login.png');
            }, 4000);

            setTimeout(function () {
                login_fill(page);
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
                // console.log(typeof vb_hacks);
                var data = page.evaluate(function () {
                    return JSON.stringify(vb_hacks);
                });

                fs.write('results/' + company_name + '.json', data, 'w');
            }, 9000);

            setTimeout(function () {
                page.render('results/' + company_name + '.png');
            }, 9000);
            // setInterval(phantom.exit, 10000);
        });
    }, retimize_interval);
    retimize_interval += 9100;
});

setTimeout(phantom.exit, retimize_interval);