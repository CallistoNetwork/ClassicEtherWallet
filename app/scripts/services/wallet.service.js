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
        gbpBalance: null,
        repBalance: null,
        chfBalance: null,
        btcBalance: null,
        eurBalance: null,
        usdBalance: null,
        balance: null,
        tokenObjs: [], // Token {["contractAddress","userAddress","symbol","decimal","type","balance","network","node","balanceBN"]}
        usdPrice: null,
        gbpPrice: null,
        eurPrice: null,
        btcPrice: null,
        chfPrice: null
    };
};
module.exports = walletService;
