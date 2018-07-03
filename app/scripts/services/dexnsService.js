const DexNSFrontendABI = require('../abiDefinitions/rinkebyAbi.json') //require('../abiDefinitions/etcAbi.json')
    .find(itm => itm.name === 'DexNS Frontend contract');

if (!DexNSFrontendABI) {


    throw new Error('Unable to locate DexNSFrontendABI');
}

const addrs = {
    'RINKEBY ETH': '0x1797a49729e1595d385484a2d48e74703bf4f150',
    'ETC': '0x101f1920e4cD9c7e2aF056E2cB1954d0DD9647b9'
};

const metaData = ({tokenNetwork = 'ETC', link = '', sourceCode = '', abi = '', info = ''} = {}) => {


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

    return `-${tokenNetwork}${link && ` -L ${link}`}${sourceCode && ` -S ${sourceCode}`}${abiText}${info && `-i ${info}`}`;
}


const dexnsService = function (walletService) {


    // InitContract to init all view params
    this.contract = new Contract(DexNSFrontendABI.abi, DexNSFrontendABI.address, 'RINKEBY ETH');


    this.contract.namePrice = 100000000000000000;
    this.contract.owningTime = 31536000; // 1 year

    this.metaData = metaData;
    return this;

};

module.exports = dexnsService;
