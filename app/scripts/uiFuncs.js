"use strict";
const { Contract } = require("./contract");

const TrezorConnect = require("trezor-connect").default;

const ethUtil = require("ethereumjs-util");

const BigNumber = require("bignumber.js");

const Transport = require("@ledgerhq/hw-transport-u2f").default;
const LedgerEth = require("@ledgerhq/hw-app-eth").default;

const uiFuncs = function() {};
uiFuncs.getTxData = function({
    tx: { to = "", value = 0, unit = "ether", gasLimit = 21000, data = "" },
    wallet
}) {
    return {
        to,
        value,
        unit,
        gasLimit,
        data,
        gasPrice: globalFuncs.localStorage.getItem("gasPrice", 21), // gwei
        from: wallet.getChecksumAddressString(),
        privKey: wallet.privKey ? wallet.getPrivateKeyString() : "",
        path: wallet.getPath(),
        hwType: wallet.getHWType(),
        hwTransport: wallet.getHWTransport()
    };
};

uiFuncs.isTxDataValid = function(txData) {
    if (
        txData.to !== "0xCONTRACT" &&
        !ethFuncs.validateEtherAddress(txData.to)
    ) {
        return {
            error: globalFuncs.errorMsgs[5],
            txData
        };
    }
    if (txData.to === "0xCONTRACT") {
        txData.to = "";
    }

    if (new BigNumber(txData.value).lt(0)) {
        return {
            error: globalFuncs.errorMsgs[0],
            txData
        };
    }
    if (new BigNumber(txData.gasLimit).lt(21000)) {
        return {
            error: globalFuncs.errorMsgs[8],
            txData
        };
    }

    if (!ethFuncs.validateHexString(txData.data)) {
        return {
            error: globalFuncs.errorMsgs[9],
            txData
        };
    }

    return {
        error: false,
        txData
    };
};

uiFuncs.signTxTrezor = function(rawTx, { path }) {
    function localCallback({ error = null, success, payload: { v, r, s } }) {
        if (!success) {
            throw error;
        }

        // check the returned signature_v and recalc signature_v if it needed
        // see also https://github.com/trezor/trezor-mcu/pull/399
        if (v <= 1) {
            // for larger chainId, only signature_v returned. simply recalc signature_v
            v += 2 * rawTx.chainId + 35;
        }

        rawTx.v = ethFuncs.sanitizeHex(ethFuncs.decimalToHex(v));
        rawTx.r = ethFuncs.sanitizeHex(r);
        rawTx.s = ethFuncs.sanitizeHex(s);
        const eTx = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = ethFuncs.sanitizeHex(eTx.serialize().toString("hex"));
        rawTx.isError = false;
        return rawTx;
    }

    const options = {
        path,
        transaction: rawTx
    };
    return TrezorConnect.ethereumSignTransaction(options).then(result =>
        localCallback(result)
    );
};

uiFuncs.signTxLedger = function(
    app,
    eTx,
    rawTx,
    { path },
    old,
    callback = console.log
) {
    eTx.raw[6] = rawTx.chainId;

    eTx.raw[7] = eTx.raw[8] = 0;

    const toHash = old ? eTx.raw.slice(0, 6) : eTx.raw;
    const txToSign = ethUtil.rlp.encode(toHash);

    app.signTransaction(path, txToSign.toString("hex"))
        .then(result => localCallback(result))
        .catch(error =>
            callback({
                isError: true,
                error,
                msg: error
            })
        );

    const localCallback = function(result) {
        let v = result["v"].toString(16);
        if (!old) {
            // EIP155 support. check/recalc signature v value.
            const rv = parseInt(v, 16);
            let cv = rawTx.chainId * 2 + 35;
            if (rv !== cv && (rv & cv) !== rv) {
                cv += 1; // add signature v bit.
            }
            v = cv.toString(16);
        }
        rawTx.v = "0x" + v;
        rawTx.r = "0x" + result["r"];
        rawTx.s = "0x" + result["s"];
        eTx = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = "0x" + eTx.serialize().toString("hex");
        rawTx.isError = false;
        callback(rawTx);
    };
};
uiFuncs.signTxDigitalBitbox = function(
    eTx,
    rawTx,
    txData,
    callback = console.log
) {
    var localCallback = function(result, error) {
        if (typeof error !== "undefined") {
            error = error.errorCode
                ? u2f.getErrorByCode(error.errorCode)
                : error;
            callback({
                isError: true,
                error: error
            });
        }
        uiFuncs.notifier.info(
            "The transaction was signed but not sent. Click the blue 'Send Transaction' button to continue."
        );
        rawTx.v = ethFuncs.sanitizeHex(result["v"]);
        rawTx.r = ethFuncs.sanitizeHex(result["r"]);
        rawTx.s = ethFuncs.sanitizeHex(result["s"]);
        var eTx_ = new ethUtil.Tx(rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = ethFuncs.sanitizeHex(eTx_.serialize().toString("hex"));
        rawTx.isError = false;
        callback(rawTx);
    };
    uiFuncs.notifier.info(
        "Touch the LED for 3 seconds to sign the transaction. Or tap the LED to cancel."
    );
    const app = new DigitalBitboxEth(txData.hwTransport, "");
    app.signTransaction(txData.path, eTx, localCallback);
};

/*


    Generates tx data over defined network

    @returns Promise<>
 */
uiFuncs.generateTx = function(_txData) {
    return new Promise((resolve, reject) => {
        const { txData, error } = uiFuncs.isTxDataValid(_txData);

        if (error) {
            return reject(new Error(error));
        }
        if (txData.nonce) {
            return uiFuncs.genTxWithInfo(txData, function(result) {
                if (result.isError) {
                    return reject(result);
                }
                resolve(result);
            });
        } else {
            ajaxReq.getTransactionData(txData.from, function(data) {
                if (data.error) {
                    reject({
                        isError: true,
                        error: data.error
                    });
                } else {
                    Object.assign(txData, {
                        isOffline: Boolean(data.isOffline),
                        nonce: data.data.nonce
                    });

                    uiFuncs.genTxWithInfo(txData, function(result) {
                        if (result.error) {
                            reject(result);
                        } else resolve(result);
                    });
                }
            });
        }
    });
};

uiFuncs.genTxWithInfo = function(data, callback = console.log) {
    const gasPrice =
        parseFloat(globalFuncs.localStorage.getItem("gasPrice")) || 21;

    const rawTx = {
        nonce: ethFuncs.sanitizeHex(data.nonce),
        gasPrice: ethFuncs.sanitizeHex(
            ethFuncs.decimalToHex(etherUnits.toWei(gasPrice, "gwei"))
        ),
        gasLimit: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(data.gasLimit)),
        to: ethFuncs.sanitizeHex(data.to),
        value: ethFuncs.sanitizeHex(
            ethFuncs.decimalToHex(etherUnits.toWei(data.value, data.unit))
        ),
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
        Transport.create()
            .then(transport => {
                const app = new LedgerEth(transport);

                let EIP155Supported = false;

                app.getAppConfiguration()
                    .then(({ version }) => {
                        uiFuncs.notifier.info(globalFuncs.successMsgs[7]);
                        const splitVersion = version.split(".");

                        if (parseInt(splitVersion[0]) > 1) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[1]) > 0) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[2]) > 2) {
                            EIP155Supported = true;
                        }
                        uiFuncs.signTxLedger(
                            app,
                            eTx,
                            rawTx,
                            data,
                            !EIP155Supported,
                            callback
                        );
                    })
                    .catch(error => {
                        callback({ isError: true, error });
                    });
            })
            .catch(error => {
                callback({ isError: true, error });
            });
    } else if (data.hwType === "trezor") {
        uiFuncs
            .signTxTrezor(rawTx, data)
            .then(result => {
                callback(result);
            })
            .catch(err => {
                callback({ isError: true, error: "User cancelled tx" });
            });
    } else if (data.hwType === "web3") {
        // for web3, we dont actually sign it here
        // instead we put the final params in the "signedTx" field and
        // wait for the confirmation dialogue / sendTx method
        const txParams = Object.assign({ from: data.from }, rawTx);
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = JSON.stringify(txParams);
        rawTx.isError = false;
        callback(rawTx);
    } else if (data.hwType === "digitalBitbox") {
        uiFuncs.signTxDigitalBitbox(eTx, rawTx, data, callback);
    } else {
        eTx.sign(new Buffer(data.privKey, "hex"));
        rawTx.rawTx = JSON.stringify(rawTx);
        rawTx.signedTx = "0x" + eTx.serialize().toString("hex");
        rawTx.isError = false;
        callback(rawTx);
    }
};

function mapTransToWeb3Trans(trans) {
    // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethsendtransaction

    return Object.assign({}, trans, {
        gas: trans.gasLimit,

        // left undefined for a contract-creation transaction
        to: trans.to === "" ? undefined : trans.to
    });
}

/*
    send Tx via ajaxReq or web3
    notify user tx hash
    return tx hash

    @returns Promise<data: string txHash | error>

 */
uiFuncs.sendTx = function(signedTx, notify = true) {
    // check for web3 late signed tx

    // web3 transaction can be a string that starts w/ quotes or object

    return new Promise((resolve, reject) => {
        if (typeof signedTx === "string" && signedTx.slice(0, 2) === "0x") {
            ajaxReq.sendRawTx(signedTx, function(data) {
                if (data.error) {
                    uiFuncs.notifier.danger(data.msg);

                    reject({
                        isError: true,
                        error: data.msg
                    });
                } else {
                    notify && uiFuncs.notifySuccessfulTx(data.data);
                    resolve({
                        isError: false,
                        data: data.data
                    });
                }
            });
        } else {
            return uiFuncs
                .handleWeb3Trans(signedTx)
                .then(txHash => {
                    notify && uiFuncs.notifySuccessfulTx(txHash);
                    resolve({ data: txHash, isError: false });
                })
                .catch(err => {
                    uiFuncs.notifier.danger(err);
                    reject(err);
                });
        }
    });
};

uiFuncs.notifySuccessfulTx = function(txHash) {
    const txHashLink = ajaxReq.blockExplorerTX.replace("[[txHash]]", txHash);
    const verifyTxBtn =
        ajaxReq.type !== nodes.nodeTypes.Custom
            ? '<a class="btn btn-xs btn-info strong" href="' +
              txHashLink +
              '" target="_blank" rel="noopener noreferrer">Verify Transaction</a>'
            : "";
    const completeMsg =
        "<p>" +
        globalFuncs.successMsgs[2] +
        "<strong>" +
        txHash +
        "</strong></p>" +
        verifyTxBtn;

    uiFuncs.notifier.success(completeMsg, 0);
};

uiFuncs.handleWeb3Trans = function(signedTx) {
    return new Promise((resolve, reject) => {
        if (!"web3" in window) {
            return reject("Web3 not found in window");
        }

        let transaction;

        try {
            // when sending tx, web3 tx comes in as string or object

            const _signedTx =
                typeof signedTx === "string" ? JSON.parse(signedTx) : signedTx;

            transaction = mapTransToWeb3Trans(_signedTx);
        } catch (e) {
            reject(e);
        }
        web3.eth.sendTransaction(transaction, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

uiFuncs.transferAllBalance = function(addr, { gasLimit = 21000 } = {}) {
    return new Promise((resolve, reject) => {
        ajaxReq.getTransactionData(addr, result => {
            if (result.error) {
                reject(result);
            }
            const {
                data: { balance, gasprice, nonce, address }
            } = result;

            if (
                ethUtil.toChecksumAddress(addr) !==
                ethUtil.toChecksumAddress(address)
            ) {
                return reject(result);
            }

            const gasCost = new BigNumber(gasprice).times(gasLimit);
            const maxVal = new BigNumber(balance).minus(gasCost);
            const value = Math.max(0, maxVal.toNumber());
            const valueEther = etherUnits.toEther(value, "wei");
            return resolve({
                unit: "ether",
                value: valueEther,
                nonce,
                gasPrice: gasprice,
                gasCost
            });
        });
    });
};
uiFuncs.notifier = {
    alerts: {},
    warning: function(msg, duration = 5000) {
        this.addAlert("warning", msg, duration);
    },
    info: function(msg, duration = 5000) {
        this.addAlert("info", msg, duration);
    },
    danger: function(msg, duration = 7000) {
        msg = msg.message || msg.msg || msg;

        // Danger messages can be translated based on the type of node
        const _msg = globalFuncs.getEthNodeMsg(msg);
        this.addAlert("danger", _msg, duration);
    },
    success: function(msg, duration = 5000) {
        this.addAlert("success", msg, duration);
    },
    addAlert: function(type, msg, duration = 7000) {
        // Save all messages by unique id for removal
        const id = Date.now();
        alert = this.buildAlert(id, type, msg);
        this.alerts[id] = alert;
        if (duration > 0) {
            // Support permanent messages
            setTimeout(alert.close, duration);
        }
        if (!this.scope.$$phase) this.scope.$apply();
    },
    buildAlert: function(id, type, msg) {
        return {
            show: true,
            type: type,
            message: msg,
            close: () => {
                delete this.alerts[id];
                if (!this.scope.$$phase) this.scope.$apply();
            }
        };
    }
};

/*

    gen tx w/ contract

    @param: funcName: string
    @param: contract Contract
    @param wallet Wallet
    @param tx Tx

    @returns: Promise<tx|Error>


 */

uiFuncs.genTxContract = function(
    funcName,
    contract,
    wallet,
    {
        network = ajaxReq.type,
        inputs = null,
        from = null,
        value = 0,
        unit = "ether"
    } = {}
) {
    return new Promise((resolve, reject) => {
        let tx = { network, inputs, from, value, unit };

        uiFuncs
            .estGasContract(funcName, contract, tx)
            .then(result => {
                if (result.gasLimit === "-1") {
                    uiFuncs.notifier.danger(globalFuncs.errorMsgs[8]);
                    return reject(result);
                }
                Object.assign(tx, result);
                genTx(tx, wallet)
                    .then(rawTx => {
                        if (!rawTx) {
                            reject(false);
                        } else {
                            resolve(Object.assign(tx, rawTx));
                        }
                    })
                    .catch(error => {
                        uiFuncs.notifier.danger(
                            (error && error.msg) || "error generating tx"
                        );

                        reject(error);
                    });
            })
            .catch(error => {
                uiFuncs.notifier.danger(error.msg);

                reject(error);
            });
    });

    /*
      get tx data from network

      generate tx

      @returns Promise<tx> signed

   */
    function genTx(tx, wallet) {
        return new Promise((resolve, reject) => {
            const { chainId, eip155, lib } = contract.node;

            lib.getTransactionData(tx.from, function(data) {
                if (data.error) {
                    reject({
                        isError: true,
                        error: data.error
                    });
                } else {
                    //const {address, balance, gasprice, nonce} = data.data;

                    const { nonce } = data.data;

                    // wallet and tx must be combined parameters to work
                    uiFuncs.genTxWithInfo(
                        Object.assign({}, tx, wallet, {
                            nonce,
                            chainId,
                            eip155
                        }),
                        function(result) {
                            if (result.error) {
                                reject(result);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                }
            });
        });
    }
};

/*

    send tx to contract
    notify user
    return tx hash
    @param: {node, network} contract Contract


    @param tx Tx

    @returns: Promise<tx|Error>
 */
uiFuncs.sendTxContract = function({ node, network }, tx, notify = true) {
    return new Promise((resolve, reject) => {
        if (
            typeof tx.signedTx === "string" &&
            tx.signedTx.slice(0, 2) === "0x"
        ) {
            node.lib.sendRawTx(tx.signedTx, resp => {
                if (resp.error) {
                    return reject(resp);
                }

                if (notify) {
                    showSuccessfulTxContract(resp.data);
                }

                return resolve(Object.assign(Object.assign({}, tx, resp.data)));
            });
        } else {
            // send tx via web3

            uiFuncs
                .handleWeb3Trans(tx.signedTx)
                .then(function(result) {
                    notify && showSuccessfulTxContract(result);
                    resolve(Object.assign(Object.assign({}, tx)));
                })
                .catch(err => {
                    uiFuncs.notifier.danger(err);
                    reject(err);
                });
        }

        function showSuccessfulTxContract(txHash) {
            const bExStr =
                network !== nodes.nodeTypes.Custom
                    ? "<a href='" +
                      node.blockExplorerTX.replace("[[txHash]]", txHash) +
                      "' target='_blank' rel='noopener'> View your transaction </a>"
                    : "";
            const contractAddr = tx.to
                ? " & Contract Address <a href='" +
                  node.blockExplorerAddr.replace("[[address]]", tx.to) +
                  "' target='_blank' rel='noopener'>" +
                  tx.to +
                  "</a>"
                : "";
            uiFuncs.notifier.success(
                globalFuncs.successMsgs[2] +
                    "<br />" +
                    txHash +
                    "<br />" +
                    bExStr +
                    contractAddr
            );
        }
    });
};

/*
    returns <Promise> {data, msg, error: false}
 */

uiFuncs.estimateGas = function(dataObj, notifyError = true) {
    return new Promise((resolve, reject) => {
        ajaxReq.getEstimatedGas(dataObj, function(data) {
            if (data.error || parseInt(data.data) === -1) {
                notifyError && uiFuncs.notifier.danger(data);
                reject(-1);
            } else {
                resolve(new BigNumber(data.data).toNumber());
            }
        });
    });
};

/*

    Estimate gasPrice of tx to contract

    sent over contract's set network

    @param string | contract.abi[n[ _func
    @param Contract contract
    @param Tx transaction

    @returns tx: Tx {gasLimit: }

 */

uiFuncs.estGasContract = function(
    _func,
    contract,
    {
        network = ajaxReq.type,
        inputs = null,
        from = null,
        value = 0,
        unit = "ether"
    } = {}
) {
    return new Promise((resolve, reject) => {
        const tx = { network, inputs, from, value, unit };

        const { error, tx: _tx } = uiFuncs.prepContractData(
            _func,
            contract,
            tx
        );

        if (error) {
            reject(error);
        } else {
            Object.assign(tx, _tx);

            const estObj = {
                from: tx.from,
                data: tx.data,
                to: contract.address,
                value: new BigNumber(
                    etherUnits.toWei(tx.value, tx.unit)
                ).toString()
            };

            contract.node.lib.getEstimatedGas(estObj, function(data) {
                if (data.error || parseInt(data.data) === -1) {
                    reject(Object.assign({}, data, { error: true }));
                } else {
                    resolve(
                        Object.assign({}, tx, {
                            gasLimit: new BigNumber(data.data).toNumber()
                        })
                    );
                }
            });
        }
    });
};

/*
Generates tx data from contract function

@param string  | contract.abi[n] _FUNCTION
@param Contract contract
@param Tx {}
@returns {error: bool | error, {tx: Tx, _function: contract.abi.function} } if cannot estimate gas

*/

uiFuncs.prepContractData = function(
    _FUNCTION,
    contract,
    { inputs = [], from, value = 0, unit = "ether" } = {}
) {
    const ERROR = { error: true, tx: null, _function: null };

    if (!(contract instanceof Contract)) {
        return ERROR;
    }

    let _function = null;

    if (typeof _FUNCTION === "string") {
        _function = contract.abi.find(itm => itm.name === _FUNCTION);
    } else {
        _function = _FUNCTION;
    }

    if (!contract.validFunction(_function)) return ERROR;

    _function.inputs.forEach((item, i) => (item.value = inputs[i] || ""));

    let data = ethFuncs.getFunctionSignature(
        ethUtil.solidityUtils.transformToFullName(_function)
    );

    if (!data) {
        return ERROR;
    }

    const inputs__ = ethFuncs.encodeInputs(_function);

    return {
        tx: {
            to: contract.address,
            data: ethFuncs.sanitizeHex(data + inputs__),
            value,
            unit
        },
        _function,
        error: null
    };
};

/*

    Given function, contract, and tx data, generates data and sends call, returns decoded outputs
    @param string | contract.abi[n] _func
    @param Contract contract
    @param Transaction tx
    @returns Promise<{error: bool, data: []any}>
 */

uiFuncs.call = function(
    _func,
    contract,
    {
        network = ajaxReq.type,
        inputs = null,
        from = null,
        value = 0,
        unit = "ether"
    } = {}
) {
    return new Promise((resolve, reject) => {
        const { node } = contract;

        const { tx: transObj, _function, error } = uiFuncs.prepContractData(
            _func,
            contract,
            {
                inputs,
                from,
                value,
                unit
            }
        );

        if (error) {
            reject({ error: transObj, data: null });
        } else {
            // if reading from contract, send call

            node.lib.getEthCall(
                { to: transObj.to, data: transObj.data },
                function(data) {
                    if (data.error) {
                        reject(data);
                    } else
                        resolve(
                            Object.assign({}, data, {
                                data: ethFuncs.decodeOutputs(_function, data)
                            })
                        );
                }
            );
        }
    });
};

module.exports = uiFuncs;
