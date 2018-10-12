"use strict";
const walletService = function() {
    return {
        wallet: null,
        password: "",
        privKey: null,
        pubKey: null,
        path: null,
        hwType: null,
        hwTransport: null,
        type: null,
        balances: {},
        tokenObjs: [] // Token {["contractAddress","userAddress","symbol","decimal","type","balance","network","node","balanceBN"]}
    };
};
module.exports = walletService;
