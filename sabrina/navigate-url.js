"use strict";

var exec = require('child_process').exec;

var implementations = {
    darwin: function darwin (url) {
        exec('open "' + url + '"');
    }
    , win32: function win32 (url) {
        // http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/ntcmds_shelloverview.mspx
        exec('start ' + url.replace(/(\(|\)|\||&)/g, "^$&"));
    }
};

module.exports = (function (platform) {
    var func = implementations[platform];
    if (func) {
        return func;
    }
    return (function noop () {});
})(process.platform);
