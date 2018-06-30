'use strict';
var ethFuncs = function () {
}
ethFuncs.gasAdjustment = 21;
ethFuncs.validateEtherAddress = function (address) {
    if (address.substring(0, 2) !== "0x") return false;
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
    else
        return this.isChecksumAddress(address);
}
ethFuncs.isChecksumAddress = function (address) {
    return address === ethUtil.toChecksumAddress(address);
}
ethFuncs.validateHexString = function (str) {
    if (str == "") return true;
    str = str.substring(0, 2) == '0x' ? str.substring(2).toUpperCase() : str.toUpperCase();
    var re = /^[0-9A-F]+$/g;
    return re.test(str);
}
ethFuncs.sanitizeHex = function (hex) {
    hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
    if (hex == "") return "";
    return '0x' + this.padLeftEven(hex);
}
ethFuncs.trimHexZero = function (hex) {
    if (hex == "0x00" || hex == "0x0") return "0x0";
    hex = this.sanitizeHex(hex);
    hex = hex.substring(2).replace(/^0+/, '');
    return '0x' + hex;
}
ethFuncs.padLeftEven = function (hex) {
    hex = hex.length % 2 != 0 ? '0' + hex : hex;
    return hex;
}
ethFuncs.addTinyMoreToGas = function (hex) {
    hex = this.sanitizeHex(hex);
    //if (parseInt(ethFuncs.gasAdjustment) >= 80) {
    //uiFuncs.notifier.danger("We are currently trying to debug a weird issue. Please contact support@myetherwallet.com w/ subject line WEIRD ISSUE to help.");
    //throw "error";
    //}
    return new BigNumber(ethFuncs.gasAdjustment * etherUnits.getValueOfUnit('gwei')).toString(16);
}
ethFuncs.decimalToHex = function (dec) {
    return new BigNumber(dec).toString(16);
}
ethFuncs.hexToDecimal = function (hex) {
    return new BigNumber(this.sanitizeHex(hex)).toString();
}
ethFuncs.contractOutToArray = function (hex) {
    hex = hex.replace('0x', '').match(/.{64}/g);
    for (var i = 0; i < hex.length; i++) {
        hex[i] = hex[i].replace(/^0+/, '');
        hex[i] = hex[i] == "" ? "0" : hex[i];
    }
    return hex;
}
ethFuncs.getNakedAddress = function (address) {
    return address.toLowerCase().replace('0x', '');
}
ethFuncs.getDeteministicContractAddress = function (address, nonce) {
    nonce = new BigNumber(nonce).toString();
    address = address.substring(0, 2) == '0x' ? address : '0x' + address;
    return '0x' + ethUtil.generateAddress(address, nonce).toString('hex');
}
ethFuncs.padLeft = function (n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
ethFuncs.getDataObj = function (to, func, arrVals) {
    var val = "";
    for (var i = 0; i < arrVals.length; i++) val += this.padLeft(arrVals[i], 64);
    return {
        to: to,
        data: func + val
    };
}
ethFuncs.getFunctionSignature = function (name) {
    return ethUtil.sha3(name).toString('hex').slice(0, 8);
};
ethFuncs.estimateGas = function (dataObj, callback) {
    var adjustGas = function (gasLimit) {
        if (gasLimit == "0x5209") return "21000";
        if (new BigNumber(gasLimit).gt(3500000)) return "-1";
        return new BigNumber(gasLimit).toString();
    }
    ajaxReq.getEstimatedGas(dataObj, function (data) {
        if (data.error) {
            callback(data);
            return;
        } else {
            callback({
                "error": false,
                "msg": "",
                "data": adjustGas(data.data)
            });
        }
    });
};


/*

    Given functionName, contract, and tx data, generates data and sends call, returns decoded outputs
    @param string functionName
    @param Contract contract
    @param Transaction tx
    @param callback function
    @returns Promise<{error: bool, data: []any}>
 */


ethFuncs.handleContractCall = function (
    functionName,
    contract,
    {network = ajaxReq.type, inputs = null, from = null, value = 0, unit = 'ether'} = {}
) {


    return new Promise((resolve, reject) => {


        const foundFunction = contract.abi.find(itm => ['function'].includes(itm.type) && itm.name === functionName);


        const node = Object.values(nodes.nodeList).find(node => node.type === network);


        if (!foundFunction) {

            console.error('error locating function:', functionName, 'in', contract);

            reject({error: true, data: null});

        } else if (!node && node.hasOwnProperty('lib') && node.lib.hasOwnProperty('getEthCall')) {

            console.error('error locating node for network:', network);

            reject({error: true, data: null});

        }

        const transObj = ethFuncs.prepContractData(functionName, contract, {inputs, from, value, unit});

        if (transObj.error) {

            reject({error: transObj, data: null});

        } else {



            // if reading from contract, send call

            node.lib.getEthCall({to: transObj.to, data: transObj.data}, function (data) {


                resolve(Object.assign({}, data, {data: ethFuncs.decodeOutputs(foundFunction, data)}));


            });

        }
    })

}


/*

    Write to contract function

    @param: functionName: string
    @param: contract Contract
    @param wallet Wallet
    @param tx: Array<any>

    @returns: Promise<tx|Error>


 */

ethFuncs.handleContractWrite = function (
    functionName,
    contract,
    wallet,
    {network = ajaxReq.type, inputs = null, from = null, value = 0, unit = 'ether'} = {}) {

    return new Promise((resolve, reject) => {


            const {node} = contract;

            const tx = {network, inputs, from, value, unit};

            const _func = contract.abi.find(i => i.name === functionName);

            if (!_func) {


                reject(new Error('Invalid Request'));
            }


            const funcSig = ethFuncs.getFunctionSignature(ethUtil.solidityUtils.transformToFullName(_func));


            const tx_data = ethFuncs.sanitizeHex(funcSig + ethUtil.solidityCoder.encodeParams(
                _func.inputs.map(i => i.type),
                tx.inputs,
            ));


            Object.assign(tx, {data: tx_data});


            return ethFuncs.handleContractGasEstimation(functionName, contract, tx)
                .catch(err => reject(err))
                .then(result => {

                    Object.assign(tx, result);


                    var txData = uiFuncs.getTxData({tx, wallet});

                    uiFuncs.generateTx(txData, (rawTx) => {
                        if (rawTx.isError) {

                            uiFuncs.notifier.danger(rawTx.error);

                            reject(false);

                        }

                        Object.assign(tx, rawTx);


                        if (typeof rawTx.signedTx === 'string' && rawTx.signedTx.slice(0, 2) === '0x') {

                            // send tx over network defined by contract


                            node.lib.sendRawTx(rawTx.signedTx, (resp) => {
                                if (!resp.isError) {
                                    var bExStr = ajaxReq.type !== nodes.nodeTypes.Custom ? "<a href='" + ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                                    var contractAddr = tx.to ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', tx.to) + "' target='_blank' rel='noopener'>" + tx.to + "</a>" : '';
                                    uiFuncs.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);

                                    resolve(Object.assign(Object.assign({}, tx, resp.data)));

                                } else {
                                    uiFuncs.notifier.danger(globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));

                                    reject(false);
                                }
                            })
                        } else {

                            // send tx via web3

                            uiFuncs.handleWeb3Trans(rawTx.signedTx, function (err, result) {


                                if (err) {

                                    uiFuncs.notifier.danger(globalFuncs.errorMsgs[17].replace('{}', this.network));

                                    reject(false);
                                } else {

                                    var bExStr = this.network !== nodes.nodeTypes.Custom ? "<a href='" + ajaxReq.blockExplorerTX.replace("[[txHash]]", result) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                                    var contractAddr = tx.to ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', tx.to) + "' target='_blank' rel='noopener'>" + tx.to + "</a>" : '';
                                    uiFuncs.notifier.success(globalFuncs.successMsgs[2] + "<br />" + result + "<br />" + bExStr + contractAddr);

                                    resolve(Object.assign(Object.assign({}, tx)));
                                }
                            });

                        }


                    })


                });
        }
    )
}


/*

    Estimate gasPrice of tx to contract

    @param string functionName
    @param Contract contract
    @param Tx transaction
    @param callback_ function

 */

ethFuncs.handleContractGasEstimation = function (functionName, contract, tx) {


    return new Promise((resolve, reject) => {


        const result = ethFuncs.prepContractData(functionName, contract, tx);


        if (!result.error) {

            ethFuncs.estimateGas(result, function (data) {
                if (data.error || parseInt(data.data) === -1) {

                    console.error('error estimating gas', data);


                    reject(Object.assign({}, data, {error: true}));


                } else {

                    resolve(Object.assign({}, tx, {
                        gasLimit: data.data,
                    }))
                }
            });
        } else {

            reject(result);
        }
    })

}


ethFuncs.encodeInputs = function encodeInputs({inputs}) {


    const types = inputs.map(i => i.type);

    const values = inputs.map(i => i.value || '');


    return ethUtil.solidityCoder.encodeParams(types, values);


};
/*

    Decode outputs from contract abi

    @param contractFunction
    @param data eth_call response

    @returns []any | data

 */
ethFuncs.decodeOutputs = function decodeOutputs(contractFunction, data) {


    const {outputs} = contractFunction;

    const output = ethUtil.solidityCoder.decodeParams(outputs.map(o => o.type), data.data.replace('0x', ''));


    return output.map(i => {
        if (i instanceof BigNumber) {

            return i.toFixed(0);
        }

        return i;
    });
};

/*


    Encode inputs if any and tx data

    @param string functionName
    @param Contract contract
    @param Tx {}
    @returns {error: bool | error, tx: Tx } if cannot estimate gas

 */

ethFuncs.prepContractData = function (functionName, contract, {inputs = [], from, value = 0}) {


    if (!(contract.hasOwnProperty('abi') && contract.hasOwnProperty('address') && Array.isArray(contract.abi))) {


        console.error('Invalid Request');

        return {error: true};

    }

    const foundFunction = contract.abi.find(itm => itm.type === 'function' && itm.name === functionName);


    if (!foundFunction) {

        console.error('error locating function:', functionName, 'in', contract);

        return {error: true};
    }


    let data = ethFuncs.encodeFunctionName(foundFunction.name, contract);

    if (!data) {

        return {error: true};

    }


    foundFunction.inputs.forEach((item, i) => item.value = inputs[i] || "");

    var inputs__ = ethFuncs.encodeInputs(foundFunction);


    return {
        to: contract.address,
        data: ethFuncs.sanitizeHex(data + inputs__),
        value
    };


};


/*

    given a function name and contract, returns function signature

    @param string functionName

    @param Contract contract

    @returns string functionSig
 */

ethFuncs.encodeFunctionName = function (functionName, contract) {

    const foundFunction = contract.abi.find(function_ => function_.type === 'function' && function_.name === functionName);

    if (foundFunction) {


        return ethFuncs.getFunctionSignature(ethUtil.solidityUtils.transformToFullName(foundFunction));


    } else {

        console.error('error locating', functionName, 'in', contract);

        return false;
    }


};


module.exports = ethFuncs;
