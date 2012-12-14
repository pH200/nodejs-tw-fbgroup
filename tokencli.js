"use strict";

var optimist = require("optimist");

var fbQuery = require("./sabrina/fb-query");
var navigateUrl = require("./sabrina/navigate-url");

var argv = optimist
    .alias("db", "persistence")
    .string(["appid", "appsecret", "groupid", "accesstoken"])
    .boolean(["login_steps", "exchange_token", "navigate_url"])
    ["default"]("appid", process.env.FGA_APPID)
    ["default"]("appsecret", process.env.FGA_APPSECRET)
    ["default"]("groupid", process.env.FGA_GROUPID)
    ["default"]("accesstoken", process.env.FGA_ACCESSTOKEN)
    .wrap(80)
    .argv;

function steps () {
    function loginSteps () {
        console.log("Login URL: ");
        var url = fbQuery.getDefaultAuthUrl(argv.appid || "$APPID");
        console.log(url);
        if (argv.navigate_url && argv.appid) {
            navigateUrl(url);
        }
    }
    function exchangeToken () {
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
    }
    if (argv.login_steps) {
        return loginSteps();
    }
    if (argv.exchange_token) {
        return exchangeToken();
    }
}

steps();
