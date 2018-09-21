"use strict";

module.exports = function txStatus() {
    return {
        template: require("./txStatus.html"),
        controller: "TxStatusController"
    };
};
