"use strict";

module.exports = {
    escapeWaterfall: function (funcs, callback, initValue) {
        // handmade helper for scheduling clumsy callbacks
        var index = 0;
        var length = funcs.length;
        function raiseComplete (err, value) {
            if (callback) {
                callback(err, value);
            }
        }
        function nextFunc (value) {
            return funcs[index++](value, asyncCb, asyncEnd, asyncEscape);
        }
        function asyncCb (err, value) {
            if (err) {
                if (index < length) {
                    return nextFunc(value);
                } else {
                    return raiseComplete(err);
                }
            } else {
                if (index < length) {
                    return nextFunc(value);
                } else {
                    return raiseComplete(null, value);
                }
            }
        }
        function asyncEnd (err, value) {
            if (err) {
                if (index < length) {
                    return nextFunc(value);
                } else {
                    return raiseComplete(err);
                }
            } else {
                return raiseComplete(null, value);
            }
        }
        function asyncEscape (err, value) {
            if (err) {
                return raiseComplete(err);
            } else {
                if (index < length) {
                    return nextFunc(value);
                } else {
                    return raiseComplete(null, value);
                }
            }
        }
        if (length === 0) {
            return;
        }
        funcs[index++](initValue, asyncCb, asyncEnd, asyncEscape);
    }
};
