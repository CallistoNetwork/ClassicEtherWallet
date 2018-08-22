"use strict";
var sendTxCtrl = function($scope, $sce, $rootScope, walletService) {
    const gasPrice = parseFloat(
        globalFuncs.urlGet("gasprice") || globalFuncs.urlGet("gasPrice") || ""
    );

    if (gasPrice) {
        $rootScope.$broadcast("ChangeGas", gasPrice);
    }

    $scope.networks = globalFuncs.networks;

    $scope.ajaxReq = ajaxReq;

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
    $scope.customGasMsg = "";

    $scope.customGas = CustomGasMessages;

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
        $scope.unitReadable = "";
        if (globalFuncs.urlGet("tokensymbol") != null) {
            $scope.unitReadable = $scope.tx.tokensymbol;
            $scope.tx.sendMode = "token";
        } else if (sendMode == "ether") {
            $scope.unitReadable = ajaxReq.type;
        } else {
            $scope.unitReadable = tokensymbol;
            $scope.tokenTx.id = tokenId;
        }
        //console.log($scope.tx.sendMode);
        if ($scope.tx.sendMode == "token") {
            for (var i = 0; i < $scope.wallet.tokenObjs.length; i++) {
                if (
                    $scope.wallet.tokenObjs[i].symbol
                        .toLowerCase()
                        .indexOf(tokensymbol.toLowerCase()) !== -1
                ) {
                    //console.log($scope.wallet.tokenObjs[i].network);
                    if (
                        $scope.wallet.tokenObjs[i].network &&
                        $scope.wallet.tokenObjs[i].network != ajaxReq.type
                    ) {
                        console.log(ajaxReq.type);
                        $scope.notifier.warning(
                            "WARNING! You are trying to send " +
                                $scope.wallet.tokenObjs[i].symbol +
                                " token, but this is a token of $" +
                                $scope.wallet.tokenObjs[i].network +
                                " network! Switch to $" +
                                $scope.wallet.tokenObjs[i].network +
                                " node first.",
                            0
                        );
                    }
                    break;
                }
            }
        }
        $scope.dropdownAmount = false;
    };
    $scope.setTokenSendMode = function() {
        if ($scope.tx.sendMode == "token" && !$scope.tx.tokensymbol) {
            $scope.tx.tokensymbol = $scope.wallet.tokenObjs[0].symbol;
            $scope.wallet.tokenObjs[0].type = "custom";
            $scope.setSendMode($scope.tx.sendMode, 0, $scope.tx.tokensymbol);
        } else if ($scope.tx.tokensymbol) {
            for (var i = 0; i < $scope.wallet.tokenObjs.length; i++) {
                if (
                    $scope.wallet.tokenObjs[i].symbol
                        .toLowerCase()
                        .indexOf($scope.tx.tokensymbol.toLowerCase()) !== -1
                ) {
                    $scope.wallet.tokenObjs[i].type = "custom";
                    //$scope.ChangeNode
                    $scope.setSendMode(
                        "token",
                        i,
                        $scope.wallet.tokenObjs[i].symbol
                    );
                    break;
                } else $scope.tokenTx.id = -1;
            }
        }
        if ($scope.tx.sendMode != "token") $scope.tokenTx.id = -1;
    };
    var applyScope = function() {
        if (!$scope.$$phase) $scope.$apply();
    };
    var defaultInit = function() {
        globalFuncs.urlGet("sendMode") == null
            ? $scope.setSendMode("ether")
            : $scope.setSendMode(globalFuncs.urlGet("sendMode"));
        $scope.gasLimitChanged =
            globalFuncs.urlGet("gaslimit") != null ? true : false;
        $scope.showAdvance =
            globalFuncs.urlGet("gaslimit") != null ||
            globalFuncs.urlGet("gas") != null ||
            globalFuncs.urlGet("data") != null;
        if (
            globalFuncs.urlGet("data") ||
            globalFuncs.urlGet("value") ||
            globalFuncs.urlGet("to") ||
            globalFuncs.urlGet("gaslimit") ||
            globalFuncs.urlGet("sendMode") ||
            globalFuncs.urlGet("gas") ||
            globalFuncs.urlGet("tokensymbol")
        )
            $scope.hasQueryString = true; // if there is a query string, show an warning at top of page
    };
    $scope.$watch(
        function() {
            if (walletService.wallet == null) return null;
            return walletService.wallet.getAddressString();
        },
        function() {
            if (walletService.wallet == null) return;
            $scope.wallet = walletService.wallet;
            $scope.wd = true;

            if ($scope.parentTxConfig) {
                var setTxObj = function() {
                    Object.assign($scope.tx, $scope.parentTxConfig);

                    $scope.addressDrtv.ensAddressField =
                        $scope.parentTxConfig.to;
                    if ($scope.parentTxConfig.gasLimit) {
                        $scope.tx.gasLimit = $scope.parentTxConfig.gasLimit;
                        $scope.gasLimitChanged = true;
                    }
                };
                $scope.$watch(
                    "parentTxConfig",
                    function() {
                        setTxObj();
                    },
                    true
                );

                setTxObj();
            }

            $scope.wallet.setBalance(applyScope);
            $scope.wallet.setTokens();

            $scope.setTokenSendMode();
            defaultInit();
        }
    );
    $scope.$watch("ajaxReq.key", function() {
        if ($scope.wallet) {
            $scope.setSendMode("ether");
            $scope.wallet.setBalance(applyScope);
            $scope.wallet.setTokens();
        }
    });
    $scope.$watch(
        "tokenTx",
        function() {
            if (
                $scope.wallet &&
                $scope.wallet.tokenObjs !== undefined &&
                $scope.wallet.tokenObjs[$scope.tokenTx.id] !== undefined &&
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
        "tx",
        function(newValue, oldValue) {
            $scope.showRaw = false;
            if (
                oldValue.sendMode &&
                oldValue.sendMode != newValue.sendMode &&
                newValue.sendMode === "ether"
            ) {
                $scope.tx.data =
                    globalFuncs.urlGet("data") == null
                        ? ""
                        : globalFuncs.urlGet("data");
                $scope.tx.gasLimit = globalFuncs.defaultTxGasLimit;
            }

            if ($scope.tx.sendMode === "token") {
                $scope.tokenTx.to = $scope.tx.to;
                $scope.tokenTx.value = $scope.tx.value;
            }
            if (newValue.to !== oldValue.to) {
                for (var i in $scope.customGas) {
                    if (
                        $scope.tx.to.toLowerCase() ===
                        $scope.customGas[i].to.toLowerCase()
                    ) {
                        $scope.customGasMsg =
                            $scope.customGas[i].msg !== ""
                                ? $scope.customGas[i].msg
                                : "";
                        return;
                    }
                }

                $scope.customGasMsg = "";
            }
        },
        true
    );
    $scope.estimateGasLimit = function() {
        $scope.customGasMsg = "";
        if ($scope.gasLimitChanged) return;
        for (var i in $scope.customGas) {
            if (
                $scope.tx.to.toLowerCase() ==
                $scope.customGas[i].to.toLowerCase()
            ) {
                $scope.showAdvance =
                    $scope.customGas[i].data != "" ? true : false;
                $scope.tx.gasLimit = $scope.customGas[i].gasLimit;
                $scope.tx.data = $scope.customGas[i].data;
                $scope.customGasMsg =
                    $scope.customGas[i].msg != ""
                        ? $scope.customGas[i].msg
                        : "";
                return;
            }
        }
        if (globalFuncs.lightMode) {
            $scope.tx.gasLimit = globalFuncs.defaultTokenGasLimit;
            return;
        }
        var estObj = {
            to: $scope.tx.to,
            from: $scope.wallet.getAddressString(),
            value: etherUnits.toWei($scope.tx.value, $scope.tx.unit)
        };
        if ($scope.tx.data !== "")
            estObj.data = ethFuncs.sanitizeHex($scope.tx.data);
        if ($scope.tx.sendMode === "token") {
            estObj.to = $scope.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getContractAddress();
            estObj.data = $scope.wallet.tokenObjs[$scope.tokenTx.id].getData(
                $scope.tokenTx.to,
                $scope.tokenTx.value
            ).data;
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
        if ($scope.wallet.balance === "loading") {
            return true;
        } else if (!$scope.tx.value) {
            return true;
        }
        return isEnough($scope.tx.value, $scope.wallet.balance);
    };
    $scope.onDonateClick = function() {
        $scope.addressDrtv.ensAddressField = globalFuncs.donateAddress;
        $scope.tx.value = "1";
        $scope.tx.donate = true;
    };
    $scope.generateTx = function() {
        if (!$scope.Validator.isValidAddress($scope.tx.to)) {
            $scope.notifier.danger(globalFuncs.errorMsgs[5]);
            return;
        }
        var txData = uiFuncs.getTxData({
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
                    $scope.wallet.tokenObjs[$scope.tokenTx.id].balance
                )
            ) {
                $scope.notifier.danger(globalFuncs.errorMsgs[0]);
                return;
            }
            txData.to = $scope.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getContractAddress();
            txData.data = $scope.wallet.tokenObjs[$scope.tokenTx.id].getData(
                $scope.tokenTx.to,
                $scope.tokenTx.value
            ).data;
            txData.value = "0x00";
        }
        uiFuncs
            .generateTx(txData)
            .then(function(rawTx) {
                $scope.rawTx = rawTx.rawTx;
                $scope.signedTx = rawTx.signedTx;
                $scope.showRaw = true;
                if (!$scope.$$phase) $scope.$apply();
            })
            .catch(err => {
                $scope.showRaw = false;
            });
    };
    $scope.sendTx = function() {
        $scope.sendTxModal.close();
        uiFuncs.sendTx($scope.signedTx).then(function(resp) {
            $scope.wallet.setBalance(applyScope);
            if ($scope.tx.sendMode === "token")
                $scope.wallet.tokenObjs[$scope.tokenTx.id].setBalance();
        });
    };
    $scope.transferAllBalance = function() {
        if ($scope.tx.sendMode != "token") {
            uiFuncs.transferAllBalance(
                $scope.wallet.getAddressString(),
                $scope.tx.gasLimit,
                function(resp) {
                    if (!resp.isError) {
                        $scope.tx.unit = resp.unit;
                        $scope.tx.value = resp.value;
                    } else {
                        $scope.showRaw = false;
                        $scope.notifier.danger(resp.error);
                    }
                }
            );
        } else {
            $scope.tx.value = $scope.wallet.tokenObjs[
                $scope.tokenTx.id
            ].getBalance();
        }
    };
};
module.exports = sendTxCtrl;
