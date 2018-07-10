const DexNSFrontendABI = require('../abiDefinitions/rinkebyAbi.json')//require('../abiDefinitions/etcAbi.json')
    .find(itm => itm.name === 'DexNS Frontend contract');


const DexNSStorage = require('../abiDefinitions/rinkebyAbi')
    .find(i => i.name === 'DexNs_Storage');

if (!DexNSFrontendABI) {


    throw new Error('Unable to locate DexNSFrontendABI');
}

if (!DexNSStorage) {

    throw new Error('Unable to locate DEXNS storage');
}

const addrs = {
    'RINKEBY ETH': '0x1797a49729e1595d385484a2d48e74703bf4f150',
    'ETC': '0x101f1920e4cD9c7e2aF056E2cB1954d0DD9647b9'
};

const metaData = ({tokenNetwork = 'ETC', link = '', sourceCode = '', abi = '', info = ''} = {}) => {


    // extend_Name_Binding_Time

    let validAbi = false;
    try {


        if (abi) {

            _abi = JSON.parse(abi);
            validAbi = true;

        }


    } catch (e) {

        uiFuncs.notifier.danger(globalFuncs.errorMsgs[26]);

    }

    const abiText = validAbi ? ` -A ${abi}` : '';

    return `-${tokenNetwork}${link && ` -L ${link}`}${sourceCode && ` -S ${sourceCode}`}${abiText}${info && ` -i ${info}`}`;
}


class DexnsContract extends Contract {

    constructor(abi, address, network) {

        super(abi, address, network);

        this.abi.forEach(func => {

            this[func.name] = '';

            func.inputs.forEach(input => {

                input.value = '';
            })
        });
    }

    // call contract and set param

    call(funcName, tx) {


        return super.call(funcName, tx)
            .then(result => {

                const func = this.abi.find(a => a.name === funcName);

                const {outputs} = func;

                if (outputs.length === 1) {

                    this[funcName] = result.data[0];
                } else {

                    this[funcName] = outputs.map((out, idx) => {

                        return result.data[idx];


                    });
                }

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

const dexnsService = function (walletService) {


    // InitContract to init all view params
    this.contract = new DexnsContract(DexNSFrontendABI.abi, DexNSFrontendABI.address, 'RINKEBY ETH');

    this.storageContract = new DexnsContract(DexNSStorage.abi, DexNSStorage.address, 'RINKEBY ETH');

    this.contract.namePrice = 100000000000000000;
    this.contract.owningTime = 31536000; // 1 year

    this.metaData = metaData;
    return this;

};

module.exports = dexnsService;
