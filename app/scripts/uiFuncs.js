'use strict';
var uiFuncs = function () {
}
uiFuncs.getTxData = function ($scope) {
    return {
        to: $scope.tx.to,
        value: $scope.tx.value,
        unit: $scope.tx.unit,
        gasLimit: $scope.tx.gasLimit,
        data: $scope.tx.data,
        from: $scope.wallet.getAddressString(),
        privKey: $scope.wallet.privKey ? $scope.wallet.getPrivateKeyString() : '',
        path: $scope.wallet.getPath(),
        hwType: $scope.wallet.getHWType(),
        hwTransport: $scope.wallet.getHWTransport(),
        //gasPrice: $scope.tx.gasPrice || $scope.tx.gasprice || '',
    };
};


uiFuncs.isTxDataValid = function (txData) {
    if (txData.to !== "0xCONTRACT" && !ethFuncs.validateEtherAddress(txData.to)) throw globalFuncs.errorMsgs[5];
    if (txData.to === "0xCONTRACT") txData.to = '';
    else if (!globalFuncs.isNumeric(txData.value) || parseFloat(txData.value) < 0) throw globalFuncs.errorMsgs[0];
    else if (!globalFuncs.isNumeric(txData.gasLimit) || parseFloat(txData.gasLimit) <= 0) throw globalFuncs.errorMsgs[8];
    else if (!ethFuncs.validateHexString(txData.data)) throw globalFuncs.errorMsgs[9];

    return txData;

}

/*
    there are errors w/ passing 820 as chainId w/ trezor, and signing tx w/ null chainId is ok.



    @param chainId: int. the chainId of tx 1 eth, 8 ubq, 61 etc, 820 clo
    @returns int || null


 */
const removeChainIdIfCLO = (chainId) => parseInt(chainId) === 820 ? null : chainId;


uiFuncs.signTxTrezor = function (rawTx, txData, callback) {
    var localCallback = function (result) {
        if (!result.success) {
            if (callback !== undefined) {
                callback({
                    isError: true,
                    error: result.error
                });
            }
            return;
        }

        rawTx.v = "0x" + ethFuncs.decimalToHex(result.v);
        rawTx.r = "0x" + result.r;
        rawTx.s = "0x" + result.s;
        var eTx = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
        rawTx.isError = false;
        if (callback !== undefined) callback(rawTx);
    }


    const chainId = removeChainIdIfCLO(rawTx.chainId);


    TrezorConnect.signEthereumTx(
        txData.path,
        ethFuncs.getNakedAddress(rawTx.nonce),
        ethFuncs.getNakedAddress(rawTx.gasPrice),
        ethFuncs.getNakedAddress(rawTx.gasLimit),
        ethFuncs.getNakedAddress(rawTx.to),
        ethFuncs.getNakedAddress(rawTx.value),
        ethFuncs.getNakedAddress(rawTx.data),
        chainId, // chain id for EIP-155 - is only used in fw 1.4.2 and newer, older will ignore it
        localCallback
    );
}
uiFuncs.signTxLedger = function (app, eTx, rawTx, txData, old, callback) {


    eTx.raw[6] = Buffer.from([rawTx.chainId]);


    eTx.raw[7] = eTx.raw[8] = 0;


    var toHash = old ? eTx.raw.slice(0, 6) : eTx.raw;
    var txToSign = ethUtil.rlp.encode(toHash);
    var localCallback = function (result, error) {
        if (typeof error != "undefined") {
            error = error.errorCode ? u2f.getErrorByCode(error.errorCode) : error;
            if (callback !== undefined) callback({
                isError: true,
                error: error
            });
            return;
        }
        rawTx.v = "0x" + result['v'];
        rawTx.r = "0x" + result['r'];
        rawTx.s = "0x" + result['s'];
        eTx = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
        rawTx.isError = false;
        if (callback !== undefined) callback(rawTx);
    }
    app.signTransaction(txData.path, txToSign.toString('hex'), localCallback);
}
uiFuncs.signTxDigitalBitbox = function (eTx, rawTx, txData, callback) {
    var localCallback = function (result, error) {
        if (typeof error != "undefined") {
            error = error.errorCode ? u2f.getErrorByCode(error.errorCode) : error;
            if (callback !== undefined) callback({
                isError: true,
                error: error
            });
            return;
        }
        uiFuncs.notifier.info("The transaction was signed but not sent. Click the blue 'Send Transaction' button to continue.");
        rawTx.v = ethFuncs.sanitizeHex(result['v']);
        rawTx.r = ethFuncs.sanitizeHex(result['r']);
        rawTx.s = ethFuncs.sanitizeHex(result['s']);
        var eTx_ = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = ethFuncs.sanitizeHex(eTx_.serialize().toString('hex'));
        rawTx.isError = false;
        if (callback !== undefined) callback(rawTx);
    }
    uiFuncs.notifier.info("Touch the LED for 3 seconds to sign the transaction. Or tap the LED to cancel.");
    var app = new DigitalBitboxEth(txData.hwTransport, '');
    app.signTransaction(txData.path, eTx, localCallback);
}
uiFuncs.trezorUnlockCallback = function (txData, callback) {
    TrezorConnect.open(function (error) {
        if (error) {
            if (callback !== undefined) callback({
                isError: true,
                error: error
            });
        } else {
            txData.trezorUnlocked = true;
            uiFuncs.generateTx(txData, callback);
        }
    });
};


uiFuncs.generateTx = function (txData, callback) {


    txData = uiFuncs.isTxDataValid(txData);


    if (txData.nonce) {

        return genTxWithInfo({
            nonce: txData.nonce,
            isOffline: Boolean(txData.isOffline)
        });

    }


    ajaxReq.getTransactionData(txData.from, function (data) {
        if (data.error) {
            return callback({
                isError: true,
                error: data.error
            });
        }
        data = data.data;
        data.isOffline = Boolean(data.isOffline);
        genTxWithInfo(data);

    });


    function genTxWithInfo(data) {


        const gasPrice = parseFloat(globalFuncs.localStorage.getItem('gasPrice')) || 21;

        var rawTx = {
            nonce: ethFuncs.sanitizeHex(data.nonce),
            gasPrice: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(gasPrice, 'gwei'))),
            gasLimit: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(txData.gasLimit)),
            to: ethFuncs.sanitizeHex(txData.to),
            value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(txData.value, txData.unit))),
            data: ethFuncs.sanitizeHex(txData.data)
        };


        if (ajaxReq.eip155) rawTx.chainId = ajaxReq.chainId;


        var eTx = new ethUtil.Tx(rawTx);


        if (txData.hwType === "ledger") {


            var app = new ledgerEth(txData.hwTransport);
            var EIP155Supported = false;
            var localCallback = function (result, error) {
                if (error) {
                    if (callback) return callback({
                        isError: true,
                        error: error
                    });

                } else if (rawTx.chainId === 820) {

                    EIP155Supported = false;

                } else {

                    var splitVersion = result['version'].split('.');


                    if (parseInt(splitVersion[0]) > 1) {
                        EIP155Supported = true;
                    } else if (parseInt(splitVersion[1]) > 0) {
                        EIP155Supported = true;
                    } else if (parseInt(splitVersion[2]) > 2) {
                        EIP155Supported = true;
                    }

                }


                uiFuncs.signTxLedger(app, eTx, rawTx, txData, !EIP155Supported, callback);
            }
            app.getAppConfiguration(localCallback);
        } else if (txData.hwType === "trezor") {

            // https://github.com/trezor/connect/blob/v4/examples/signtx-ethereum.html

            if (!txData.trezorUnlocked) {

                uiFuncs.trezorUnlockCallback(txData, callback);

            } else {


                uiFuncs.signTxTrezor(rawTx, txData, callback);
            }

        } else if (txData.hwType === "web3") {
            // for web3, we dont actually sign it here
            // instead we put the final params in the "signedTx" field and
            // wait for the confirmation dialogue / sendTx method
            var txParams = Object.assign({from: txData.from}, rawTx)
            rawTx.rawTx = JSON.stringify(rawTx);
            rawTx.signedTx = JSON.stringify(txParams);
            rawTx.isError = false;
            callback(rawTx);
        } else if (txData.hwType === "digitalBitbox") {
            uiFuncs.signTxDigitalBitbox(eTx, rawTx, txData, callback);
        } else {
            eTx.sign(new Buffer(txData.privKey, 'hex'));
            rawTx.rawTx = JSON.stringify(rawTx);
            rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
            rawTx.isError = false;
            if (callback !== undefined) callback(rawTx);
        }
    }


}


function mapTransToWeb3Trans(trans) {


    // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction


    return Object.assign({}, trans, {
        gas: trans.gasLimit,

        // left undefined for a contract-creation transaction
        to: trans.to === "" ? undefined : trans.to,
    });
}


uiFuncs.sendTx = function (signedTx, callback) {
    // check for web3 late signed tx
    if (signedTx.slice(0, 2) !== '0x') {


        let transaction;


        try {

            transaction = mapTransToWeb3Trans(JSON.parse(signedTx));

        } catch (e) {

            handleErr(e);
        }


        web3.eth.sendTransaction(transaction, function (err, txHash) {
            if (err) {

                handleErr(err);
            } else {

                callback({data: txHash})
            }
        });


    } else {

        ajaxReq.sendRawTx(signedTx, function (data) {
            var resp = {};
            if (data.error) {
                resp = {
                    isError: true,
                    error: data.msg
                };
            } else {
                resp = {
                    isError: false,
                    data: data.data
                };
            }
            if (callback !== undefined) callback(resp);
        });
    }


    function handleErr(err) {
        return callback({
            isError: true,
            error: err.stack,
        })
    }


}
uiFuncs.transferAllBalance = function (fromAdd, gasLimit, callback) {
    try {
        ajaxReq.getTransactionData(fromAdd, function (data) {
            if (data.error) throw data.msg;
            data = data.data;
            var gasPrice = new BigNumber(ethFuncs.sanitizeHex(ethFuncs.addTinyMoreToGas(data.gasprice))).times(gasLimit);
            var maxVal = new BigNumber(data.balance).minus(gasPrice);
            maxVal = etherUnits.toEther(maxVal, 'wei') < 0 ? 0 : etherUnits.toEther(maxVal, 'wei');
            if (callback !== undefined) callback({
                isError: false,
                unit: "ether",
                value: maxVal
            });
        });
    } catch (e) {
        if (callback !== undefined) callback({
            isError: true,
            error: e
        });
    }
}
uiFuncs.notifier = {
    alerts: {},
    warning: function (msg, duration = 5000) {
        this.addAlert("warning", msg, duration);
    },
    info: function (msg, duration = 5000) {
        this.addAlert("info", msg, duration);
    },
    danger: function (msg, duration = 7000) {
        msg = msg.message ? msg.message : msg;
        // Danger messages can be translated based on the type of node
        msg = globalFuncs.getEthNodeMsg(msg);
        this.addAlert("danger", msg, duration);
    },
    success: function (msg, duration = 5000) {
        this.addAlert("success", msg, duration);
    },
    addAlert: function (type, msg, duration) {
        if (duration == undefined) duration = 7000;
        // Save all messages by unique id for removal
        var id = Date.now();
        alert = this.buildAlert(id, type, msg);
        this.alerts[id] = alert
        var that = this;
        if (duration > 0) { // Support permanent messages
            setTimeout(alert.close, duration);
        }
        if (!this.scope.$$phase) this.scope.$apply();
    },
    buildAlert: function (id, type, msg) {
        var that = this;
        return {
            show: true,
            type: type,
            message: msg,
            close: function () {
                delete that.alerts[id];
                if (!that.scope.$$phase) that.scope.$apply();
            }
        }
    },
}
module.exports = uiFuncs;
