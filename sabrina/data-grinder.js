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
    return {
        allposts: allposts,
        usernames: usernames,
        group: group,
        users: users
    };
};
