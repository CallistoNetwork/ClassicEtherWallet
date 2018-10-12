"use strict";

module.exports = function tokenBalances() {
    return {
        restrict: "E",
        template: require("./tokenBalances.html"),
        link: function($scope) {
            $scope.balanceFilter = function(token) {
                return 0 < token.balance;
            };
        }
    };
};
