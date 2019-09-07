"use strict";

const uniq = require("lodash/uniq");

module.exports = function submitProposal() {
    return {
        template: require("./submitProposal.html"),
        link: function(scope) {
            console.log(scope);
        }
    };
};
