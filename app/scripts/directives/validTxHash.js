"use strict";

const requiredParams = [
    "gas",
    "gasPrice",
    "blockNumber",
    "hash",
    "value",
    "from",
    "to",
    "input",
    "nonce"
];

module.exports = function validTxHash() {
    return {
        require: "ngModel",
        link: function($scope, element, attr, mCtrl) {
            function validateTxHash(value) {
                if (value.length < 2) {
                    mCtrl.$setValidity("validHash", false);
                } else if (Validator.isValidTxHash(value)) {
                    mCtrl.$setValidity("validHash", true);
                } else {
                    mCtrl.$setValidity("validHash", false);
                }
                return value;
            }

            mCtrl.$parsers.push(validateTxHash);

            mCtrl.$asyncValidators.validTx = checkTxStatus;

            function checkTxStatus(hash) {
                return new Promise((resolve, reject) => {
                    if (!Validator.isValidTxHash(hash)) {
                        uiFuncs.notifier.danger(globalFuncs.errorMsgs[36]);
                    } else {
                        ajaxReq.getTransaction(hash, function(data) {
                            if (data.error || !data.data) {
                                reject(false);
                            } else if (
                                !requiredParams.every(i =>
                                    data.data.hasOwnProperty(i)
                                )
                            ) {
                                uiFuncs.notifier.danger("Invalid Request");
                                reject(false);
                            } else {
                                $scope.mapTxToScope(data.data);
                                resolve(true);
                            }
                        });
                    }
                });
            }
        }
    };
};
