"use strict";

module.exports = function tokenBalances() {
    return {
        restrict: "E",
        template: require("./tokenBalances.html"),
        link: function($scope) {}
    };
};
