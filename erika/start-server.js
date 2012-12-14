"use strict";

var express = require('express');
var http = require('http');
var path = require('path');

// monkey-patching ejs
require("./ejs-filters");

var rootDir = path.join(__dirname, "..");
var defaultTitle = "Facebook Archive";

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

    var title = options.site_title ? (options.site_title + " - " + defaultTitle) : defaultTitle;

    app.get('/', function (req, res) {
        res.render("index", {
            title: title,
            allposts: data.allposts,
            users: data.users
        });
    });

    app.get("/post/:id", function (req, res) {
        var id = req.params.id;
        var index = data.postIndices.indexOf(id);
        if (index === -1) {
            return res.send(404);
        } else {
            res.render("stream", {
                title: title,
                post: data.allposts[index],
                users: data.users
            });
        }
    });

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
};
