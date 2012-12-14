"use strict";

(function boundEJS (ejs) {
    ejs.filters.escape = function (obj) {
        return obj.toString()
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    ejs.filters.br = function (obj) {
        return obj.toString().replace(/\n/g, "<br />");
    };
    ejs.filters.linkify = function (obj) {
        return obj.toString().replace(/(https?|ftp):\/\/([\-A-Za-z0-9+&@#\/%?=~_|!:,.;](?!(&nbsp;)))*[\-A-Za-z0-9+&@#\/%=~_|]/g, '<a href="$&" target="_blank">$&</a>');
    };
})(require("ejs"));
