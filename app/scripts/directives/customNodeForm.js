"use strict";

const _uniqBy = require("lodash/uniqBy");

const _nodes = _uniqBy(Object.values(nodes.nodeList), "type");

module.exports = function customNodeForm() {
    return {
        require: "form",
        template: require("./customNodeForm.html"),
        link: function(scope, e, a, form) {
            scope._nodes = _nodes;

            form.port.$validators.port = val => {
                if (!val) return true;
                return Validator.isPositiveNumber(val);
            };

            form.chainId.$validators.chainId = Validator.isPositiveNumber;

            form.nodeName.$validators.validName = Validator.isAlphaNumericSpace;
        }
    };
};
