var page = require('webpage').create();
var fs = require('fs');

company = require('./company_data.js').broadcom;

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, ' +
    'like Gecko) Version/11.0.1 Safari/604.3.2';

page.viewportSize = {
    width: 1440, height: 900
};

page.onConsoleMessage = function (msg) {
    console.log('Page Log: ' + msg);
};

page.onResourceRequested = function (req, networkRequest) {
    // console.log('requested: ' + JSON.stringify(req.url, undefined, 4));
};

page.onResourceReceived = function (res) {
    // console.log('received: ' + JSON.stringify(res.url, undefined, 4));
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

page.open(company.url, function () {
    page.evaluate(function () {
        (function (open) {
            XMLHttpRequest.prototype.open = function () {
                this.addEventListener("readystatechange", function () {
                    console.log(this.responseText);
                }, false);
                open.apply(this, arguments);
            };
        })(XMLHttpRequest.prototype.open);
    });

    page.injectJs('./injectionExtraction.js');
    setInterval(function () {
        page.render(company.name + '_old.png')
    }, 3900);

    setInterval(function () {
        setFacets('broadcom', company.facet_filter);
    }, 4000);

    setInterval(function () {
        page.render(company.name + '.png')
    }, 6000);

    setInterval(phantom.exit, 8000);
});