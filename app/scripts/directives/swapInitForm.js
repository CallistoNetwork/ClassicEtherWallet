"use strict";

module.exports = function swapInitForm() {
    return {
        template: require("./swapInitForm.html"),
        require: "form",
        link: function(scope, e, attrs, form) {
            form.fromVal.$validators.validValue = form.toVal.$validators.validValue =
                Validator.isPositiveNumber;
        }
    };
};
