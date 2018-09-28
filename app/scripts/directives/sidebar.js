"use strict";

module.exports = function sidebar($timeout) {
    return {
        restrict: "E",
        template: require("./sidebar.html"),
        controller: "walletBalanceCtrl",
        link: function(scope) {
            scope.displaySuccess = 0;

            scope.notAjaxReq = item =>
                item.symbol.toUpperCase() !== ajaxReq.type.toUpperCase();

            scope.toArray = obj => Object.values(obj);

            function displaySuccess() {
                scope.displaySuccess = 1;

                $timeout(function() {
                    scope.displaySuccess = 0;
                }, 3000);
            }

            scope.copyToClipboard = function handleCopyToClipboard(elementId) {
                const success = globalFuncs.copyToClipboard(elementId);

                if (success) {
                    displaySuccess();
                }
            };
        }
    };
};
