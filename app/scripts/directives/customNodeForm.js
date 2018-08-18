"use strict";

module.exports = function customNodeForm() {
    return {
        require: "form",
        template: require("./customNodeForm.html"),
        link: function(scope, e, a, form) {
            form.port.$validators.port = val => {
                if (!val) return true;
                return Validator.isPositiveNumber(val);
            };

            form.chainId.$validators.chainId = Validator.isPositiveNumber;
        }
    };
};
