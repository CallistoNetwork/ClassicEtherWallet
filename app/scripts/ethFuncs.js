'use strict';
var ethFuncs = function () {
}
ethFuncs.gasAdjustment = 21;
ethFuncs.validateEtherAddress = function (address) {
    if (address.substring(0, 2) != "0x") return false;
    else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
    else
        return this.isChecksumAddress(address);
}
ethFuncs.isChecksumAddress = function (address) {
    return address == ethUtil.toChecksumAddress(address);
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

ethFuncs.encodeInputs = function encodeInputs(inputs) {


    const types = inputs.map(i => i.type);

    const values = inputs.map(i => i.value || '');


    return ethUtil.solidityCoder.encodeParams(types, values);


};

ethFuncs.handleContractCall = function (functionName, contract, inputs_ = null, from, value = 0, callback_ = console.log) {

    if (!(contract.hasOwnProperty('abi') && contract.hasOwnProperty('address') && Array.isArray(contract.abi))) {


        console.error('Invalid Request');

        return false;

    }

    const foundFunction = contract.abi.find(itm => itm.type === 'function' && itm.name === functionName);


    if (!foundFunction) {

        console.error('error locating function: ', functionName, 'in', contract);

        return false;
    }


    let data = ethFuncs.encodeFunctionName(foundFunction.name, contract);

    if (inputs_) {

        foundFunction.inputs.forEach((item, i) => item.value = inputs_[i]);

        data += ethFuncs.encodeInputs(foundFunction.inputs);
    }


    data = ethFuncs.sanitizeHex(data);


    const tx = {
        to: contract.address,
        data,
    };

    ethFuncs.estimateGas(tx, function (data) {

        if (data.error || parseInt(data.data) === -1) {

            console.error('error estimating gas', data);

            return false;

        } else {

            Object.assign(tx, {
                gasLimit: data.data,
                value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(value, 'ether')))
            });

            ajaxReq.getEthCall(tx, function (data) {

                // if (data.error) {
                //
                //     uiFuncs.notifier.danger(data.msg);
                //
                // }
                callback_(data);

            })

        }


    });

}


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
