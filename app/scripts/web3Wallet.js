"use strict";
var Wallet = require("./myetherwallet.js");

var Web3Wallet = function(addressBuffer) {
    Wallet.call(this);
    this.addressBuffer = addressBuffer;
    this.type = "web3";
    this.hwType = "web3";
    this.getNetwork();
};
// subclass Wallet
Web3Wallet.super_ = Wallet;
Web3Wallet.prototype = Object.create(Wallet.prototype);

Web3Wallet.prototype.getAddress = function() {
    return this.addressBuffer;
};
//
// Web3Wallet.prototype.getPath = function () {
//     throw new Error('Web3Wallet - method not supported')
// }
// Web3Wallet.prototype.getHWType = function() {
//     throw new Error('Web3Wallet - method not supported')
// }
// Web3Wallet.prototype.getHWTransport = function() {
//     throw new Error('Web3Wallet - method not supported')
// }
Web3Wallet.prototype.getPrivateKey = function() {
    throw new Error("Web3Wallet - method not supported");
};
Web3Wallet.prototype.getPrivateKeyString = function() {
    throw new Error("Web3Wallet - method not supported");
};
Web3Wallet.prototype.getPublicKey = function() {
    throw new Error("Web3Wallet - method not supported");
};
Web3Wallet.prototype.getPublicKeyString = function() {
    throw new Error("Web3Wallet - method not supported");
};
Web3Wallet.prototype.toV3 = function() {
    throw new Error("Web3Wallet - method not supported");
};
Web3Wallet.prototype.toJSON = function() {
    throw new Error("Web3Wallet - method not supported");
};
Web3Wallet.prototype.toV3String = function(password, opts) {
    return JSON.stringify(this.toV3(password, opts));
};
Web3Wallet.prototype.getV3Filename = function(timestamp) {
    var ts = timestamp ? new Date(timestamp) : new Date();
    return [
        "UTC--",
        ts.toJSON().replace(/:/g, "-"),
        "--",
        this.getAddress().toString("hex")
    ].join("");
};

Web3Wallet.prototype.getNetwork = function() {
    const { web3 } = window;

    this.chainId = parseInt(web3.version.network);

    const node = Object.values(nodes.nodeList).find(
        node => node.chainId === this.chainId
    );

    if (!node) {
        throw new Error("Invalid Request");
    }
    this.network = node.type;
};

module.exports = Web3Wallet;
