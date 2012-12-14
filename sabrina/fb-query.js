"use strict";

var url = require("url");
var request = require("request");

var DESKTOP_REDIRECT_URI = "https://www.facebook.com/connect/login_success.html";

var component = {
    getOAuthUrl: function (query) {
        return url.format({
            "protocol": "http:",
            "host": "www.facebook.com",
            "pathname": "/dialog/oauth",
            "query": query
        });
    }
    , getDefaultAuthUrl: function (appId) {
        return this.getOAuthUrl({
            "client_id": appId,
            "scope": "user_groups,read_stream",
            "response_type": "token",
            "redirect_uri": DESKTOP_REDIRECT_URI
        });
    }
    , getExchangeTokenUrl: function (appId, appSecret, accessToken) {
        return "https://graph.facebook.com/oauth/access_token" +
            "?client_id=" + appId +
            "&client_secret=" + appSecret +
            "&grant_type=fb_exchange_token" + 
            "&fb_exchange_token=" + accessToken;
    }
    , query: function (groupId, accessToken, callback) {
        function buildQuery (groupId) {
            return {
                "allposts":
                    "SELECT " + 
                        "post_id,actor_id,message,attachment,comments,permalink,created_time,updated_time " + 
                    "FROM stream " + 
                    "WHERE source_id in " + 
                        "(SELECT gid FROM group WHERE gid='" + groupId + "') " + 
                    "LIMIT 100",

                "usernames":
                    "SELECT name,uid FROM user WHERE uid IN " +
                        "(SELECT actor_id,comments.comment_list.fromid FROM #allposts)",

                "group":
                    "SELECT name,gid FROM group WHERE gid='" + groupId + "'"
            };
        }
        function buildQueryUrl (query, accessToken) {
            var queryString = (typeof query === "string") ? query : JSON.stringify(query);
            return url.format({
                "protocol": "https:",
                "host": "graph.facebook.com",
                "pathname": "/fql",
                "query": {
                    "q": queryString,
                    "access_token": accessToken
                }
            });
        }
        var query = buildQuery(groupId);
        var requestUrl = buildQueryUrl(query, accessToken);
        return request.get(requestUrl, function (err, response, body) {
            function onError (e) {
                return callback(e);
            }
            if (err) {
                return onError(err);
            }
            var parsedObj;
            try {
                parsedObj = JSON.parse(body);
            } catch (e) {
                return onError(e);
            }
            return callback(null, parsedObj);
        });
    }
};

module.exports = component;
