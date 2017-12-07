var page = require('webpage').create();
var fs = require('fs');

// var websiteurl = 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite';
var websiteurl = 'https://avagotech.wd1.myworkdayjobs.com/External_Career';
var interval = {};

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.2';

page_response_list = [];

page.onConsoleMessage = function (msg) {
    console.log('Page Log: ' + msg);

};


page.onResourceRequested = function (req, networkRequest) {
    // console.log('requested: ' + JSON.stringify(req.url, undefined, 4));
};

page.onResourceReceived = function (res) {
    // console.log('received: ' + JSON.stringify(res.url, undefined, 4));
};

function waitFor(testFx, onReady, onTimeout, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false;

    interval = setInterval(function () {
        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
            // If not time-out yet and condition not yet fulfilled
            condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
        } else {
            if (!condition) {
                // If condition still not fulfilled (timeout but condition is 'false')
                // console.log("'waitFor()' timeout");
                clearInterval(interval);
                typeof(onTimeout) === "string" ? eval(onTimeout) : onTimeout();
            } else {
                // Condition fulfilled (timeout and/or condition is 'true')
                console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                clearInterval(interval); //< Stop this interval
            }
        }
    }, 250); //< repeat check every 250ms
};

function workday_tests() {
    filterSearch = function (xpathStructure, xpathroot, collection) {
        collection = collection || {};

        var xresult = document.evaluate(xpathStructure.xpath, xpathroot, null, XPathResult.ANY_TYPE, null);
        var lcollection = [];

        if (xpathStructure.collection) {
            var xdom = xresult.iterateNext();
            var llcollection = {};
            while (xdom) {
                Object.keys(xpathStructure.collection).forEach(function (cname) {
                    llcollection[cname] = filterSearch(xpathStructure.collection[cname], xdom);
                });
                xdom = xresult.iterateNext();
            }

            xresult = document.evaluate(xpathStructure.xpath, xpathroot, null, XPathResult.ANY_TYPE, null);
        }

        if (xpathStructure.callback)
            collection['result'] = xpathStructure.callback(xresult);
        else
            collection['result'] = [xresult];

        return collection;

    };

    var search_structure = {
        xpath: '//*[@id="workdayApplicationFrame"]//div[@data-automation-id="facet"]',
        collection: {
            facetName: {
                xpath: '//div[@data-automation-id="facetValue"]/@id',
                callback: function (id_res) {
                    console.log(id_res.iterateNext().value);
                    return id_res.iterateNext().value.split('-').slice(-1)[0];
                }
            },
            facetValue: {
                xpath: '//div[@data-automation-id="facetValue"]//label/text()',
                callback: function (label_res) {
                    console.log(label_res.iterateNext().nodeValue);
                    return label_res.iterateNext().nodeValue;
                }
            }
        }
    };

    filterSearch(search_structure, document);
}


page.open(websiteurl, function (status) {
    page.evaluate(function () {
        var script = document.createElement('script');
        if (!("integrity" in script) && true && true) {
            script.type = 'text/javascript';
            script.src = "https://wd5.myworkday.com/wday/uiclient/static/gwt-desktop/integrity/integrity.min.js?" + (+new Date());
            document.head.appendChild(script);
        }
    });

    waitFor(function () {
            return page.evaluate(function () {
                return document.getElementById("wd-FacetedSearchResultList-facetSearchResultList");
            });
        }, function () { // Ready
            // page.evaluate(workday_tests);
        }, function () { // timeout
            // after_pageload();
            // fs.write('nvidia.html', page.content, 'w');
            // page.render('nvidia.png');
            page.evaluate(workday_tests);
        },
        5000);
});