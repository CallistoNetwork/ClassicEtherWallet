'use strict';
var uiFuncs = function () {
}
uiFuncs.getTxData = function ({tx, wallet}) {
    return {
        to: tx.to,
        value: tx.value,
        unit: tx.unit,
        gasLimit: tx.gasLimit,
        data: tx.data,
        from: wallet.getAddressString(),
        privKey: wallet.privKey ? wallet.getPrivateKeyString() : '',
        path: wallet.getPath(),
        hwType: wallet.getHWType(),
        hwTransport: wallet.getHWTransport(),
        gasPrice: globalFuncs.localStorage.getItem('gasPrice', 21)
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

/*


    Generates tx data over defined network
 */
uiFuncs.generateTx = function (txData, callback) {


    txData = uiFuncs.isTxDataValid(txData);


    if (txData.nonce) {

        return uiFuncs.genTxWithInfo(txData);

    } else {


        ajaxReq.getTransactionData(txData.from, function (data) {
            if (data.error) {
                callback({
                    isError: true,
                    error: data.error
                });
            } else {

                Object.assign(txData, {isOffline: Boolean(data.isOffline), nonce: data.data.nonce});

                uiFuncs.genTxWithInfo(txData, callback);
            }


        });


    }


}

uiFuncs.genTxWithInfo = function (data, callback) {


    const gasPrice = parseFloat(globalFuncs.localStorage.getItem('gasPrice')) || 21;

    const rawTx = {
        nonce: ethFuncs.sanitizeHex(data.nonce),
        gasPrice: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(gasPrice, 'gwei'))),
        gasLimit: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(data.gasLimit)),
        to: ethFuncs.sanitizeHex(data.to),
        value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(data.value, data.unit))),
        data: ethFuncs.sanitizeHex(data.data)
    };

    // if sending tx to contract, include eip155 and chainId

    if (data.eip155 && data.chainId) {

        rawTx.chainId = data.chainId;

        // default to ajaxReq

    } else if (ajaxReq.eip155) {

        rawTx.chainId = ajaxReq.chainId;
    }


    const eTx = new ethUtil.Tx(rawTx);


    if (data.hwType === "ledger") {


        var app = new ledgerEth(data.hwTransport);
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


            uiFuncs.signTxLedger(app, eTx, rawTx, data, !EIP155Supported, callback);
        }
        app.getAppConfiguration(localCallback);
    } else if (data.hwType === "trezor") {

        // https://github.com/trezor/connect/blob/v4/examples/signtx-ethereum.html

        if (!data.trezorUnlocked) {

            uiFuncs.trezorUnlockCallback(data, callback);

        } else {


            uiFuncs.signTxTrezor(rawTx, data, callback);
        }

    } else if (data.hwType === "web3") {
        // for web3, we dont actually sign it here
        // instead we put the final params in the "signedTx" field and
        // wait for the confirmation dialogue / sendTx method
        var txParams = Object.assign({from: data.from}, rawTx)
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = JSON.stringify(txParams);
        rawTx.isError = false;
        callback(rawTx);
    } else if (data.hwType === "digitalBitbox") {
        uiFuncs.signTxDigitalBitbox(eTx, rawTx, data, callback);
    } else {
        eTx.sign(new Buffer(data.privKey, 'hex'));
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = '0x' + eTx.serialize().toString('hex');
        rawTx.isError = false;
        if (callback !== undefined) callback(rawTx);
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

    // web3 transaction can be a string that starts w/ quotes or object


    if (typeof signedTx === 'string' && signedTx.slice(0, 2) === '0x') {


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


    } else {


        var cb_ = function (err, txHash) {
            if (err) {

                handleErr(err);
            } else {

                callback({data: txHash})
            }
        };


        uiFuncs.handleWeb3Trans(signedTx, cb_);


    }


    function handleErr(err) {
        return callback({
            isError: true,
            error: err.stack,
        })
    }


}

uiFuncs.handleWeb3Trans = function (signedTx, cb_) {

    let transaction;


    try {

        // when sending tx, web3 tx comes in as string or object

        const _signedTx = typeof signedTx === 'string' ? JSON.parse(signedTx) : signedTx;

        transaction = mapTransToWeb3Trans(_signedTx);

    } catch (e) {

        cb_(e);
    }
    web3.eth.sendTransaction(transaction, cb_);
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
};


/*

    gen tx w/ contract

    @param: funcName: string
    @param: contract Contract
    @param wallet Wallet
    @param tx Tx

    @returns: Promise<tx|Error>


 */

uiFuncs.genTxContract = function (
    funcName,
    contract,
    wallet,
    {network = ajaxReq.type, inputs = null, from = null, value = 0, unit = 'ether'} = {}) {


    return new Promise((resolve, reject) => {


            const tx = {network, inputs, from, value, unit};

            const _func = contract.abi.find(i => i.name === funcName);

            if (!_func) {


                reject(new Error('Invalid Request'));
            }


            const funcSig = ethFuncs.getFunctionSignature(ethUtil.solidityUtils.transformToFullName(_func));


            const tx_data = ethFuncs.sanitizeHex(funcSig + ethUtil.solidityCoder.encodeParams(
                _func.inputs.map(i => i.type),
                tx.inputs,
            ));


            Object.assign(tx, {data: tx_data});


            ethFuncs.estGasContract(funcName, contract, tx)
                .then(result => {

                    Object.assign(tx, result, {value: etherUnits.toEther(tx.value, tx.unit), unit: 'ether'});


                    // gen tx data from tx and wallet

                    genTx(tx, wallet)
                        .catch(error => {
                            uiFuncs.notifier.danger(error && error.msg || 'error generating tx');

                            reject(false);

                        })
                        .then(rawTx => {

                            if (!rawTx) {

                                reject(false);
                            } else {


                                resolve(Object.assign(tx, rawTx));

                            }


                        })


                }).catch(error => {
                uiFuncs.notifier.danger(error.msg);

                reject(error);
            });

        }
    );


    /*
      get tx data from network

      generate tx

      @returns Promise<tx> signed

   */
    function genTx(tx, wallet) {

        return new Promise((resolve, reject) => {

            const {chainId, eip155, lib} = contract.node;


            lib.getTransactionData(tx.from, function (data) {
                if (data.error) {
                    reject({
                        isError: true,
                        error: data.error
                    });
                } else {


                    //const {address, balance, gasprice, nonce} = data.data;

                    const {nonce} = data.data;


                    // wallet and tx must be combined parameters to work
                    uiFuncs.genTxWithInfo(Object.assign({}, tx, wallet, {nonce, chainId, eip155}), function (result) {

                        if (result.error) {

                            reject(result);
                        } else {

                            resolve(result);
                        }
                    });
                }

            })
        })
    }
}


/*

send tx to contract

    @param: {node, network} contract Contract


    @param tx Tx

    @returns: Promise<tx|Error>
 */
uiFuncs.sendTxContract = function ({node, network}, tx) {

    return new Promise((resolve, reject) => {
        if (typeof tx.signedTx === 'string' && tx.signedTx.slice(0, 2) === '0x') {


            node.lib.sendRawTx(tx.signedTx, (resp) => {
                if (!resp.isError) {
                    const bExStr = node.type !== nodes.nodeTypes.Custom ? "<a href='" + node.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                    const contractAddr = tx.to ? " & Contract Address <a href='" + node.blockExplorerAddr.replace('[[address]]', tx.to) + "' target='_blank' rel='noopener'>" + tx.to + "</a>" : '';
                    uiFuncs.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);

                    resolve(Object.assign(Object.assign({}, tx, resp.data)));

                } else {


                    let response = resp.error;


                    // if (resp.error.includes('Insufficient funds')) {
                    //
                    //
                    //     response = globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type);
                    //
                    //
                    // }

                    uiFuncs.notifier.danger(response);

                    reject(false);
                }
            })
        } else {

            // send tx via web3

            uiFuncs.handleWeb3Trans(tx.signedTx, function (err, result) {


                if (err) {

                    const {message, stack} = err;


                    //
                    // if (message.includes('Insufficient funds')) {
                    //
                    //
                    //     response = globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type);
                    //
                    //
                    // }

                    uiFuncs.notifier.danger(message);

                    reject(false);
                } else {

                    const bExStr = network !== nodes.nodeTypes.Custom ? "<a href='" + node.blockExplorerTX.replace("[[txHash]]", result) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                    const contractAddr = tx.to ? " & Contract Address <a href='" + node.blockExplorerAddr.replace('[[address]]', tx.to) + "' target='_blank' rel='noopener'>" + tx.to + "</a>" : '';
                    uiFuncs.notifier.success(globalFuncs.successMsgs[2] + "<br />" + result + "<br />" + bExStr + contractAddr);

                    resolve(Object.assign(Object.assign({}, tx)));


                }
            });

        }
    });
}


module.exports = uiFuncs;
