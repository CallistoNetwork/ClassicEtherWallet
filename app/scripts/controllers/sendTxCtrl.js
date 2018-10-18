"use strict";
const etherUnits = require("../etherUnits.js");
const _throttle = require("lodash/throttle");
const BigNumber = require("bignumber.js");

const sendTxCtrl = function($scope, $sce, $rootScope, walletService) {
    const gasPrice = parseFloat(
        globalFuncs.urlGet("gasprice") || globalFuncs.urlGet("gasPrice") || ""
    );

    if (gasPrice) {
        $rootScope.$broadcast("ChangeGas", gasPrice);
    }

    $scope.networks = globalFuncs.networks;

    $scope.ajaxReq = ajaxReq;
    $scope.calculatingSendBalance = false;
    $scope.wd = false;
    $scope.unitReadable = ajaxReq.type;
    $scope.sendTxModal = new Modal(document.getElementById("sendTransaction"));
    walletService.wallet = null;
    walletService.password = "";
    $scope.showAdvance = $scope.showRaw = false;
    $scope.dropdownEnabled = true;
    $scope.Validator = Validator;
    $scope.gasLimitChanged = false;
    $scope.tokenVisibility = "hidden";
    $scope.tokenTx = {
        to: "",
        value: 0,
        id: -1
    };

    $scope.tx = {
        // if there is no gasLimit or gas key in the URI, use the default value. Otherwise use value of gas or gasLimit. gasLimit wins over gas if both present
        gasLimit:
            globalFuncs.urlGet("gaslimit") ||
            globalFuncs.urlGet("gas") ||
            globalFuncs.urlGet("gasLimit") ||
            globalFuncs.defaultTxGasLimit ||
            21,
        data: globalFuncs.urlGet("data") || "",
        to: globalFuncs.urlGet("to") || "",
        unit: "ether",
        sendMode: "ether",
        value: globalFuncs.urlGet("value", "") || "",
        nonce: null,
        gasPrice: null,
        donate: false,
        tokensymbol:
            globalFuncs.urlGet("tokensymbol") ||
            globalFuncs.urlGet("tokenSymbol") ||
            "",
        readOnly: globalFuncs.urlGet("readOnly") === null
    };

    $scope.setSendMode = function(sendMode, tokenId = "", tokensymbol = "") {
        $scope.tx.sendMode = sendMode;
        if (sendMode === "ether") {
            $scope.unitReadable = ajaxReq.type;
        } else if ($scope.tx.sendMode === "token") {
            $scope.unitReadable = tokensymbol;
            $scope.tokenTx.id = tokenId;

            const token = walletService.wallet.tokenObjs.find(
                token =>
                    token.symbol.toLowerCase() === tokensymbol.toLowerCase()
            );

            if (!token) {
                throw new Error("Invalid Request");
            }

            const node = nodes.nodeList[token.node];

            if (!node) {
                throw new Error("Invalid Request");
            }

            const tokenNetwork = node.type;

            if (!(tokenNetwork === ajaxReq.type)) {
                uiFuncs.notifier.warning(
                    "WARNING! You are trying to send " +
                        token.symbol +
                        " token, but this is a token of $" +
                        token.network +
                        " network! Switch to $" +
                        token.network +
                        " node first.",
                    0
                );
            } else {
                $scope.tokenTx.to = token.contractAddress;
                $scope.tokenTx.value = $scope.tx.to || 1;
            }
        } else {
            throw new Error("Unknown tx.sendMode");
        }
        $scope.dropdownAmount = false;
    };

    $scope.$on("ChangeWallet", function() {
        $scope.wd = true;
        $scope.setSendMode("ether");

        if ($scope.parentTxConfig) {
            Object.assign($scope, {
                tx: Object.assign($scope.tx, $scope.parentTxConfig),
                addressDrtv: {
                    ensAddressField: $scope.parentTxConfig.to
                }
            });
        }
    });

    $scope.$on("ChangeNode", function() {
        $scope.setSendMode("ether");
    });

    $scope.throttleEstGasLimit = _throttle(
        () => $scope.estimateGasLimit(),
        500
    );
    $scope.$watch(
        "tx.value",
        function() {
            if (!angular.equals($scope.tx.sendMode, "token")) {
                return;
            }
            if (
                walletService.wallet &&
                walletService.wallet.tokenObjs !== undefined &&
                walletService.wallet.tokenObjs[$scope.tokenTx.id] !==
                    undefined &&
                $scope.Validator.isValidAddress($scope.tokenTx.to) &&
                $scope.Validator.isPositiveNumber($scope.tx.value)
            ) {
                $scope.throttleEstGasLimit();
            }
        },
        true
    );
    $scope.$watch(
        "tx.sendMode",
        function(newValue) {
            $scope.showRaw = false;
            if (angular.equals(newValue, "ether")) {
                $scope.tx.gasLimit = globalFuncs.defaultTxGasLimit || 21000;
            } else if (angular.equals(newValue, "token")) {
                $scope.tokenTx.to = $scope.tx.to;
                $scope.tokenTx.value = $scope.tx.value;
                $scope.tx.gasLimit = globalFuncs.defaultTokenGasLimit || 200000;
                if (
                    Validator.isPositiveNumber($scope.tx.value) &&
                    Validator.isValidAddress($scope.tx.to)
                ) {
                    $scope.throttleEstGasLimit();
                }
            }
        },
        true
    );
    $scope.estimateGasLimit = function() {
        let estObj = {
            from: walletService.wallet.getAddressString(),
            to: null,
            value: null
        };
        if ($scope.tx.sendMode === "ether") {
            Object.assign(estObj, {
                to: $scope.tx.to,
                value: etherUnits.toWei($scope.tx.value, $scope.tx.unit)
            });

            if ($scope.tx.data) {
                estObj.data = ethFuncs.sanitizeHex($scope.tx.data);
            }
        } else if ($scope.tx.sendMode === "token") {
            Object.assign(estObj, $scope.getTokenTxData());
        } else {
            throw new Error("unknown tx.sendMode");
        }
        return uiFuncs
            .estimateGas(estObj)
            .then(function(gasLimit) {
                $scope.$apply(function() {
                    $scope.tx.gasLimit = new BigNumber(gasLimit).toNumber();
                });
            })
            .catch(e => {
                $scope.$apply(function() {
                    $scope.tx.gasLimit = -1;
                });
            });
    };

    $scope.getTokenTxData = function() {
        const token = walletService.wallet.tokenObjs[$scope.tokenTx.id];

        if (!token) {
            throw new Error("Invalid Request");
        }
        let txData = {
            to: token.getContractAddress(),
            value: ethFuncs.sanitizeHex("0")
        };
        const { isError, data } = token.getData($scope.tx.to, $scope.tx.value);

        if (isError) {
            throw new Error("Error Generating token tx");
        }
        txData.data = data;
        // don't send ether w/ token transfer

        Object.assign($scope.tokenTx, txData);

        return txData;
    };

    $scope.generateTx = function() {
        let txData = Object.assign({}, $scope.tx);

        const gasPrice = $scope.tx.gasPrice
            ? "0x" + new BigNumber($scope.tx.gasPrice).toString(16)
            : null;
        const nonce = $scope.tx.nonce
            ? "0x" + new BigNumber($scope.tx.nonce).toString(16)
            : null;

        Object.assign(txData, {
            gasPrice,
            nonce,
            value: $scope.tx.value.toString()
        });

        if ($scope.tx.sendMode === "token") {
            Object.assign(txData, $scope.getTokenTxData());
        }

        const _txData = uiFuncs.getTxData({
            tx: txData,
            wallet: walletService.wallet
        });

        uiFuncs
            .generateTx(_txData)
            .then(function(result) {
                $scope.$apply(function() {
                    $scope.rawTx = result.rawTx;
                    $scope.signedTx = result.signedTx;
                    $scope.showRaw = true;
                });
            })
            .catch(err => {
                uiFuncs.notifier.danger(err);
                $scope.showRaw = false;
            });
    };
    $scope.sendTx = function() {
        $scope.sendTxModal.close();
        uiFuncs.sendTx($scope.signedTx, true).then(function(resp) {
            if ($scope.tx.sendMode === "ether") {
                walletService.wallet.setBalanceOfNetwork();
            } else if ($scope.tx.sendMode === "token") {
                walletService.wallet.tokenObjs[$scope.tokenTx.id].setBalance();
            }
        });
    };
    $scope.transferAllBalance = function() {
        if ($scope.tx.sendMode === "token") {
            $scope.tx.value = new BigNumber(
                walletService.wallet.tokenObjs[$scope.tokenTx.id].getBalance()
            ).toNumber();
        } else {
            $scope.tx.value = null;

            $scope.calculatingSendBalance = true;

            return uiFuncs
                .transferAllBalance(walletService.wallet.getAddressString(), {
                    gasLimit: $scope.tx.gasLimit
                })
                .then(function({ unit, value, nonce, gasPrice }) {
                    const gasPriceGwei = etherUnits.unitToUnit(
                        gasPrice,
                        "wei",
                        "gwei"
                    );

                    Object.assign($scope.tx, { unit, value, nonce, gasPrice });
                    $rootScope.$broadcast(
                        "ChangeGas",
                        new BigNumber(gasPriceGwei).toNumber()
                    );
                })
                .catch(resp => {
                    $scope.showRaw = false;
                    uiFuncs.notifier.danger(resp);
                })
                .finally(() => {
                    $scope.calculatingSendBalance = false;
                });
        }
    };
};
module.exports = sendTxCtrl;
