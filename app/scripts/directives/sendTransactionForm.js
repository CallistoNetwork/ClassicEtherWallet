"use strict";

const BigNumber = require("bignumber.js");
const etherUnits = require("../etherUnits");
const _get = require("lodash/get");

module.exports = function sendTransactionForm(walletService, globalService) {
    return {
        template: require("./sendTransactionForm.html"),
        restrict: "A",
        require: "form",
        link: function(scope, element, attrs, form) {
            Object.assign(scope.tx, { totalTxCost: 0 });

            // address field passed into lookup service and scope not updated

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

                if (globalService.currentTab === globalService.tabs.swap.id) {
                    return true;
                }

                let balance = 0;
                let enoughTokens = true;
                
                balance = new BigNumber(
                        etherUnits.toWei(
                            _get(
                                walletService,
                                `wallet.balances[${ajaxReq.type}].balance`,
                                0
                            ),
                            "ether"
                        )
                );
                if (scope.tx.sendMode === "token") {
                    
                    const tokenBalance = new BigNumber(
                        _get(
                            walletService,
                            `wallet.tokenObjs[${scope.tokenTx.id}].balance`,
                            0
                        )
                    );
                    enoughTokens = new BigNumber(_val.toString()).lte(tokenBalance);
                    _val = 0;
                } else if (scope.tx.sendMode !== "ether") {
                    throw new Error(
                        "Unknown tx.sendMode, must be token / ether"
                    );
                }

                const txCost = new BigNumber(
                    etherUnits.toWei(_val, "ether")
                ).add(etherUnits.toWei(scope.txCostEther, "ether"));

                Object.assign(scope.tx, {
                    totalTxCost: txCost.toString()
                });
                return (txCost.lte(balance) && enoughTokens);
            };
        }
    };
};
