"use strict";

var fs = require("fs");
var path = require("path");

module.exports = function (data, jsonpath, jsondir, callback) {
    if (jsonpath) {
        fs.writeFile(jsonpath, data, callback);
    } else if (jsondir) {
        var filename = "fql_" + Date.now() + ".json";
        fs.writeFile(path.join(jsondir, filename), data, callback);
    } else {
        callback(new Error("path arguments"));
    }
};
