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

const stringifyMetadata = ({tokenNetwork = 'ETC', link = '', sourceCode = '', abi = '', info = ''} = {}) => {


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
};

const parseMetadata = (_metadata) => {


    if (!_metadata) {

        return '';
    }

    const _arr = _metadata.split('-');

    const network = _arr[1];

    const rest = _arr.slice(2);


    /*

    -A for ABI.

-L for attached link.

-S for source code reference.

-i for informational data chunk.
     */

    const params = rest.map(i => {

        const param = i[0].toLowerCase();

        let key = 'data';

        if (param === 'l') {

            key = 'link';


        } else if (param === 's') {

            key = 'source';


        } else if (param === 'i') {

            key = 'info';


        }

        return {
            key,
            value: i.slice(2)
        }


    });

    return [].concat([{key: 'network', value: network}], params);

}


const dexnsService = function (walletService) {


    this.parseMetadata = parseMetadata;


    this.parsedMetadata = '';


    // InitContract to init all view params
    this.feContract = new InitContract(DexNSFrontendABI.abi, DexNSFrontendABI.address, 'RINKEBY ETH', false);

    this.storageContract = new InitContract(DexNSStorage.abi, DexNSStorage.address, 'RINKEBY ETH', false);

    this.feContract.namePrice = [{value: 100000000000000000, type: 'uint256', name: 'namePrice'}];
    this.feContract.owningTime = [{value: 31536000, type: 'uint256', name: 'owningTime'}]; // 1 year

    this.stringifyMetadata = stringifyMetadata;
    return this;

};

module.exports = dexnsService;
