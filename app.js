"use strict";

var optimist = require("optimist");

var express = require('express');
var http = require('http');
var path = require('path');

var fbQuery = require("./sabrina/fb-query");
var readJson = require("./sabrina/persistence-read-json");
var saveJson = require("./sabrina/persistence-save-json");
var startServer = require("./erika/start-server");

var waterfall = require("./sabrina/waterfall");

var navigateUrl = require("./sabrina/navigate-url");

var argv = optimist
    .alias("db", "persistence")
    .string(["appid", "appsecret", "groupid", "accesstoken"])
    .string(["persistence", "jsonpath", "jsondir"])
    .string(["site_title"])
    .boolean(["get_token"])
    .boolean(["rebuild", "disable_static", "no_auto_rebuild", "skip_server"])
    .boolean(["login_steps", "exchange_token", "navigate_url"])
    /* .default() */
    ["default"]("persistence", "json")
    ["default"]("jsondir", __dirname)
    ["default"]("appid", process.env.FGA_APPID)
    ["default"]("appsecret", process.env.FGA_APPSECRET)
    ["default"]("groupid", process.env.FGA_GROUPID)
    ["default"]("accesstoken", process.env.FGA_ACCESSTOKEN)
    ["default"]("site_title", process.env.FGA_SITETITLE)
    ["default"]("port", process.env.PORT || 5566)
    .wrap(80)
    .argv;

var continueNormal = (function steps (argument) {
    if (argv.login_steps) {
        console.log("Login URL: ");
        var url = fbQuery.getDefaultAuthUrl(argv.appid || "$APPID");
        console.log(url);
        if (argv.navigate_url && argv.appid) {
            navigateUrl(url);
        }
    } else if (argv.exchange_token) {
        console.log("Open URL: ");
        var url = fbQuery.getExchangeTokenUrl(
            argv.appid || "$APPID",
            argv.appsecret || "$APPSECRET",
            argv.accesstoken || "$ACCESSTOKEN");
        console.log(url);
        if (argv.navigate_url &&
            argv.appid && argv.appsecret && argv.accesstoken) {
            navigateUrl(url);
        }
    } else {
        return true;
    }
})();
if (!continueNormal) {
    return;
}

var persistence = argv.persistence;

function getData (callback) {
    if (persistence === "json") {
        return readJson(argv.jsonpath, argv.jsondir, callback);
    }
    return callback("data not found");
}

waterfall.escapeWaterfall([
    function (value, cb, end, escape) {
        if (!argv.rebuild) {
            return getData(end);
        }
        return cb("next");
    },
    function (value, cb, end, escape) {
        if ((!argv.no_auto_rebuild) && argv.groupid && argv.accesstoken) {
            console.log("querying new data...");
            return fbQuery.query(argv.groupid, argv.accesstoken, escape);
        } else {
            return escape("provide FB informations or setup persistence data.");
        }
    },
    function (value, cb, end, escape) {
        if (persistence === "json") {
            return saveJson(JSON.stringify(value), argv.jsonpath, argv.jsondir, waterfall.carry(value, cb));
        } else {
            return end(null, value);
        }
    },
    function (value, cb, end, escape) {
        if (/* err */value[0]) {
            console.log(value[0]);
            console.log("failed saving persistence.");
        }
        return end(null, /* value */value[1]);
    }
], function (err, data) {
    if (err) {
        return console.log(err);
    }
    if (!argv.skip_server) {
        startServer(data, argv);
    }
});
