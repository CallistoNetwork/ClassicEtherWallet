"use strict";

module.exports = function sendTransactionForm() {
    return {
        template: require("./sendTransactionForm.html"),
        restrict: "A",
        require: "form",
        link: function(scope, element, attrs, form) {
            // address field passed into lookup service (async function)

            function validForm() {
                return form.$valid && Validator.isValidAddress(scope.tx.to);
            }

            scope.validForm = validForm;
            form.data.$validators.data = Validator.isValidHex;
            form.gasLimit.$validators.gasLimit = form.value.$validators.value =
                Validator.isPositiveNumber;
        }
    };
};
