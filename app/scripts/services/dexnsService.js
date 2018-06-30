const DexNSFrontendABI = require('../abiDefinitions/rinkebyAbi.json')
    .find(itm => itm.address === '0x1797a49729e1595d385484a2d48e74703bf4f150');

if (!DexNSFrontendABI) {


    throw new Error('Unable to locate DexNSFrontendABI');
}

const metaData = ({tokenNetwork, link, sourceCode, abi, info = null}) =>
    `-${tokenNetwork} -L ${link} -S ${sourceCode} -A ${typeof abi === 'string' ? abi : JSON.stringify(abi)} ${info ? `-i ${info}` : null}`;


const dexnsService = function (walletService) {

    this.CONTRACT = new InitContract(DexNSFrontendABI.abi, DexNSFrontendABI.address, 'RINKEBY ETH');


    this.metaData = metaData;
    return this;

};

module.exports = dexnsService;
