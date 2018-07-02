const DexNSFrontendABI = require('../abiDefinitions/etcAbi.json') //require('../abiDefinitions/rinkebyAbi.json')
    .find(itm => itm.name === 'DexNS Frontend contract');

if (!DexNSFrontendABI) {


    throw new Error('Unable to locate DexNSFrontendABI');
}

const addrs = {
    'RINKEBY ETH': '0x1797a49729e1595d385484a2d48e74703bf4f150',
    'ETC': '0x101f1920e4cD9c7e2aF056E2cB1954d0DD9647b9'
};

const metaData = ({tokenNetwork, link, sourceCode, abi, info = null}) =>
    `-${tokenNetwork} -L ${link} -S ${sourceCode} -A ${typeof abi === 'string' ? abi : JSON.stringify(abi)} ${info ? `-i ${info}` : null}`;


const dexnsService = function (walletService) {


    // InitContract to init all view params
    this.contract = new Contract(DexNSFrontendABI.abi, DexNSFrontendABI.address, 'ETC');


    this.contract.namePrice = 100000000000000000;
    this.contract.owningTime = 31536000; // 1 year

    this.metaData = metaData;
    return this;

};

module.exports = dexnsService;
