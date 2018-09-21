"use strict";

module.exports = function swapOpenOrderForm() {
    const ethCoins = Object.values(nodes.alternativeBalance).map(
        network => network.symbol
    );

    return {
        template: require("./swapOpenOrderForm.html"),
        require: "form",
        link: function(scope, e, attrs, form) {
            form.toAddress.$validators.validAddr = val => {
                const toCoin = scope.swapOrder.toCoin.toUpperCase();

                if (toCoin === "BTC") {
                    return Validator.isValidBTCAddress(val);
                } else if (ethCoins.includes(toCoin)) {
                    return Validator.isValidAddress(val);
                } else {
                    return val;
                }
            };
        }
    };
};
