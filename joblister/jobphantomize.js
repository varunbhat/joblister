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
    filterSearch = function (xpathStructure, xpathroot, cres_name, collection) {
        collection = collection || {};

        if (xpathStructure.collection) {
            var xresult = document.evaluate(xpathStructure.xpath, xpathroot, null, XPathResult.ANY_TYPE, null),
                xdom = xresult.iterateNext(),
                lcollection = [];
            while (xdom) {
                var llcollection = {};
                Object.keys(xpathStructure.collection).forEach(function (cname) {
                    llcollection = filterSearch(xpathStructure.collection[cname], xdom, cname, llcollection);
                });
                xdom = xresult.iterateNext();
                lcollection.push(llcollection);
            }
            collection['collection'] = lcollection;
        }

        var result = document.evaluate(xpathStructure.xpath, xpathroot, null, XPathResult.ANY_TYPE, null);
        // console.log(xpathroot.id, xpathroot, xpathStructure.xpath, xpathStructure);
        if (xpathStructure.callback)
            collection = xpathStructure.callback(result, collection, cres_name);
        else {
            console.log('unparsable');
            // collection[cres_name || 'result'] = result;
        }

        return collection;
    };

    var search_structure = {
        xpath: '//*[@id="workdayApplicationFrame"]//div[@data-automation-id="facet"]',
        callback: function (facet_res, coll, coll_name) {
            var data = [];
            var i = 0;
            var facet = facet_res.iterateNext();
            while (facet) {
                var facet_name = facet.id.split('-').splice(-1)[0];
                coll[facet_name] = coll.collection[i++];
                facet = facet_res.iterateNext()
            }
            delete coll.collection;
            return coll;
        },

        collection: {
            facets: {
                xpath: './/div[@data-automation-id="facetValue"]',
                callback: function (res, coll, name) {
                    console.log(name);
                    coll[name] = coll.collection;
                    delete coll.collection;
                    return coll;
                },
                collection: {
                    id: {
                        xpath: '@id',
                        callback: function (id_res, coll, name) {
                            coll[name] = id_res.iterateNext().value;
                            return coll;
                        }
                    },
                    selected: {
                        xpath: '@aria-checked',
                        callback: function (id_res, coll, name) {
                            coll[name] = id_res.iterateNext().value;
                            return coll;
                        }
                    },
                    name: {
                        xpath: './/label/text()',
                        callback: function (text_res, coll, name) {
                            coll[name] = text_res.iterateNext().nodeValue;
                            return coll;
                        }
                    }
                }
            }
        }
    };
    
    // result_structure = {
    //     xpath:'//*[@data-automation-id="faceted_search_result"]//*[@aria-label="Search Results"]//ul/li[@data-automation-id="compositeContainer"]',
    //     collection_name: 'jobs',
    //     collection: {
    //         job:
    //     }
    // };

    var results = filterSearch(search_structure, document);
    // console.log(JSON.stringify(filterSearch(search_structure, document), null, 2));

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
                return document.getElementById("gibberish342alkvaiu4ouvai");
            });
        }, function () { // Ready
            // page.evaluate(workday_tests);
        }, function () { // timeout
            // after_pageload();
            // fs.write('nvidia.html', page.content, 'w');
            page.render('nvidia.png');
            page.evaluate(workday_tests);
        },
        3000);
});