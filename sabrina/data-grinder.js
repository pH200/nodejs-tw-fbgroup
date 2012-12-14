"use strict";

module.exports = function (queryResult) {
    var allposts, usernames, group;
    queryResult.data.forEach(function (item) {
        switch (item.name) {
            case "allposts":
                allposts = item.fql_result_set;
                break;
            case "usernames":
                usernames = item.fql_result_set;;
                break;
            case "group":
                group = item.fql_result_set;
                break;
        }
    });
    var users = (function (usernames) {
        var usernameIndices = [];
        var users = [];
        for (var i = 0, len = usernames.length; i < len; i++) {
            var user = usernames[i];
            usernameIndices.push(user.uid);
            users.push(user);
        }
        return {
            indices: usernameIndices,
            users: users
        };
    })(usernames);
    var postIndices = (function (allposts) {
        var indices = [];
        for (var i = 0, len = allposts.length; i < len; i++) {
            indices.push(allposts[i].post_id);
        }
        return indices;
    })(allposts);
    return {
        allposts: allposts,
        usernames: usernames,
        group: group,
        postIndices: postIndices,
        users: users
    };
};
