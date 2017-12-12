var jsonpath = require('jsonpath'),
    fs = require('fs'),
    system = require('system'),
    path = require('path');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://db:27017/';
var db_name = 'joblister';
var collection_name = 'jobslist';

function initialize_collections(db) {
    db.collection('jobslist').createIndex({jobid: 1, companyname: 1}, {unique: 1})
}

update_db = function (res) {
    // Insert if job does not exist
    // If job present, Update last present
    console.log("Updating Database:");
    var db = res.db;
    try {
        // console.log(res.jobslist);
        db.collection(collection_name).insertMany(res.jobslist, function (err, result) {
            if (err)
                return Error("Collection not added");

            db.collection(collection_name).sa;
            console.log(result);
        });

    }
    catch (err) {
        console.log(err);
    }
}

process_json_downloads = function (db) {
    return new Promise(function (resolve, reject) {
        if (process.argv.length > 2) {
            console.log("Processing JSON");
            fs.readFile(process.argv[2], 'utf8', function (err, json_raw) {
                var jc = JSON.parse(json_raw);
                var myappslist = [];
                var jobslist = [];

                // Jobs
                var jobs = jsonpath.query(jc, '$.data[*].data.body.children[*].children[?(@.widget=="facetSearchResultList")].listItems[*]');
                jobs.forEach(function (p) {
                    var tmp = {};
                    tmp.title = p.title.instances[0].text;
                    tmp.link = p.title.commandLink;
                    tmp.location = p.subtitles[0].instances[0].text;
                    tmp.jobid = p.subtitles[1].instances[0].text;
                    tmp.jobdate = p.subtitles[2].instances[0].text;
                    tmp.companyname = path.basename(process.argv[2]).split('.')[0];

                    jobslist.push(tmp);
                });

                // My Applications
                var myapps = jsonpath.query(jc, '$.data[*].data.body..children[?(@.label=="My Applications")]..children[?(@.widget=="templatedListItem")]');
                myapps.forEach(function (p) {
                    var tmp = {};
                    tmp.title = p.title.instances[0].text;
                    tmp.appstatus = p.subtitles[1].instances[0].text;
                    tmp.appdate = p.subtitles[0].instances[0].text;
                    tmp.jobcode = p.title.instances[0].text.split(' ')[0];
                    // console.log(p.subtitles[0].instances[0].text);

                    myappslist.push(tmp);
                });

                console.log("Jobs:", jobslist.length, " Apps:", myappslist.length);

                return resolve({db: db, jobslist: jobslist, myappslist: myappslist});
            });
        } else {
            reject();
        }
    });
}


function connect_database() {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, client) {
            if (err)
                reject();
            console.log('Connected to Database');
            var db = client.db(db_name);
            initialize_collections(db);
            // console.log(resolve);
            resolve(db);
        });
    });
}
connect_database()
    .then(process_json_downloads)
    .then(update_db)
    .then(function () {
        console.log('done');
    })
    .catch(function (err) {
        console.log("rejected");
    });