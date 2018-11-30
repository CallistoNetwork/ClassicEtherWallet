"use strict";

module.exports = function accountInfo() {
    return {
        restrict: "E",
        template: require("./accountInfo.html"),
        link: function($scope) {}
    };
};
