vb_hacks = vb_hacks || {};

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

