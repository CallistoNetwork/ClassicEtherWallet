"use strict";
const etherUnits = require("../etherUnits.js");

const sendTxCtrl = function($scope, $sce, $rootScope, walletService) {
    const gasPrice = parseFloat(
        globalFuncs.urlGet("gasprice") || globalFuncs.urlGet("gasPrice") || ""
    );

    if (gasPrice) {
        $rootScope.$broadcast("ChangeGas", gasPrice);
    }

    $scope.networks = globalFuncs.networks;

    $scope.ajaxReq = ajaxReq;

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
            globalFuncs.defaultTxGasLimit,
        data: globalFuncs.urlGet("data") || "",
        to: globalFuncs.urlGet("to") || "",
        unit: "ether",
        sendMode: "ether",
        value: globalFuncs.urlGet("value", ""),
        nonce: null,
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
        } else {
            $scope.unitReadable = tokensymbol;
            $scope.tokenTx.id = tokenId;
        }
        //console.log($scope.tx.sendMode);
        if ($scope.tx.sendMode === "token") {
            for (var i = 0; i < walletService.wallet.tokenObjs.length; i++) {
                if (
                    walletService.wallet.tokenObjs[i].symbol
                        .toLowerCase()
                        .indexOf(tokensymbol.toLowerCase()) !== -1
                ) {
                    //console.log(walletService.wallet.tokenObjs[i].network);
                    if (
                        walletService.wallet.tokenObjs[i].network &&
                        walletService.wallet.tokenObjs[i].network !==
                            ajaxReq.type
                    ) {
                        // console.log(ajaxReq.type);
                        $scope.notifier.warning(
                            "WARNING! You are trying to send " +
                                walletService.wallet.tokenObjs[i].symbol +
                                " token, but this is a token of $" +
                                walletService.wallet.tokenObjs[i].network +
                                " network! Switch to $" +
                                walletService.wallet.tokenObjs[i].network +
                                " node first.",
                            0
                        );
                    } else {
                        $scope.tokenTx.to =
                            walletService.wallet.tokenObjs[i].contractAddress;
                        $scope.tokenTx.value = $scope.tx.to || 1;
                    }
                    break;
                }
            }
        }
        $scope.dropdownAmount = false;
    };

    $scope.$on("ChangeWallet", function() {
        $scope.wd = true;
        $scope.setSendMode("ether");

        if ($scope.parentTxConfig) {
            Object.assign($scope.tx, $scope.parentTxConfig);
            $scope.addressDrtv.ensAddressField = $scope.parentTxConfig.to;
            $scope.$watch(
                "parentTxConfig",
                function() {
                    Object.assign($scope.tx, $scope.parentTxConfig);
                },
                true
            );
        }
    });

    $scope.$on("ChangeNode", function() {
        if (walletService.wallet) {
            $scope.setSendMode("ether");
        }
    });

    $scope.$watch(
        "tokenTx",
        function() {
            if (
                walletService.wallet &&
                walletService.wallet.tokenObjs !== undefined &&
                walletService.wallet.tokenObjs[$scope.tokenTx.id] !==
                    undefined &&
                $scope.Validator.isValidAddress($scope.tokenTx.to) &&
                $scope.Validator.isPositiveNumber($scope.tokenTx.value)
            ) {
                if ($scope.estimateTimer) clearTimeout($scope.estimateTimer);
                $scope.estimateTimer = setTimeout(function() {
                    $scope.estimateGasLimit();
                }, 500);
            }
        },
        true
    );
    $scope.$watch(
        "tx.sendMode",
        function(newValue, oldValue) {
            $scope.showRaw = false;
            if (
                !angular.equals(newValue, oldValue) &&
                angular.equals(newValue, "ether")
            ) {
                $scope.tx.data = globalFuncs.urlGet("data", "");
                $scope.tx.gasLimit = globalFuncs.defaultTxGasLimit;
            }

            if ($scope.tx.sendMode === "token") {
                $scope.tokenTx.to = $scope.tx.to;
                $scope.tokenTx.value = $scope.tx.value;
            }
        },
        true
    );
    $scope.estimateGasLimit = function() {
        if ($scope.gasLimitChanged) return;

        var estObj = {
            to: $scope.tx.to,
            from: walletService.wallet.getAddressString(),
            value: etherUnits.toWei($scope.tx.value, $scope.tx.unit)
        };
        if ($scope.tx.data !== "")
            estObj.data = ethFuncs.sanitizeHex($scope.tx.data);
        if ($scope.tx.sendMode === "token") {
            estObj.to = walletService.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getContractAddress();
            estObj.data = walletService.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getData($scope.tokenTx.to, $scope.tokenTx.value).data;
            estObj.value = "0x00";
        }
        ethFuncs
            .estimateGas(estObj)
            .then(function(gasLimit) {
                $scope.tx.gasLimit = gasLimit;
            })
            .catch(e => ($scope.tx.gasLimit = -1));
    };
    var isEnough = function(valA, valB) {
        return new BigNumber(valA).lte(new BigNumber(valB));
    };
    $scope.hasEnoughBalance = function() {
        if (!$scope.tx.value) {
            return false;
        }
        return isEnough(
            $scope.tx.value,
            walletService.wallet.balances[ajaxReq.type].balance
        );
    };
    $scope.onDonateClick = function() {
        $scope.addressDrtv.ensAddressField = globalFuncs.donateAddress;
        $scope.tx.value = "1";
        $scope.tx.donate = true;
    };
    $scope.generateTx = function() {
        const txData = uiFuncs.getTxData({
            tx: $scope.tx,
            wallet: walletService.wallet
        });
        txData.gasPrice = $scope.tx.gasPrice
            ? "0x" + new BigNumber($scope.tx.gasPrice).toString(16)
            : null;
        txData.nonce = $scope.tx.nonce
            ? "0x" + new BigNumber($scope.tx.nonce).toString(16)
            : null;

        // set to true for offline tab and txstatus tab
        // on sendtx tab, it pulls gas price from the gasprice slider & nonce
        // if its true the whole txData object is set - don't try to change it
        // if false, replace gas price and nonce. gas price from slider. nonce from server.
        if (txData.gasPrice && txData.nonce) txData.isOffline = true;

        if ($scope.tx.sendMode === "token") {
            // if the amount of tokens you are trying to send > tokens you have, throw error
            if (
                !isEnough(
                    $scope.tx.value,
                    walletService.wallet.tokenObjs[$scope.tokenTx.id].balance
                )
            ) {
                $scope.notifier.danger(globalFuncs.errorMsgs[0]);
                return;
            }
            txData.to = walletService.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getContractAddress();
            txData.data = walletService.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getData($scope.tokenTx.to, $scope.tokenTx.value).data;
            txData.value = "0x00";
        } else {
            uiFuncs
                .generateTx(txData)
                .then(function(rawTx) {
                    $scope.rawTx = rawTx.rawTx;
                    $scope.signedTx = rawTx.signedTx;
                    $scope.showRaw = true;
                    if (!$scope.$$phase) $scope.$apply();
                })
                .catch(err => {
                    uiFuncs.notifier.danger(err);
                    $scope.showRaw = false;
                });
        }
    };
    $scope.sendTx = function() {
        $scope.sendTxModal.close();
        uiFuncs.sendTx($scope.signedTx, true).then(function(resp) {
            walletService.wallet.setBalanceOfNetwork();
            if ($scope.tx.sendMode === "token")
                walletService.wallet.tokenObjs[$scope.tokenTx.id].setBalance();
        });
    };
    $scope.transferAllBalance = function() {
        if ($scope.tx.sendMode === "token") {
            $scope.tx.value = walletService.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getBalance();
        } else {
            uiFuncs
                .transferAllBalance(
                    walletService.wallet.getAddressString(),
                    $scope.tx.gasLimit
                )
                .then(function(resp) {
                    $scope.tx.unit = resp.unit;
                    $scope.tx.value = Number(resp.value);
                })
                .catch(resp => {
                    $scope.showRaw = false;
                    $scope.notifier.danger(resp.error);
                });
        }
    };
};
module.exports = sendTxCtrl;
