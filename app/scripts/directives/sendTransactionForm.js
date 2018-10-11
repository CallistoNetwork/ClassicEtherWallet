"use strict";

const BigNumber = require("bignumber.js");
const etherUnits = require("../etherUnits");

module.exports = function sendTransactionForm(walletService) {
    return {
        template: require("./sendTransactionForm.html"),
        restrict: "A",
        require: "form",
        link: function(scope, element, attrs, form) {
            Object.assign(scope.tx, { totalTxCost: 0 });

            // address field passed into lookup service (async function)

            function validForm() {
                return form.$valid && Validator.isValidAddress(scope.tx.to);
            }

            scope.validForm = validForm;
            form.data.$validators.data = val => {
                if (!val) return true;
                return Validator.isValidHex(val);
            };
            form.gasLimit.$validators.gasLimit = form.value.$validators.value =
                Validator.isPositiveNumber;

            form.value.$validators.enoughBalance = _val => {
                if (!_val) return true;
                const txCost = new BigNumber(
                    etherUnits.toWei(_val, "ether")
                ).add(etherUnits.toWei(scope.txCostEther, "ether"));
                const _balance = new BigNumber(
                    etherUnits.toWei(
                        walletService.wallet.balances[ajaxReq.type].balance,
                        "ether"
                    )
                );

                Object.assign(scope.tx, {
                    totalTxCost: txCost.toString()
                });

                return txCost.lt(_balance);
            };
        }
    };
};
