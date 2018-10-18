"use strict";
const walletService = function() {
    this.wallet = null;
    this.password = "";
    this.privKey = null;
    this.pubKey = null;
    this.path = null;
    this.hwType = null;
    this.hwTransport = null;
    this.type = null;
    this.balances = {};
    this.tokenObjs = []; // Token {["contractAddress","userAddress","symbol","decimal","type","balance","network","node","balanceBN"];

    this.unlocked = () => this.wallet && this.wallet.getAddressString();
    return this;
};
module.exports = walletService;
