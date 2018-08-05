"use strict";
var ethFuncs = function() {};
ethFuncs.gasAdjustment = 21;
ethFuncs.validateEtherAddress = function(address) {
    if (address.substring(0, 2) !== "0x") return false;
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    else if (
        /^(0x)?[0-9a-f]{40}$/.test(address) ||
        /^(0x)?[0-9A-F]{40}$/.test(address)
    )
        return true;
    else return this.isChecksumAddress(address);
};
ethFuncs.isChecksumAddress = function(address) {
    return address === ethUtil.toChecksumAddress(address);
};
ethFuncs.validateHexString = function(str) {
    if (str == "") return true;
    str =
        str.substring(0, 2) == "0x"
            ? str.substring(2).toUpperCase()
            : str.toUpperCase();
    var re = /^[0-9A-F]+$/g;
    return re.test(str);
};
ethFuncs.sanitizeHex = function(hex) {
    hex = hex.substring(0, 2) == "0x" ? hex.substring(2) : hex;
    if (hex == "") return "";
    return "0x" + this.padLeftEven(hex);
};
ethFuncs.trimHexZero = function(hex) {
    if (hex == "0x00" || hex == "0x0") return "0x0";
    hex = this.sanitizeHex(hex);
    hex = hex.substring(2).replace(/^0+/, "");
    return "0x" + hex;
};
ethFuncs.padLeftEven = function(hex) {
    hex = hex.length % 2 != 0 ? "0" + hex : hex;
    return hex;
};
ethFuncs.addTinyMoreToGas = function(hex) {
    hex = this.sanitizeHex(hex);
    //if (parseInt(ethFuncs.gasAdjustment) >= 80) {
    //uiFuncs.notifier.danger("We are currently trying to debug a weird issue. Please contact support@myetherwallet.com w/ subject line WEIRD ISSUE to help.");
    //throw "error";
    //}
    return new BigNumber(
        ethFuncs.gasAdjustment * etherUnits.getValueOfUnit("gwei")
    ).toString(16);
};
ethFuncs.decimalToHex = function(dec) {
    return new BigNumber(dec).toString(16);
};
ethFuncs.hexToDecimal = function(hex) {
    return new BigNumber(this.sanitizeHex(hex)).toString();
};
ethFuncs.contractOutToArray = function(hex) {
    hex = hex.replace("0x", "").match(/.{64}/g);
    for (var i = 0; i < hex.length; i++) {
        hex[i] = hex[i].replace(/^0+/, "");
        hex[i] = hex[i] == "" ? "0" : hex[i];
    }
    return hex;
};
ethFuncs.getNakedAddress = function(address) {
    return address.toLowerCase().replace("0x", "");
};
ethFuncs.getDeteministicContractAddress = function(address, nonce) {
    nonce = new BigNumber(nonce).toString();
    address = address.substring(0, 2) == "0x" ? address : "0x" + address;
    return "0x" + ethUtil.generateAddress(address, nonce).toString("hex");
};
ethFuncs.padLeft = function(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
ethFuncs.getDataObj = function(to, func, arrVals) {
    var val = "";
    for (var i = 0; i < arrVals.length; i++)
        val += this.padLeft(arrVals[i], 64);
    return {
        to: to,
        data: func + val
    };
};
ethFuncs.getFunctionSignature = function(name) {
    return ethUtil
        .sha3(name)
        .toString("hex")
        .slice(0, 8);
};
const adjustGas = gasLimit => {
    if (gasLimit === "0x5209") return "21000";
    if (new BigNumber(gasLimit).gt(3500000)) return "-1";
    return new BigNumber(gasLimit).toString();
};

ethFuncs.estimateGas = function(dataObj, callback) {
    ajaxReq.getEstimatedGas(dataObj, function(data) {
        if (data.error) {
            callback(data);
            return;
        } else {
            callback({
                error: false,
                msg: "",
                data: adjustGas(data.data)
            });
        }
    });
};

/*

    Given funcName, contract, and tx data, generates data and sends call, returns decoded outputs
    @param string funcName
    @param Contract contract
    @param Transaction tx
    @param callback function
    @returns Promise<{error: bool, data: []any}>
 */

ethFuncs.call = function(
    funcName,
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
        const foundFunction = contract.abi.find(itm => itm.name === funcName);

        const { node } = contract;

        if (!foundFunction) {
            console.error("error locating function:", funcName, "in", contract);

            reject({ error: true, data: null });
        } else if (
            !node &&
            node.hasOwnProperty("lib") &&
            node.lib.hasOwnProperty("getEthCall")
        ) {
            console.error("error locating node for network:", network);

            reject({ error: true, data: null });
        }

        const transObj = ethFuncs.prepContractData(funcName, contract, {
            inputs,
            from,
            value,
            unit
        });

        if (transObj.error) {
            reject({ error: transObj, data: null });
        } else {
            // if reading from contract, send call

            node.lib.getEthCall(
                { to: transObj.to, data: transObj.data },
                function(data) {
                    resolve(
                        Object.assign({}, data, {
                            data: ethFuncs.decodeOutputs(foundFunction, data)
                        })
                    );
                }
            );
        }
    });
};

/*

    Estimate gasPrice of tx to contract

    sent over contract's set network

    @param string funcName
    @param Contract contract
    @param Tx transaction
    @param callback_ function

    @returns tx: Tx {gasLimit: }

 */

ethFuncs.estGasContract = function(
    funcName,
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

        const result = ethFuncs.prepContractData(funcName, contract, tx);

        if (!result.error) {
            Object.assign(tx, result);

            const estObj = {
                from: tx.from,
                data: tx.data,
                to: contract.address,
                value: tx.value
            };

            // estObj.value = ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(tx.value, tx.unit)));

            contract.node.lib.getEstimatedGas(estObj, function(data) {
                if (data.error || parseInt(data.data) === -1) {
                    reject(Object.assign({}, data, { error: true }));
                } else {
                    resolve(
                        Object.assign({}, tx, {
                            gasLimit: adjustGas(data.data)
                        })
                    );
                }
            });
        } else {
            reject(result);
        }
    });
};

// utils

ethFuncs.encodeInputs = function encodeInputs({ inputs }) {
    const types = inputs.map(i => i.type);

    const values = inputs.map(i => i.value || "");

    return ethUtil.solidityCoder.encodeParams(types, values);
};
/*

    Decode outputs from contract abi

    @param contractFunction
    @param data eth_call response

    @returns []any | data

 */
ethFuncs.decodeOutputs = function decodeOutputs(contractFunction, data) {
    const { outputs } = contractFunction;

    const output = ethUtil.solidityCoder.decodeParams(
        outputs.map(o => o.type),
        data.data.replace("0x", "")
    );

    return output.map(i => {
        if (i instanceof BigNumber) {
            return i.toFixed(0);
        }

        return i;
    });
};

/*


    Encode inputs if any and tx data

    @param string funcName
    @param Contract contract
    @param Tx {}
    @returns {error: bool | error, tx: Tx } if cannot estimate gas

 */

ethFuncs.prepContractData = function(
    funcName,
    contract,
    { inputs = [], from, value = 0 }
) {
    if (
        !(
            contract.hasOwnProperty("abi") &&
            contract.hasOwnProperty("address") &&
            Array.isArray(contract.abi)
        )
    ) {
        console.error("Invalid Request");

        return { error: true };
    }

    const foundFunction = contract.abi.find(itm => itm.name === funcName);

    if (!foundFunction) {
        console.error("error locating function:", funcName, "in", contract);

        return { error: true };
    }

    let data = ethFuncs.encodefuncName(foundFunction.name, contract);

    if (!data) {
        return { error: true };
    }

    foundFunction.inputs.forEach((item, i) => (item.value = inputs[i] || ""));

    var inputs__ = ethFuncs.encodeInputs(foundFunction);

    return {
        to: contract.address,
        data: ethFuncs.sanitizeHex(data + inputs__),
        value
    };
};

/*

    given a function name and contract, returns function signature

    @param string funcName

    @param Contract contract

    @returns string functionSig
 */

ethFuncs.encodefuncName = function(funcName, contract) {
    const foundFunction = contract.abi.find(
        function_ => function_.name === funcName
    );

    if (foundFunction) {
        return ethFuncs.getFunctionSignature(
            ethUtil.solidityUtils.transformToFullName(foundFunction)
        );
    } else {
        console.error("error locating", funcName, "in", contract);

        return false;
    }
};

module.exports = ethFuncs;
