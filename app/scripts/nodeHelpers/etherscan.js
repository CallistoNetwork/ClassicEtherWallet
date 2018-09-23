"use strict";
var config = {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
};

var SERVERURL = "https://[[network]].etherscan.io/api";

var etherscan = function(network) {
    if (!network) {
        console.warn("no network specified");
        network = "api";
    }

    this.SERVERURL = SERVERURL.replace("[[network]]", network);

    const self = this;

    this.pendingPosts = [];
    this.config = config;

    /*
    @returns Promise<>
 */
    this.healthCheck = function() {
        return new Promise((resolve, reject) => {
            this.getCurrentBlock(function(result) {
                if (result.error) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    };

    this.getCurrentBlock = function(callback) {
        this.post(
            {
                module: "proxy",
                action: "eth_blockNumber"
            },
            function(data) {
                if (data.error)
                    callback({
                        error: true,
                        msg: data.error.message,
                        data: ""
                    });
                else
                    callback({
                        error: false,
                        msg: "",
                        data: new BigNumber(data.result).toString()
                    });
            }
        );
    };
    this.getBalance = function(addr, callback) {
        this.post(
            {
                module: "account",
                action: "balance",
                address: addr,
                tag: "latest"
            },
            function(data) {
                if (data.message != "OK")
                    callback({ error: true, msg: data.message, data: "" });
                else
                    callback({
                        error: false,
                        msg: "",
                        data: { address: addr, balance: data.result }
                    });
            }
        );
    };
    this.getTransaction = function(txHash, callback) {
        this.post(
            {
                module: "proxy",
                action: "eth_getTransactionByHash",
                txhash: txHash
            },
            function(data) {
                if (data.error)
                    callback({
                        error: true,
                        msg: data.error.message,
                        data: ""
                    });
                else callback({ error: false, msg: "", data: data.result });
            }
        );
    };
    this.getTransactionData = function(addr, callback) {
        var response = {
            error: false,
            msg: "",
            data: { address: addr, balance: "", gasprice: "", nonce: "" }
        };
        var parentObj = this;
        parentObj.getBalance(addr, function(data) {
            if (data.error) {
                callback({ error: true, msg: data.msg, data: "" });
                return;
            }
            response.data.balance = data.data.balance;
            parentObj.post(
                {
                    module: "proxy",
                    action: "eth_gasPrice"
                },
                function(data) {
                    if (data.error) {
                        callback({
                            error: true,
                            msg: data.error.message,
                            data: ""
                        });
                        return;
                    }
                    response.data.gasprice = data.result;
                    parentObj.post(
                        {
                            module: "proxy",
                            address: addr,
                            action: "eth_getTransactionCount",
                            tag: "latest"
                        },
                        function(data) {
                            if (data.error) {
                                callback({
                                    error: true,
                                    msg: data.error.message,
                                    data: ""
                                });
                                return;
                            }
                            response.data.nonce = data.result;
                            callback(response);
                        }
                    );
                }
            );
        });
    };
    this.sendRawTx = function(rawTx, callback) {
        this.post(
            {
                module: "proxy",
                action: "eth_sendRawTransaction",
                hex: rawTx
            },
            function(data) {
                if (data.error)
                    callback({
                        error: true,
                        msg: data.error.message,
                        data: ""
                    });
                else callback({ error: false, msg: "", data: data.result });
            }
        );
    };
    this.getEstimatedGas = function(txobj, callback) {
        this.post(
            {
                module: "proxy",
                action: "eth_estimateGas",
                to: txobj.to,
                value: txobj.value,
                data: txobj.data,
                from: txobj.from
            },
            function(data) {
                if (data.error)
                    callback({
                        error: true,
                        msg: data.error.message,
                        data: ""
                    });
                else callback({ error: false, msg: "", data: data.result });
            }
        );
    };
    this.getEthCall = function(txobj, callback) {
        this.post(
            {
                module: "proxy",
                action: "eth_call",
                to: txobj.to,
                data: txobj.data
            },
            function(data) {
                if (data.error)
                    callback({
                        error: true,
                        msg: data.error.message,
                        data: ""
                    });
                else callback({ error: false, msg: "", data: data.result });
            }
        );
    };
    this.queuePost = function() {
        // NOTE: this == ajaxReq careful w/ this.pendingPosts

        var data = this.pendingPosts[0].data;
        data.apikey = "DSH5B24BQYKD1AD8KUCDY3SAQSS6ZAU175";
        var callback = this.pendingPosts[0].callback;

        var parentObj = this;

        ajaxReq.http
            .post(self.SERVERURL, ajaxReq.postSerializer(data), config)
            .then(
                function(data) {
                    callback(data.data);
                    parentObj.pendingPosts.splice(0, 1);
                    if (parentObj.pendingPosts.length > 0)
                        parentObj.queuePost();
                },
                function(data) {
                    callback({
                        error: true,
                        msg: "connection error",
                        data: ""
                    });
                }
            );
    };
    this.post = function(data, callback) {
        this.pendingPosts.push({
            data: data,
            callback: function(_data) {
                callback(_data);
            }
        });
        if (this.pendingPosts.length == 1) this.queuePost();
    };
};

module.exports = etherscan;
