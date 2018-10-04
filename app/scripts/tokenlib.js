"use strict";

const storageContract = require("./abiDefinitions/etcAbi.json").find(
    i => i.name === "DexNS State storage"
);

const InitContract = require("./contract").InitContract;

const dexnsStorageContract = new InitContract(
    storageContract.abi,
    storageContract.address,
    "ETC"
);

var Token = function(
    contractAddress,
    userAddress,
    symbol,
    decimal,
    type,
    node,
    local = false
) {
    this.contractAddress = contractAddress;
    this.userAddress = userAddress;
    this.symbol = symbol;
    this.decimal = decimal;
    this.type = type;
    this.balance = "loading";
    this.node = node; // str

    this.local = local;

    this.dexns = {
        info: "",
        name: ""
    };

    this.initDexns();
};

Token.balanceHex = "0x70a08231";
Token.transferHex = "0xa9059cbb";
Token.popTokens = [];
Token.prototype.getContractAddress = function() {
    return this.contractAddress;
};
Token.prototype.getSymbol = function() {
    return this.symbol;
};
Token.prototype.getDecimal = function() {
    return this.decimal;
};
Token.prototype.getBalance = function() {
    return this.balance;
};

Token.prototype.setBalance = function(balance) {
    this.balance = balance;
};

Token.prototype.initDexns = function() {
    dexnsStorageContract
        .call("assignation", { inputs: [this.contractAddress] })
        .then(result => {
            const _name = result[0].value;

            if (_name) {
                this.dexns.name = _name;
                // console.log(this.contractAddress, _name);

                dexnsStorageContract
                    .call("getName", { inputs: [_name] })
                    .then(result => {
                        const _info = result[0].value;
                        this.dexns.info = _info;
                    });
            }
        });
};

Token.prototype.fetchBalance = function() {
    const request_ = ethFuncs.getDataObj(
        this.contractAddress,
        Token.balanceHex,
        [ethFuncs.getNakedAddress(this.userAddress)]
    );

    const node_ = this.node;

    // check that node has proper getEthCall method or resort to ajax Req
    const requestObj =
        node_ &&
        node_.hasOwnProperty("lib") &&
        node_.lib.hasOwnProperty("getEthCall")
            ? node_.lib
            : ajaxReq;

    try {
        requestObj.getEthCall(request_, data => {
            if (
                !data.error &&
                data.hasOwnProperty("data") &&
                data.data !== "0x"
            ) {
                this.setBalance(
                    new BigNumber(data.data)
                        .div(new BigNumber(10).pow(this.getDecimal()))
                        .toString()
                );
            } else {
                this.setBalance(globalFuncs.errorMsgs[20]);
            }
        });
    } catch (e) {
        this.setBalance("0"); //globalFuncs.errorMsgs[20];
    }
};

Token.getTokenByAddress = function(toAdd) {
    toAdd = ethFuncs.sanitizeHex(toAdd);
    for (var i = 0; i < Token.popTokens.length; i++) {
        if (toAdd.toLowerCase() === Token.popTokens[i].address.toLowerCase())
            return Token.popTokens[i];
    }
    return {
        address: toAdd,
        symbol: "Unknown",
        decimal: 0,
        type: "default"
    };
};
Token.prototype.getData = function(toAdd, value) {
    try {
        if (!ethFuncs.validateEtherAddress(toAdd))
            throw globalFuncs.errorMsgs[5];
        else if (!globalFuncs.isNumeric(value) || parseFloat(value) < 0)
            throw globalFuncs.errorMsgs[7];
        var value = ethFuncs.padLeft(
            new BigNumber(value)
                .times(new BigNumber(10).pow(this.getDecimal()))
                .toString(16),
            64
        );
        var toAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(toAdd), 64);
        var data = Token.transferHex + toAdd + value;
        return {
            isError: false,
            data: data
        };
    } catch (e) {
        return {
            isError: true,
            error: e
        };
    }
};
module.exports = Token;
