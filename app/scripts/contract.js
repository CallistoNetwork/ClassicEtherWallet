const {WAValidator} = ethUtil;


/*

    abi: Array<>
    address: string
    network: string
 */

class Contract {


    constructor(abi, address, network) {

        this.setNetwork(network);
        this.setAbi(abi);
        this.at(address);

    }


    get contract() {

        return {
            abi: this.abi,
            address: this.address,
            network: this.network,

        };
    }


    setNetwork(_network) {

        this.network = _network.toUpperCase();
    }

    setAbi(_abi) {

        if (typeof _abi === 'string') {


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

    toString() {

        return JSON.stringify({
            abi: this.abi,
            address: this.address,
            network: this.network,
        });
    }


}

/*

 contract that initilizes its view params

    @property contract {node, }
    @property node

  */


class InitContract extends Contract {


    constructor(abi = [], addr = '0x', network = 'ETC') {

        super(abi, addr, network);

        this.setNode();
        this.setViewParams();

        this.getViewParams();
    }

    get contract() {

        return Object.assign({}, super.contract, {node: this.node});

    }

    setNode(network = this.network) {


        const node = Object.values(nodes.nodeList).find(_node => _node.type === network);

        if (!node) {

            throw new Error('Invalid Request');
        } else {

            this.node = node;
        }
    }

    getViewParams() {

        this.contract.abi.forEach(obj => {

            if (obj.stateMutability === 'view' && obj.inputs.length === 0) {


                this['get_' + obj.name]();
            }
        })
    }

    setViewParams() {

        this.abi.forEach(obj => {


            // get view params if there are no input values

            if (obj.stateMutability === 'view' && obj.inputs.length === 0) {

                this['get_' + obj.name] = function () {

                    return this.handleContractCall(obj.name, arguments)
                        .then(result => {

                            const func = this.abi.find(a => a.name === obj.name);

                            const {outputs} = func;

                            return outputs.map((out, idx) => {

                                let {name, type} = out;

                                if (!name) {

                                    name = obj.name;
                                }

                                this[name] = result.data[idx];

                                return this[name];

                            })

                        }).catch(err => {

                            console.error(err);
                        });
                };


            }
        });
    }


    /*


        @returns balance -> wei
     */

    balance() {

        return new Promise((resolve, reject) => {

            const node = Object.values(nodes.nodeList).find(node => node.type === this.network);

            if (!node) {

                reject(new Error('could not find node'));
            } else {

                node.lib.getBalance(this.address, (result) => {

                    // console.log('bal', result);

                    if (result.error) {

                        reject(result);

                    } else {

                        const {data: {address, balance}} = result;

                        this._balance = balance;

                        resolve(this._balance);
                    }
                })
            }
        })
    }


    getTxData(tx) {

        return new Promise((resolve, reject) => {

            this.node.lib.getTransactionData(tx.from, function (data) {
                if (data.error) {
                    reject({
                        isError: true,
                        error: data.error
                    });
                } else {


                    Object.assign(tx, {nonce: data.data.nonce});

                    uiFuncs.genTxWithInfo(tx, function (result) {

                        if (result.error) {

                            reject(result);
                        } else {

                            resolve(result);
                        }
                    });
                }

            })
        })
    }


    /*

        @param functionName: string
        @param inputs Array<any>

        @param tx
        @returns Promise<>


     */
    handleContractCall(functionName, inputs = [], {value = 0, unit = 'ether', from = null} = {}) {

        const tx_ = {inputs, to: this.address, network: this.network, value, unit, from};

        return ethFuncs.handleContractCall(functionName, this, tx_);

    }

    handleContractWrite(functionName, {inputs = [], value = 0, unit = 'ether', from = null} = {}, wallet) {


        return ethFuncs.handleContractWrite(
            functionName,
            this,
            wallet,
            Object.assign({}, {inputs, network: this.network, to: this.address, value, unit, from})
        );


    }

    handleEstimateGasLimit(functionName, tx) {


        return ethFuncs.handleContractGasEstimation(functionName, this, tx);
    }

    /*

        write to contract

     */


}


class OfficialityContract extends InitContract {


    constructor() {

        const abi = [{
            "constant": false,
            "inputs": [{"name": "_name", "type": "string"}],
            "name": "remove_entry",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_who", "type": "address"}],
            "name": "fire",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_name", "type": "string"}, {"name": "_link", "type": "string"}, {
                "name": "_metadata",
                "type": "string"
            }],
            "name": "add_entry",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_who", "type": "address"}],
            "name": "hire",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "_name", "type": "string"}],
            "name": "get_entry",
            "outputs": [{"name": "", "type": "string"}, {"name": "", "type": "string"}, {"name": "", "type": "string"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{"name": "_link", "type": "string"}],
            "name": "is_official",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{"name": "_who", "type": "address"}],
            "name": "transfer_ownership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": false, "name": "_name", "type": "string"}],
            "name": "Registered",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{"indexed": false, "name": "_name", "type": "string"}],
            "name": "Removed",
            "type": "event"
        }];

        const addr = '0xf6f29e5ba51171c4ef4997bd0208c7e9bc5d5eda';
        super(abi, addr, 'CLO');

    }


    /*

        @param path string
        @returns Promise<bool>
     */

    handle_is_official(path) {

        const calls = [
            "http://" + path,
            "https://" + path,
            "http://" + path + '/',
            "https://" + path + '/'
        ].map(_path => this.handleContractCall('is_official', _path));

        return Promise.all(calls).then(result => {

            this.is_official = result.some(item => item);

            return this.is_official;

        });
    }
}


module.exports = {
    Contract,
    InitContract,
    OfficialityContract,
};
