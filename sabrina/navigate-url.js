"use strict";

var exec = require('child_process').exec;

function darwin (url) {
    exec('open "' + url + '"');
}

function win32 (url) {
    // http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/ntcmds_shelloverview.mspx
    exec('start ' + url.replace(/(\(|\)|\||&)/g, "^$&"));
}

module.exports = function (url) {
    switch (process.platform) {
        case "darwin":
            return darwin(url);
        case "win32":
            return win32(url);
    }
};
