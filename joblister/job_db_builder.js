var page = require('webpage').create();

var fs = require('fs');

var system = require('system');

function jxserarch(jxstring, obj, forward) {
    if (!Array.isArray(jxstring)) {
        jxstring = jxstring.split('.');
        forward = forward || [];
    }

    var p = jxstring[0];
    forward.push(p);
    console.log(forward);

    if (!obj || Object.keys(obj).indexOf(p) === -1) {
        forward.pop();
        return undefined;
    }
    else if (jxstring.length === 1 && Object.keys(obj).indexOf(p) !== -1) {
        forward.pop();
        return JSON.parse(JSON.stringify(obj[p]));
    }

    console.log(JSON.stringify(Object.keys(obj)));

    if (Array.isArray(obj[p])) {
        var res = [];
        var jxarrsave = jxstring.splice(1);
        obj[p].forEach(function (p1, index, arr) {
            console.log("Processing:", p, '[' + (index + 1) + '/' + obj[p].length + ']');
            var t = jxserarch(jxarrsave, JSON.parse(JSON.stringify(obj[p][index])), forward);
            if (t)
                res.push(t);
        });

        return res.length > 0 ? res[0] : undefined;
    }
    else {
        return jxserarch(jxstring.splice(1), JSON.parse(JSON.stringify(obj[p])), forward);
    }
}

if (system.args.length > 1) {
    var jc = JSON.parse(fs.read(system.args[1]));

    var search_res = jxserarch('data.data.body.children.children.children.children.children.children.subtitles', jc);

    // console.log(JSON.stringify(search_res, null, 2));
    // try {
    //     if ('p.data.body.children.children.children.label') {
    //         console.log('data.body.children.children.children.label', p);
    //     }
    // }
    // catch (err) {
    //     // console.log(err);
    // }
    phantom.exit();
}

phantom.exit();


