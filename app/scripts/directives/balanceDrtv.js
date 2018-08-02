'use strict';

var balanceDrtv = function (walletService, $timeout) {
    return {
        restrict: "E",
        template: require('./balanceDrtv.html'),
        link: function (scope) {

            scope.displayTime = 0;

            function displaySuccess() {

                scope.displayTime = 1;

                $timeout(function () {

                    scope.displayTime = 0;
                }, 3000)

            }

            scope.copyToClipboard = function copyToClipboard(elementId = 'addr') {

                // Create a "hidden" input
                var aux = document.createElement("input");
                // Assign it the value of the specified element
                aux.setAttribute("value", document.getElementById(elementId).innerHTML);
                // Append it to the body
                document.body.appendChild(aux);
                // Highlight its content
                aux.select();
                // Copy the highlighted text
                const result = document.execCommand("copy");
                // Remove it from the body
                document.body.removeChild(aux);

                if (result) {


                    displaySuccess();
                }

            }
        }

    };
};
module.exports = balanceDrtv;
