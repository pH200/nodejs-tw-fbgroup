"use strict";

(function boundEJS (ejs) {
    ejs.filters.br = function (obj) {
        return obj.toString()
            .replace(/&(?!\w+;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\n/g, "<br />");
    };
})(require("ejs"));
