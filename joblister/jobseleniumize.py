import time
from selenium import webdriver

driver = webdriver.Firefox()

websiteurl = 'https://avagotech.wd1.myworkdayjobs.com/External_Career'
driver.get(websiteurl)
time.sleep(5)

driver.execute_script("""
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
""")
