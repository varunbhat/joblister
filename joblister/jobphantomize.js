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
    filterSearch = function (xpath, xpath_res) {
        xpath_res = xpath_res || [[]];

        if (!xpath_res[xpath_res.length - 1].length) {
            // []
            xpath_res[0].push(document.evaluate(xpath[0], document, null, XPathResult.ANY_TYPE, null));
        } else {
            var xres = [];
            xpath_res[xpath_res.length - 1].forEach(function (resobj) {
                var mdom = resobj.iterateNext();

                while (mdom) {
                    xres.push(document.evaluate(xpath[0], mdom, null, XPathResult.ANY_TYPE, null));
                    mdom = resobj.iterateNext();
                }
            });
            xpath_res.push(xres);
        }

        if (xpath.length === 1)
            return xpath_res;
        else
            return filterSearch(xpath.slice(1, xpath.length), xpath_res);
    };

    var results_data = filterSearch([
        '//*[@id="workdayApplicationFrame"]//div[@data-automation-id="facet"]',
        '//div[@data-automation-id="facetValue"]//input'
    ]);

    var search_structure = {
        xpath: '//*[@id="workdayApplicationFrame"]//div[@data-automation-id="facet"]',
        collection: {
            facetName: ['xpath', 'callback'],



        },
        child: {
            xpath: '//div[@data-automation-id="facetValue"]//input',
            xpath_root: '',
            collection_name_xpath: '' || function () {
            },
            collection_name: '',
            collections: {
                facetName: 'xpath' || function () {
                },

            },
            child: {},
            result_callback: function () {
            },

        }

    };

    var xstructure = {
        xpath: '',
        collection_name: '',

    };

    var test = {
        facet: [{}, {}, {}],


    };
    results_data[results_data.length - 1].forEach(function (xres, i) {
        var dat = xres.iterateNext();
        while (dat) {
            if (dat.parent().parent())

                dat = xres.iterateNext();
        }
    });
}

// [[divRes], [obj,obj,obj]]
// page.onLoadStarted = function () {
//     page.evaluateJavaScript("function(){ window.workday =  window.workday || {}; \
//         Object.defineProperty(window.workday, 'systemConfidenceLevel', {\
//             writable: false,\
//             value: 'DEV'\
//         }); \
//         document.head.append = document.head.appendChild;\
//     }");
// };


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


function after_pageload() {
    page_response_list.forEach(function (req) {
        if (req.url.indexOf('clientRequestID') != -1) {
            page.open(req.url, req.headers[0], function (status) {
                fs.write('data.html', page.content, 'w');
                page.render('nvidia.png');
                phantom.exit();
            });
        }
    });
}