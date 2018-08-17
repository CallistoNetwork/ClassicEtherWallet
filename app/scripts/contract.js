const { WAValidator } = ethUtil;

/*

    @param abi: Array<>
    @param address: string
    @param network: string

    Looks at network and sets node to call / write data

 */

const _sample = require("lodash/sample");

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

    setNode(network = this.network) {
        const _nodes = Object.values(nodes.nodeList).filter(
            _node => _node.type.toUpperCase() === network.toUpperCase()
        );

        if (0 === _nodes.length) {
            throw new Error("Invalid Request");
        } else {
            this.node = _sample(_nodes);
        }
    }

    setAbi(_abi) {
        if (typeof _abi === "string") {
            try {
                this.abi = JSON.parse(_abi);
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
        @returns Promise<>


     */
    call(
        funcName,
        { inputs = [], value = 0, unit = "ether", from = null } = {}
    ) {
        const tx_ = {
            inputs,
            to: this.address,
            network: this.network,
            value,
            unit,
            from
        };

        return ethFuncs.call(funcName, this, tx_);
    }

    genTxContract(
        funcName,
        wallet,
        { inputs = [], value = 0, unit = "ether", from = null } = {}
    ) {
        return uiFuncs.genTxContract(
            funcName,
            this,
            wallet,
            Object.assign(
                {},
                {
                    inputs,
                    network: this.network,
                    to: this.address,
                    value,
                    unit,
                    from
                }
            )
        );
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

    call(funcName, tx) {
        const func = this.abi.find(a => a.name === funcName);

        if (!func) {
            throw new Error("Invalid Request");
        }

        return super.call(funcName, tx).then(result => {
            const { outputs } = func;

            this[funcName] = outputs.map((out, idx) => {
                const name = out.name || funcName;

                return Object.assign({}, out, {
                    value: result.data[idx],
                    name
                });
            });

            return this[funcName];
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

/*

load contract from abiDefinitions
 */

//
// class OfficialityContract extends InitContract {
//
//
//     constructor() {
//
//         const abi = [{
//             "constant": false,
//             "inputs": [{"name": "_name", "type": "string"}],
//             "name": "remove_entry",
//             "outputs": [],
//             "payable": false,
//             "stateMutability": "nonpayable",
//             "type": "function"
//         }, {
//             "constant": false,
//             "inputs": [{"name": "_who", "type": "address"}],
//             "name": "fire",
//             "outputs": [],
//             "payable": false,
//             "stateMutability": "nonpayable",
//             "type": "function"
//         }, {
//             "constant": true,
//             "inputs": [],
//             "name": "owner",
//             "outputs": [{"name": "", "type": "address"}],
//             "payable": false,
//             "stateMutability": "view",
//             "type": "function"
//         }, {
//             "constant": false,
//             "inputs": [{"name": "_name", "type": "string"}, {"name": "_link", "type": "string"}, {
//                 "name": "_metadata",
//                 "type": "string"
//             }],
//             "name": "add_entry",
//             "outputs": [],
//             "payable": false,
//             "stateMutability": "nonpayable",
//             "type": "function"
//         }, {
//             "constant": false,
//             "inputs": [{"name": "_who", "type": "address"}],
//             "name": "hire",
//             "outputs": [],
//             "payable": false,
//             "stateMutability": "nonpayable",
//             "type": "function"
//         }, {
//             "constant": true,
//             "inputs": [{"name": "_name", "type": "string"}],
//             "name": "get_entry",
//             "outputs": [{"name": "", "type": "string"}, {"name": "", "type": "string"}, {"name": "", "type": "string"}],
//             "payable": false,
//             "stateMutability": "view",
//             "type": "function"
//         }, {
//             "constant": true,
//             "inputs": [{"name": "_link", "type": "string"}],
//             "name": "is_official",
//             "outputs": [{"name": "", "type": "bool"}],
//             "payable": false,
//             "stateMutability": "view",
//             "type": "function"
//         }, {
//             "constant": false,
//             "inputs": [{"name": "_who", "type": "address"}],
//             "name": "transfer_ownership",
//             "outputs": [],
//             "payable": false,
//             "stateMutability": "nonpayable",
//             "type": "function"
//         }, {
//             "inputs": [],
//             "payable": false,
//             "stateMutability": "nonpayable",
//             "type": "constructor"
//         }, {
//             "anonymous": false,
//             "inputs": [{"indexed": false, "name": "_name", "type": "string"}],
//             "name": "Registered",
//             "type": "event"
//         }, {
//             "anonymous": false,
//             "inputs": [{"indexed": false, "name": "_name", "type": "string"}],
//             "name": "Removed",
//             "type": "event"
//         }];
//
//         const addr = '0xf6f29e5ba51171c4ef4997bd0208c7e9bc5d5eda';
//         super(abi, addr, 'CLO');
//
//     }
//
//
//     /*
//
//         @param path string
//         @returns Promise<bool>
//      */
//
//     handle_is_official(path) {
//
//         const calls = [
//             "http://" + path,
//             "https://" + path,
//             "http://" + path + '/',
//             "https://" + path + '/'
//         ].map(_path => this.call('is_official', _path));
//
//         return Promise.all(calls).then(result => {
//
//             this.is_official = result.some(item => item);
//
//             return this.is_official;
//
//         });
//     }
// }

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
