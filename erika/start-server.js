"use strict";

var express = require('express');
var http = require('http');
var path = require('path');

// monkey-patching ejs
require("./ejs-filters");

var rootDir = path.join(__dirname, "..");

module.exports = function (data, options) {
    var app = express();
    var bodyParser = express.bodyParser();
    
    app.configure(function () {
        app.set('port', options.port);
        app.set('views', path.join(__dirname, 'koga'));
        app.set('view engine', 'ejs');
        app.use(express.logger('dev'));
        // app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        if (!options.disable_static) {
            app.use(express['static'](path.join(rootDir, 'public')));
        }
    });
    
    app.configure('development', function () {
        app.use(express.errorHandler());
    });

    var usernames = (function (data) {
        var usernameIndices = [];
        var usernames = [];
        var resultSet = data.data[2].fql_result_set;
        for (var i = 0, len = resultSet.length; i < len; i++) {
            var user = resultSet[i];
            usernameIndices.push(user.uid);
            usernames.push(user);
        }
        return {
            usernameIndices: usernameIndices,
            usernames: usernames
        };
    })(data);
    var defaultTitle = "Facebook Archive";
    var title = (options.site_title ?
          options.site_title + " - " + defaultTitle
        : defaultTitle);

    app.get('/', function (req, res) {
        res.render("index", {
            title: title,
            data: data.data[0].fql_result_set,
            usernameIndices: usernames.usernameIndices,
            usernames: usernames.usernames
        });
    });

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
};
