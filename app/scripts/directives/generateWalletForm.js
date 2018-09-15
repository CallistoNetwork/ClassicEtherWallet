"use strict";

module.exports = function generateWalletForm() {
    return {
        template: require("./generateWalletForm.html"),
        restrict: "A",
        require: "form",
        link: function(scope, e, attr, form) {
            form.password.$validators.validPassword = form.password2.$validators.validPassword =
                globalFuncs.isStrongPass;

            form.password2.$validators.matchesPassword = _val =>
                angular.equals(scope.userInput.password, _val);
        }
    };
};
