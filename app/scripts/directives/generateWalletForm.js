"use strict";

module.exports = function() {
    return {
        template: require("./generateWalletForm.html"),
        restrict: "A",
        require: "form",
        link: function(scope, e, attr, form) {
            form.password.$validators.validPassword = globalFuncs.isStrongPass;

            form.password2.$validators.matchesPassword = _val =>
                angular.equals(scope.userInupt.password, _val);
        }
    };
};
