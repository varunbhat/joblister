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
        collection[cres_name || 'result'] = result;
    }

    return collection;
};

facet_filter = {
    xpath: '//*[@id="workdayApplicationFrame"]//div[@data-automation-id="facet"]',
    callback: function (facet_res, coll, name) {
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
                return coll.collection;
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

result_structure = {
    xpath: '//*[@data-automation-id="faceted_search_result"]//*[@aria-label="Search Results"]//ul/li[@data-automation-id="compositeContainer"]',
    collection_name: 'jobs',
    collection: {
        job: ''
    }
};

facet_filter_condition = {};


successfactors_links = {
    cypress: 'https://career4.successfactors.com/portalcareer?career_company=cypresssemP&jobPipeline=Google&career_job_req_id=9889&lang=en_US&candidateId=9758&currentTimeStamp=17%2F12%2F08%2020%3A00%3A01&token=D8994F5E6DA0B3C74D6F4617FFD431DEE1FBC03EF427052341B3D34D4CD8AB7E&career_ns=job_application&clientId=jobs2web&newCandidate=false&socialApply=false&partnerid=5773604800',
    micron: '',
    dolby: '',
    amd: '',
    sandisk: ''
};

taleo = {
    nokia: '',
    sony: '',
    onsemi: '',
    medtronic: ''

};

brassing = ['ibm',
];

selectminds = {
    'xilinx': ''
};