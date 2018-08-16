"use strict";

module.exports = function dexnsTokenRegistrationForm() {
    return {
        require: "form",
        restrict: "A",
        template: require("./dexns-token-registration.html"),
        link: function linkToken(scope, elem, attrs, form) {
            form.tokenName.$asyncValidators.tokenName = async function(_val) {
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

            form.abi.$validators.abi = function(_val) {
                if (!_val) return true;

                try {
                    return JSON.parse(_val);
                } catch (e) {
                    return false;
                }
            };

            form.tokenNetwork.$validators.tokenNetwork = val => {
                const found = Object.values(nodes.nodeList).find(
                    node => node.type === val
                );

                return Boolean(found);
            };

            form.destination.$validators.destination = _addr =>
                Validator.isValidAddress(_addr);
        }
    };
};
