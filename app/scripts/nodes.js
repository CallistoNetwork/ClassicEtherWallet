"use strict";
var nodes = function() {};
nodes.customNode = require("./nodeHelpers/customNode");
nodes.infuraNode = require("./nodeHelpers/infura");
nodes.etherscanNode = require("./nodeHelpers/etherscan");
nodes.nodeTypes = {
    CLO: "CLO",
    CLOT: "Testnet CLO",
    ETH: "ETH",
    ETC: "ETC",
    ETCT: "Testnet ETC",
    Ropsten: "ROPSTEN ETH",
    Kovan: "KOVAN ETH",
    Rinkeby: "RINKEBY ETH",
    RSK: "RSK",
    EXP: "EXP",
    UBQ: "UBQ",
    PIRL: "PIRL",
    POA: "POA",
    TOMO: "TOMO",
    ELLA: "ELLA",
    ETSC: "ETSC",
    MUSIC: "MUSIC",
    ESN: "ESN",
    AKA: "AKA",
    Custom: "CUSTOM ETH"
};
nodes.tldTypes = {
    ETH: ".eth",
    ETC: ".etc",
    Kovan: ".eth",
    Rinkeby: ".eth",
    RSK: ".rsk"
};

nodes.ensNodeTypes = [
    nodes.nodeTypes.ETH,
    nodes.nodeTypes.Ropsten,
    nodes.nodeTypes.ETC
];
nodes.customNodeObj = {
    name: "CUS",
    blockExplorerTX: "",
    blockExplorerAddr: "",
    type: nodes.nodeTypes.Custom,
    eip155: false,
    chainId: "",
    tokenList: [],
    abiList: [],
    service: "Custom",
    lib: {
        SERVERURL: null,
        pendingPosts: null,
        config: null,
        getCurrentBlock: null,
        getBalance: null,
        getTransaction: null,
        getTransactionData: null,
        sendRawTx: null,
        getEstimatedGas: null,
        getEthCall: null,
        queuePost: null,
        post: null
    }
};

nodes.alternativeBalance = {
    ETH: {
        balance: "Loading",
        node: "eth_mew",
        symbol: "ETH"
    },
    ETC: {
        balance: "Loading",
        node: "etc_ethercluster",
        symbol: "ETC"
    },
    CLO: {
        balance: "Loading",
        node: "clo_mainnet",
        symbol: "CLO"
    }
};

nodes.nodeList = {
    clo_mainnet: {
        name: "Callisto - CLO",
        blockExplorerTX: "https://explorer2.callisto.network/tx/[[txHash]]",
        blockExplorerAddr:
            "https://explorer2.callisto.network/addr/[[address]]",
        type: nodes.nodeTypes.CLO,
        eip155: true,
        chainId: 820,
        tokenList: [],
        service: "Callisto.network",
        abiList: require("./abiDefinitions/clo.json"),
        lib: new nodes.customNode("https://clo-geth.0xinfra.com/", "")
    },
    clo_testnet3: {
        name: "CLO Testnet",
        blockExplorerTX:
            "https://explorer-testnet.callisto.network/tx/[[txHash]]",
        blockExplorerAddr:
            "https://explorer-testnet.callisto.network/addr/[[address]]",
        type: nodes.nodeTypes.CLOT,
        eip155: true,
        chainId: 20729,
        tokenList: [],
        service: "Callisto.network",
        abiList: require("./abiDefinitions/clo.json"),
        lib: new nodes.customNode("https://testnet-rpc.callisto.network/", "")
    },
    etc_ethercluster: {
        name: "ETC",
        blockExplorerTX: "https://classic.etccoopexplorer.com/tx/[[txHash]]",
        blockExplorerAddr:
            "https://classic.etccoopexplorer.com/address/[[address]]",
        type: nodes.nodeTypes.ETC,
        eip155: true,
        chainId: 61,
        tokenList: require("./tokens/etcTokens.json"),
        abiList: require("./abiDefinitions/etcAbi.json"),
        service: "Ether Cluster",
        lib: new nodes.customNode("https://www.ethercluster.com/etc", "")
    },
    eth_mew: {
        name: "ETH",
        blockExplorerTX: "https://etherscan.io/tx/[[txHash]]",
        blockExplorerAddr: "https://etherscan.io/address/[[address]]",
        type: nodes.nodeTypes.ETH,
        eip155: true,
        chainId: 1,
        tokenList: require("./tokens/ethTokens.json"),
        abiList: require("./abiDefinitions/ethAbi.json"),
        service: "mycrypto.com",
        lib: new nodes.customNode("https://api.mycryptoapi.com/eth", "")
    }
};
module.exports = nodes;
