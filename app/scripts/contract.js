const { WAValidator } = ethUtil;

/*

    @param abi: Array<>
    @param address: string
    @param network: string

    Looks at network and sets node to call / write data

 */

class Contract {
    constructor(abi, address, network) {
        this.init(abi, address, network);
    }

    init(abi, address, network) {
        this.setNetwork(network);
        this.setNode();
        this.setAbi(abi);
        this.at(address);
    }

    get contract() {
        return {
            abi: this.abi,
            address: this.address,
            network: this.network,
            node: this.node
        };
    }

    setNetwork(_network) {
        this.network = _network.toUpperCase();
    }

    validFunction(_function) {
        const requiredParams = ["name", "inputs"];

        return (
            typeof _function === "object" &&
            requiredParams.every(s => _function.hasOwnProperty(s))
        );
    }

    setNode(network = this.network) {
        const node = Object.values(nodes.nodeList).find(
            _node => _node.type.toUpperCase() === network.toUpperCase()
        );

        if (!node) {
            throw new Error("Invalid Request");
        } else {
            this.node = node;
        }
    }

    setAbi(_abi) {
        if (typeof _abi === "string") {
            try {
                this.abi = JSON.parse(_abi).map((func, index) =>
                    Object.assign(func, { index })
                );
            } catch (e) {
                throw new Error(`Invalid Abi \n Abi: ${_abi}`);
            }
        } else {
            if (!Array.isArray(_abi)) {
                throw new Error(`Invalid Abi, Abi is not an array: ${_abi}`);
            }
            this.abi = _abi;
        }
    }

    at(address) {
        // const validAddr = WAValidator.validate(address, this.network);
        //
        // if (!validAddr) {
        //
        //     throw new Error(`Invalid Address \n
        //     Addr: ${address}\t Network: ${this.network}`
        //     );
        // }

        // todo: remove for other networks besides eth
        this.address = ethUtil.toChecksumAddress(address);
    }

    setAddress(address) {
        this.at(address);
    }

    /*

        get balance of contract address

       @returns Promise<balance : wei | Error>
    */

    getBalance() {
        return new Promise((resolve, reject) => {
            this.node.lib.getBalance(this.address, result => {
                if (result.error) {
                    reject(result);
                } else {
                    const {
                        data: { address, balance }
                    } = result;

                    this.balance = balance;

                    resolve(this.balance);
                }
            });
        });
    }

    toString() {
        return JSON.stringify(this.contract);
    }

    // Wrapper functions for network calls

    /*

        @param funcName: string
        @param inputs Array<any>

        @param tx
        @param functionIndex indexOf function in abi (useful if +1 functions w/ same name)
        @returns Promise<>


     */
    call(_func, { inputs = [], value = 0, unit = "ether", from = null } = {}) {
        const tx_ = {
            inputs,
            to: this.address,
            network: this.network,
            value,
            unit,
            from
        };

        return ethFuncs.call(_func, this, tx_);
    }

    genTxContract(
        _func,
        wallet,
        { inputs = [], value = 0, unit = "ether", from = null } = {}
    ) {
        return uiFuncs.genTxContract(_func, this, wallet, {
            inputs,
            network: this.network,
            to: this.address,
            value,
            unit,
            from
        });
    }

    sendTx(tx) {
        return uiFuncs.sendTxContract(
            { node: this.node, network: this.network },
            tx
        );
    }

    handleSendTx(
        funcName,
        wallet,
        { inputs = [], value = 0, unit = "ether", from = null } = {}
    ) {
        return this.genTxContract(funcName, wallet, {
            inputs,
            value,
            unit,
            from
        }).then(tx => this.sendTx(tx));
    }

    estGasLimit(funcName, tx) {
        return ethFuncs.estGasContract(funcName, this, tx);
    }
}

/*

     contract that inits its view params



  */

class InitContract extends Contract {
    constructor(abi = [], addr, network, _bootstrap = false) {
        super(abi, addr, network);

        this.abi.forEach(func => {
            // types function, event, constructor
            if (func.type === "function") {
                this[func.name] = "";

                func.inputs.forEach(input => {
                    input.value = "";
                });
            }
        });

        if (_bootstrap) {
            this._bootstrap();
        }
    }

    // if view function and has no inputs, call function and save result

    _bootstrap() {
        return Promise.all(
            this.abi.map(_func => {
                if (
                    _func.stateMutability === "view" &&
                    _func.inputs.length === 0
                ) {
                    return this.call(_func.name);
                }
            })
        );
    }

    /*

        request to get view params and set values

@returns Promise<>

     */

    call(_FUNCTION, tx) {
        let name = _FUNCTION;

        if (typeof _FUNCTION === "string") {
            _FUNCTION = this.abi.find(f => f.name === _FUNCTION);

            if (!_FUNCTION) {
                throw new Error("Invalid Request");
            }
        } else if (this.validFunction(_FUNCTION)) {
            name = _FUNCTION.name;
        } else {
            throw new Error("Invalid Request");
        }
        return super.call(_FUNCTION, tx).then(result => {
            const { outputs } = _FUNCTION;

            this[name] = outputs.map((out, idx) => {
                const paramName = out.name || name;

                return Object.assign({}, out, {
                    value: result.data[idx],
                    name: paramName
                });
            });

            return this[name];
        });
    }

    // sendTx(funcName, wallet, tx) {
    //
    //
    //     return super.sendTx(funcName, wallet, tx)
    //         .then(result => {
    //
    //             const f = this.abi.find(i => i.name === funcName);
    //
    //             f.outputs.forEach((out, i) => {
    //
    //                 Object.assign(out.value, result[i]);
    //             })
    //         });
    //
    // }
}

function parseJsonContract(contract, network, _bootstrap) {
    if (
        !(contract.hasOwnProperty("address") && contract.hasOwnProperty("abi"))
    ) {
        throw new Error("Invalid Request");
    }
    const { address, abi } = contract;

    return new InitContract(abi, address, network, _bootstrap);
}

module.exports = {
    Contract,
    InitContract,
    parseJsonContract
};
