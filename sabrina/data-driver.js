"use strict";

var fbQuery = require("./fb-query");
var dataGrinder = require("./data-grinder");

var Driver = function (data, persistenceFunc, options) {
    this.rootData = data;
    this.refinedData = dataGrinder(data);
    this.persistenceFunc = persistenceFunc;
    this.options = options;

    this._startCron();
};

Driver.prototype = {
    rebuildTask: function (groupId, accessToken, persistenceFunc) {
        var self = this;
        fbQuery.query(groupId, accessToken, function (err, data) {
            if (err) {
                return console.log(err);
            }
            if (self.persistenceFunc) {
                self.persistenceFunc(data);
            }
            self.rootData = data;
            self.refinedData = dataGrinder(data);
        });
    }
    , getData: function () {
        return this.refinedData;
    }
    , _startCron: function () {
        var self = this;
        if (this.options.cron) {
            var CronJob = require("cron").CronJob;
            new CronJob(this.options.cron, function () {
                console.log("cron: " + (new Date()));
                return self.rebuildTask(self.options.groupid, self.options.accesstoken, self.persistenceFunc);
            }, null, true);
        }
    }
};

module.exports = Driver;
