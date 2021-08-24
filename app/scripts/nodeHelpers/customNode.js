"use strict";

const customNode = function(srvrUrl, port, httpBasicAuthentication) {
    this.SERVERURL = port ? srvrUrl + ":" + port : srvrUrl;
    if (httpBasicAuthentication) {
        const authorization =
            "Basic " +
            btoa(
                httpBasicAuthentication.user +
                    ":" +
                    httpBasicAuthentication.password
            );
        this.config.headers["Authorization"] = authorization;
    }
};
customNode.prototype.config = {
    headers: {
        "Content-Type": "application/json; charset=UTF-8"
    }
};

/*
    @returns Promise<>
 */
customNode.prototype.healthCheck = function() {
    return new Promise((resolve, reject) => {
        this.post(
            {
                method: "net_listening"
            },
            result => {
                if (!(result.hasOwnProperty("result") && result.result)) {
                    reject(new Error("error connecting to node"));
                } else {
                    resolve(result);
                }
            }
        );
    });
};

customNode.prototype.getCurrentBlock = function(callback) {
    this.post(
        {
            method: "eth_blockNumber"
        },
        function(data) {
            if (data.error)
                callback({ error: true, msg: data.error.message, data: "" });
            else
                callback({
                    error: false,
                    msg: "",
                    data: new BigNumber(data.result).toString()
                });
        }
    );
};
customNode.prototype.getChainId = function(callback) {
    this.post(
        {
            method: "net_version"
        },
        function(data) {
            if (data.error)
                callback({ error: true, msg: data.error.message, data: "" });
            else
                callback({
                    error: false,
                    msg: "",
                    data: parseInt(data.result)
                });
        }
    );
};
customNode.prototype.getBalance = function(addr, callback) {
    this.post(
        {
            method: "eth_getBalance",
            params: [addr, "latest"]
        },
        function(data) {
            if (data.error)
                callback({ error: true, msg: data.error.message, data: "" });
            else
                callback({
                    error: false,
                    msg: "",
                    data: {
                        address: addr,
                        balance: new BigNumber(data.result).toString()
                    }
                });
        }
    );
};
customNode.prototype.getTransaction = function(txHash, callback) {
    this.post(
        {
            method: "eth_getTransactionByHash",
            params: [txHash]
        },
        function(data) {
            if (data.error)
                callback({ error: true, msg: data.error.message, data: "" });
            else callback({ error: false, msg: "", data: data.result });
        }
    );
};
customNode.prototype.getTransactionData = function(addr, callback) {
    var response = {
        error: false,
        msg: "",
        data: { address: addr, balance: "", gasprice: "", nonce: "" }
    };
    var parentObj = this;
    var reqObj = [
        {
            id: parentObj.getRandomID(),
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [addr, "latest"]
        },
        {
            id: parentObj.getRandomID(),
            jsonrpc: "2.0",
            method: "eth_gasPrice",
            params: []
        },
        {
            id: parentObj.getRandomID(),
            jsonrpc: "2.0",
            method: "eth_getTransactionCount",
            params: [addr, "latest"]
        }
    ];
    this.rawPost(reqObj, function(data) {
        // rawPost returns ({error: true, msg: "connection error", data: ""} on error

        if (
            data.hasOwnProperty("error") &&
            data.hasOwnProperty("data") &&
            data.hasOwnProperty("msg") &&
            data.error &&
            data.msg === "connection error" &&
            data.data === ""
        ) {
            // uiFuncs.generateTx expects error to have message property not msg

            return callback(
                Object.assign({}, data, { error: { message: data.msg } })
            );
        } else {
            // if (Array.isArray(data))

            for (var i in data) {
                if (data[i].error) {
                    callback({
                        error: true,
                        msg: data[i].error.message,
                        data: ""
                    });
                    return;
                }
            }

            response.data.balance = new BigNumber(data[0].result).toString();
            response.data.gasprice = data[1].result;
            response.data.nonce = data[2].result;
            callback(response);
        }
    });
};
customNode.prototype.sendRawTx = function(rawTx, callback) {
    this.post(
        {
            method: "eth_sendRawTransaction",
            params: [rawTx]
        },
        function(data) {
            if (data.error)
                callback({ error: true, msg: data.error.message, data: "" });
            else callback({ error: false, msg: "", data: data.result });
        }
    );
};
customNode.prototype.getEstimatedGas = function(
    { to = "", from = "", value = "", data = "" } = {},
    callback
) {
    const tx = {};

    if (data) {
        tx.data = data;
    }

    if (Validator.isValidAddress(from)) {
        tx.from = from;
    }
    if (Validator.isValidAddress(to)) {
        tx.to = to;
    }
    if (Validator.isValidNumber(value)) {
        tx.value = ethFuncs.trimHexZero(value);
    }

    this.post(
        {
            method: "eth_estimateGas",
            params: [tx]
        },
        function(data) {
            if (data.error) {
                callback({ error: true, msg: data.error.message, data: "" });
            } else {
                var gasLimit = new BigNumber(data.result)
                    .plus(100000)
                    .toString(16);
                callback({
                    error: false,
                    msg: "",
                    data: ethFuncs.sanitizeHex(gasLimit)
                });
            }
        }
    );
};
var ethCallArr = {
    calls: [],
    callbacks: [],
    timer: null
};
customNode.prototype.getEthCall = function(txobj, callback) {
    var parentObj = this;
    if (!ethCallArr.calls.length) {
        ethCallArr.timer = setTimeout(function() {
            parentObj.rawPost(ethCallArr.calls, function(data) {
                ethCallArr.calls = [];
                var _callbacks = ethCallArr.callbacks.slice();
                ethCallArr.callbacks = [];
                for (var i in data) {
                    if (data[i].error)
                        _callbacks[i]({
                            error: true,
                            msg: data[i].error.message,
                            data: ""
                        });
                    else
                        _callbacks[i]({
                            error: false,
                            msg: "",
                            data: data[i].result
                        });
                }
            });
        }, 500);
    }
    ethCallArr.calls.push({
        id: parentObj.getRandomID(),
        jsonrpc: "2.0",
        method: "eth_call",
        params: [{ to: txobj.to, data: txobj.data }, "latest"]
    });
    ethCallArr.callbacks.push(callback);
};
customNode.prototype.getTraceCall = function(txobj, callback) {
    this.post(
        {
            method: "trace_call",
            params: [txobj, ["stateDiff", "trace", "vmTrace"]]
        },
        function(data) {
            if (data.error)
                callback({ error: true, msg: data.error.message, data: "" });
            else callback({ error: false, msg: "", data: data.result });
        }
    );
};
customNode.prototype.rawPost = function(data, callback) {
    ajaxReq.http.post(this.SERVERURL, JSON.stringify(data), this.config).then(
        function(data) {
            callback(data.data);
        },
        function(data) {
            callback({ error: true, msg: "connection error", data: "" });
        }
    );
};
customNode.prototype.getRandomID = function() {
    return globalFuncs.getRandomBytes(16).toString("hex");
};
customNode.prototype.post = function(data, callback) {
    data.id = this.getRandomID();
    data.jsonrpc = "2.0";
    this.rawPost(data, callback);
};
module.exports = customNode;
