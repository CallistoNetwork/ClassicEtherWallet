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
    if (str == null) return false;
    else if (str === "") return true;
    str =
        str.substring(0, 2) === "0x"
            ? str.substring(2).toUpperCase()
            : str.toUpperCase();
    const re = /^[0-9A-F]+$/g;
    return re.test(str);
};
ethFuncs.sanitizeHex = function(hex) {
    hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
    if (hex === "") return "";
    return "0x" + this.padLeftEven(hex);
};
ethFuncs.trimHexZero = function(hex) {
    if (hex === "0x00" || hex === "0x0") return "0x0";
    hex = this.sanitizeHex(hex);
    hex = hex.substring(2).replace(/^0+/, "");
    return "0x" + hex;
};
ethFuncs.padLeftEven = function(hex) {
    hex = hex.length % 2 != 0 ? "0" + hex : hex;
    return hex;
};
ethFuncs.addTinyMoreToGas = function() {
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

module.exports = ethFuncs;
