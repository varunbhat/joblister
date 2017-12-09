var page = require('webpage').create();
var fs = require('fs');

company = require('./company_data.js').broadcom;

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, ' +
    'like Gecko) Version/11.0.1 Safari/604.3.2';

page.viewportSize = {
    width: 1440, height: 900
};

page.onConsoleMessage = function (msg) {
    // console.log('Page Log: ' + msg);
    // fs.write('result.json', msg, 'w');
};

page.onResourceRequested = function (req, networkRequest) {
    // console.log('requested: ' + JSON.stringify(req.url, undefined, 4));
};

page.onResourceReceived = function (res) {
    // console.log('Response (#' + res.id + ', stage "' + res.stage + '"): ' + JSON.stringify(res, null, 2));
    // console.log('received: ' + JSON.stringify(res.url, undefined, 4));
    if (res.contentType === 'application/json' && res.stage === 'end') {
        console.log('received: ' + JSON.stringify(res.url, undefined, 4));
        var file_name = res.url.split('?')[0].split('/').splice(-1)[0];
        fs.write('results/' + file_name + '.json', res.body, 'w');
    }
};

function setFacets(company_name, filter) {
    return page.evaluate(function (company_name, filter) {

        function check_filter_condition(value, filter) {
            // console.log(JSON.stringify(filter), value);
            var res = false;
            if (filter) {
                filter.forEach(function (fc) {
                    // console.log(fc, value, value.indexOf(fc) !== -1);
                    res = res || (value.indexOf(fc) !== -1);
                });
            }
            return res;
        }

        var results = filterSearch(facet_filter, document);

        // console.log(JSON.stringify(results, null, 2));
        var timeout_intervals = 0;
        Object.keys(results).forEach(function (facet) {
            results[facet].forEach(function (value) {
                if (check_filter_condition(value.name, filter[facet])) {
                    setTimeout(function () {
                        var facet_id = value.id.split('-').splice(-1)[0];
                        console.log(facet_id);
                        var element = document.getElementById('wd-FacetValue-CheckBox-' + facet_id + '-input');
                        element.click();
                    }, timeout_intervals);
                    timeout_intervals += 100;
                }
            })
        });
    }, company_name, filter);

}

page.open(company.url + '/login', function () {
    login_fill = function () {
        page.evaluate(function () {
            (function (open) {
                XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                    this.addEventListener("readystatechange", function () {
                        if (XMLHttpRequest.OPENED === this.readyState) {
                            // console.log(url)
                        }
                        else if (XMLHttpRequest.DONE === this.readyState && this.getResponseHeader('Content-Type') === 'application/json') {
                            console.log(this.responseText);
                        }
                    }, false);
                    open.apply(this, arguments);
                };
            })(XMLHttpRequest.prototype.open);
        });

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


            // console.log(username.value);
            // console.log(password.value);
            signin.click();
        });
    };

    setInterval(function () {
        login_fill();
    }, 3000);

    setInterval(function () {
        page.render('broadcom_enc.png')
    }, 4000);

    setInterval(phantom.exit, 4000);
});