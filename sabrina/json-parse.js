"use strict";

module.exports = function (text, callback) {
    var parsedObj = null;
    try {
        parsedObj = JSON.parse(text);
    } catch (e) {
        return callback(e);
    }
    return callback(null, parsedObj);
};
