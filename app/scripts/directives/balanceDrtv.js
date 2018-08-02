'use strict';

var balanceDrtv = function (walletService, $timeout) {
    return {
        restrict: "E",
        template: require('./balanceDrtv.html'),
        link: function (scope) {

            scope.displaySuccess = 0;

            function displaySuccess() {

                scope.displaySuccess = 1;

                $timeout(function () {

                    scope.displaySuccess = 0;
                }, 3000)

            }

            scope.copyToClipboard = function handleCopyToClipboard(elementId) {

                const success = globalFuncs.copyToClipboard(elementId);

                if (success) {

                    displaySuccess();
                }

            }

        }
    }
};
module.exports = balanceDrtv;
