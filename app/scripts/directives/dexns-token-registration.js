"use strict";

module.exports = function dexnsTokenRegistrationForm() {
    return {
        require: "form",
        restrict: "E",
        template: require("./dexns-token-registration.html"),
        link: function linkToken(scope, elem, attrs, form) {
            const { tokenRegistration } = form;

            tokenRegistration.tokenName.$asyncValidators.tokenName = async function(
                _val
            ) {
                let result = false;
                if (_val) {
                    const { available } = await scope.checkDexNSName(_val);

                    result = available;
                }
                if (result) {
                    return Promise.resolve(result);
                }
                return Promise.reject(result);
            };

            tokenRegistration.abi.$validators.abi = function(_val) {
                if (!_val) return true;

                try {
                    return JSON.parse(_val);
                } catch (e) {
                    return false;
                }
            };

            tokenRegistration.destination.$validators.destination = function(
                _val
            ) {
                return Validator.isValidAddress(_val);
            };
        }
    };
};
