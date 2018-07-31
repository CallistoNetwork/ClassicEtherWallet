'use strict';


var globalFuncs = function () {
}
globalFuncs.lightMode = false;


// default nodes to connect to
globalFuncs.networks = {
    ETH: "eth_ethscan",
    ETC: "etc_ethereumcommonwealth_parity",
    UBQ: "ubq",
    EXP: "exp",
    ROP: 'rop_mew',
    CLO: 'clo_mainnet',
    RIN: 'rin_ethscan',
    CLOT: 'clo_testnet3'
};

globalFuncs.getBlockie = function (address) {
    return blockies.create({
        seed: address.toLowerCase(),
        size: 8,
        scale: 16
    }).toDataURL();
};
globalFuncs.printPaperWallets = function (strJson, encFileName) {


    var walletWindow = window.open("wallet", "_blank", "innerHeight = 360, innerWidth = 760, status = 1, resizable = 1");
    let data = require('../layouts/printWallet.html')
        .replace("{{WALLETJSON}}", strJson);

    walletWindow.document.write(data);

    walletWindow.document.write('<script type="text/javascript">main();</script>');
};
globalFuncs.getBlob = function (mime, str) {
    var str = (typeof str === 'object') ? JSON.stringify(str) : str;
    if (str == null) return '';
    var blob = new Blob([str], {
        type: mime
    });
    return window.URL.createObjectURL(blob);
};
globalFuncs.getSuccessText = function (str) {
    return '<p class="text-center text-success"><strong> ' + str + '</strong></p>'
};
globalFuncs.getDangerText = function (str) {
    return '<p class="text-center text-danger"><strong> ' + str + '</strong></p>'
};


// These are translated in the translation files
globalFuncs.errorMsgs = [
    'Please enter a valid amount.', // 0
    'Your password must be at least 9 characters. Please ensure it is a strong password. ', // 1
    'Sorry! We don\'t recognize this type of wallet file. ', // 2
    'This is not a valid wallet file. ', // 3
    'This unit doesn\'t exists, please use the one of the following units ', // 4
    'Please enter a valid address. ', // 5
    'Please enter a valid password. ', // 6
    'Please enter valid decimals (Must be integer, 0-18). ', // 7
    'Please enter a valid gas limit (Must be integer. Try 21000-4000000). ', // 8
    'Please enter a valid data value (Must be hex). ', // 9
    'Please enter a valid gas price. ', // 10 - NOT USED
    'Please enter a valid nonce (Must be integer).', // 11
    'Invalid signed transaction. ', // 12
    'A wallet with this nickname already exists. ', // 13
    'Wallet not found. ', // 14
    'Whoops. It doesn\'t look like a proposal with this ID exists yet or there is an error reading this proposal. ', // 15 - NOT USED
    'A wallet with this address already exists in storage. Please check your wallets page. ', // 16
    'Insufficient funds. Account you try to send transaction from does not have enough funds. Required {} wei and got: {} wei. If sending tokens, you must have 0.01 {} in your account to cover the cost of gas. ', // 17
    'All gas would be used on this transaction. This means you have already voted on this proposal or the debate period has ended.', // 18
    'Please enter a valid symbol', // 19
    'Not a valid ERC-20 token', // 20
    'Could not estimate gas. There are not enough funds in the account, or the receiving contract address would throw an error. Feel free to manually set the gas and proceed. The error message upon sending may be more informative.', // 21
    'Please enter valid node name', // 22
    'Enter valid URL. If you are on https, your URL must be https', // 23
    'Please enter a valid port. ', // 24
    'Please enter a valid chain ID. ', // 25
    'Please enter a valid ABI. ', // 26
    'Minimum amount: 0.01. Max amount: ', // 27
    'You need this `Keystore File + Password` or the `Private Key` (next page) to access this wallet in the future. ', // 28
    'Please enter a valid user and password. ', // 29
    'Please enter a valid name (7+ characters, limited punctuation) ', // 30
    'Please enter a valid secret phrase. ', // 31
    'Could not connect to the node. Try refreshing, using different node in upper right corner, and checking firewall settings. If custom node, check your configs.', // 32
    'The wallet you have unlocked does not match the owner\'s address. ', // 33
    'The name you are attempting to reveal does not match the name you have entered. ', // 34
    'Input address is not checksummed. <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/not-checksummed-shows-when-i-enter-an-address" target="_blank" rel="noopener"> More info</a>', // 35
    'Enter valid TX hash', // 36
    'Enter valid hex string (0-9, a-f)', // 37,
    "Invalid gas price! Min gasPrice is 0.1 GWei. Max gasPrice is 100 GWei. GasPrice is resetted to 21GWei default value!",
    'Element type has non-empty default values'

];

// These are translated in the translation files
globalFuncs.successMsgs = [
    'Valid address',
    'Wallet successfully decrypted',
    'Transaction submitted. TX Hash: ',
    'Your wallet was successfully added: ',
    'File Selected: ',
    'You are connected to the node ',
    'Message Signature Verified'
];

// These are translated in the translation files
globalFuncs.gethErrors = {
    'Invalid sender': 'GETH_InvalidSender',
    'Nonce too low': 'GETH_Nonce',
    'Gas price too low for acceptance': 'GETH_Cheap',
    'Insufficient balance': 'GETH_Balance',
    'Account does not exist or account balance too low': 'GETH_NonExistentAccount',
    'Insufficient funds for gas * price + value': 'GETH_InsufficientFunds',
    'Intrinsic gas too low': 'GETH_IntrinsicGas',
    'Exceeds block gas limit': 'GETH_GasLimit',
    'Negative value': 'GETH_NegativeValue'
};

globalFuncs.gethErrorMsgs = {};
globalFuncs.getGethMsg = function (str) {
    if (str in this.gethErrors) {
        var key = this.gethErrors[str];
        if (key in this.gethErrorMsgs) {
            return this.gethErrorMsgs[key];
        }
    }
    return str;
};

// These are translated in the translation files
globalFuncs.parityErrors = {
    "Transaction with the same hash was already imported\\.": "PARITY_AlreadyImported",
    "Transaction nonce is too low\\. Try incrementing the nonce\\.": "PARITY_Old",
    "Transaction fee is too low\\. There is another transaction with same nonce in the queue\\. Try increasing the fee or incrementing the nonce\\.": "PARITY_TooCheapToReplace",
    "There are too many transactions in the queue\\. Your transaction was dropped due to limit\\. Try increasing the fee\\.": "PARITY_LimitReached",
    "Transaction fee is too low\\. It does not satisfy your node's minimal fee \\(minimal: (\\d+), got: (\\d+)\\)\\. Try increasing the fee\\.": "PARITY_InsufficientGasPrice",
    "Insufficient funds\\. The account you tried to send transaction from does not have enough funds\\. Required (\\d+) and got: (\\d+)\\.": "ERROR_17",
    "Transaction cost exceeds current gas limit\\. Limit: (\\d+), got: (\\d+)\\. Try decreasing supplied gas\\.": "PARITY_GasLimitExceeded",
    "Supplied gas is beyond limit\\.": "PARITY_InvalidGasLimit"
};
globalFuncs.parityErrorMsgs = {};
globalFuncs.getParityMsg = function (str) {
    for (var reg in this.parityErrors) {
        if (this.parityErrors.hasOwnProperty(reg)) {
            let args = str.match("^" + reg + "$");
            if (args) {
                let key = this.parityErrors[reg];
                if (key in this.parityErrorMsgs) {
                    args[0] = this.parityErrorMsgs[key];
                    return format.apply(this, args);
                }
            }
        }
    }
    return str;
};
globalFuncs.getEthNodeName = function () {
    //  return "geth";
    return "parity";
};
globalFuncs.getEthNodeMsg = function (str) {
    var ethNode = this.getEthNodeName();
    if (ethNode == "geth") return this.getGethMsg(str);
    else
        return this.getParityMsg(str);
};

globalFuncs.getCurNode = function () {
    let keyNode = globalFuncs.localStorage.getItem('curNode', null);
    if (keyNode == null) {
        return;
    }
    keyNode = JSON.parse(keyNode);
    return keyNode.key;
}

globalFuncs.scrypt = {
    n: 1024
};
globalFuncs.postDelay = 300;
globalFuncs.kdf = "scrypt";
globalFuncs.defaultTxGasLimit = 21000;
globalFuncs.defaultTokenGasLimit = 200000;
globalFuncs.donateAddress = "0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8";
globalFuncs.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
globalFuncs.urlGet = function (name) {
    name = name.toLowerCase();
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search.toLowerCase())) return this.stripTags(decodeURIComponent(name[1]));
};
globalFuncs.stripTags = function (str) {
    var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (SCRIPT_REGEX.test(str)) {
        str = str.replace(SCRIPT_REGEX, "");
    }
    return str;
};
globalFuncs.checkAndRedirectHTTPS = function () {
    var host = "myetherwallet.com";
    var hostw = "https://www.myetherwallet.com";
    var path = window.location.pathname;
    if (host == window.location.host) window.location = hostw + path;
};
globalFuncs.isStrongPass = function (password) {
    return password.length > 8;
};
globalFuncs.hexToAscii = function (hex) {
    return hex.match(/.{1,2}/g).map(function (v) {
        return String.fromCharCode(parseInt(v, 16));
    }).join('');
};
globalFuncs.isAlphaNumeric = function (value) {
    return !/[^a-zA-Z0-9/-]/.test(value);
};
globalFuncs.getRandomBytes = function (num) {
    return ethUtil.crypto.randomBytes(num);
};
globalFuncs.checkIfTokenExists = function (storedTokens, localToken) {


    return Boolean(storedTokens.find(token =>

        token.contractAddress === localToken.contractAdd && token.symbol === localToken.symbol
    ));
}


globalFuncs.saveTokenToLocal = function (localToken, callback) {
    try {
        if (!ethFuncs.validateEtherAddress(localToken.contractAdd)) throw globalFuncs.errorMsgs[5];
        else if (!globalFuncs.isNumeric(localToken.decimals) || parseFloat(localToken.decimals) < 0) throw globalFuncs.errorMsgs[7];
        else if (!globalFuncs.isAlphaNumeric(localToken.symbol) || localToken.symbol == "") throw globalFuncs.errorMsgs[19];
        var storedTokens = globalFuncs.localStorage.getItem("localTokens", null) != null ? JSON.parse(globalFuncs.localStorage.getItem("localTokens")) : [];
        if (globalFuncs.checkIfTokenExists(storedTokens, localToken)) {
            return callback({
                error: true,
                msg: 'Token already exists.'
            })
        }

        const node = globalFuncs.getCurNode();

        storedTokens.push({
            contractAddress: localToken.contractAdd,
            address: localToken.contractAdd,
            symbol: localToken.symbol,
            decimal: parseInt(localToken.decimals),
            decimals: parseInt(localToken.decimals),
            type: nodes.nodeTypes.Custom,
            network: nodes.nodeList[node].name,
            node
        });
        globalFuncs.localStorage.setItem("localTokens", JSON.stringify(storedTokens));
        return callback({
            error: false
        });
    } catch (e) {
        callback({
            error: true,
            msg: e
        });
    }
};
globalFuncs.removeTokenFromLocal = function (symbol, tokenObj) {
    var storedTokens = globalFuncs.localStorage.getItem("localTokens", null) != null ? JSON.parse(globalFuncs.localStorage.getItem("localTokens", null)) : [];
    // remove from localstorage so it doesn't show up on refresh
    for (var i = 0; i < storedTokens.length; i++)
        if (storedTokens[i].symbol === symbol) {
            storedTokens.splice(i, 1);
            break;
        }
    globalFuncs.localStorage.setItem("localTokens", JSON.stringify(storedTokens));
    if (!tokenObj) return;
    // remove from tokenObj so it removes from display
    for (var i = 0; i < tokenObj.length; i++)
        if (tokenObj[i].symbol === symbol) {
            tokenObj.splice(i, 1);
            break;
        }
};


globalFuncs.localStorage = {
    isAvailable: function () {
        // return typeof localStorage != "undefined";
        // return globalFuncs.storageAvailable('localStorage');

        // Polyfilled if not available/accessible
        return true;
    },
    setItem: function (key, value) {
        if (this.isAvailable()) {
            localStorage.setItem(key, value);
        } else {
            // console.log("localStorage is available? " + this.isAvailable());
        }
    },
    getItem: function (key, dValue = "") {
        if (this.isAvailable()) {
            return localStorage.getItem(key);
        } else {
            return dValue;
        }
    }
}


/* Check for 'localStorage' or 'sessionStorage' */
/*
globalFuncs.storageAvailable = function(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }

}
*/

// globalFuncs.getUrlParameter = function getUrlParameter(url) {
//   // get query string from url (optional) or window
//   var queryString = url ? url.split('=')[1] : window.location.search.slice(1);
//   return queryString;
// }
// globalFuncs.setUrlParameter = function setUrlParameter(value) {
//   //In case url contains already a parameter remove parameter
//   if(window.location.href.indexOf('=') != -1) {
//       location.href = location.href.substr(0,window.location.href.indexOf('='));
//   }
//   location.href = location.href + "=" + value
// }


globalFuncs.HDWallet = {


    defaultDPath: "m/44'/60'/0'/0",       // first address: m/44'/60'/0'/0/0
    alternativeDPath: "m/44'/60'/0'",         // first address: m/44'/60'/0/0
    customDPath: "m/44'/60'/1'/0",       // first address: m/44'/60'/1'/0/0
    ledgerPath: "m/44'/60'/0'",         // first address: m/44'/60'/0/0
    ledgerClassicPath: "m/44'/60'/160720'/0'", // first address: m/44'/60'/160720'/0/0
    trezorTestnetPath: "m/44'/1'/0'/0",        // first address: m/44'/1'/0'/0/0
    trezorClassicPath: "m/44'/61'/0'/0",       // first address: m/44'/61'/0'/0/0
    trezorPath: "m/44'/60'/0'/0",       // first address: m/44'/60'/0'/0/0
    hwUbqPath: "m/44'/108'/0'/0",      // first address: m/44'/40'/0'/0/0
    hwExpansePath: "m/44'/40'/0'/0",       // first address: m/44'/40'/0'/0/0
    hwEllaismPath: "m/44'/163'/0'/0",      // first address: m/44'/163'/0'/0/0
    hwCallistoPath: "m/44'/820'/0'/0",      // first address: m/44'/820'/0'/0/0
    hwSocialPath: "m/44'/1128'/0'/0",     // first address: m/44'/1128'/0'/0/0
    hwMusicoinPath: "m/44'/184'/0'/0",      // first address: m/44'/184'/0'/0/0
    hwRskPath: "m/44'/137'/0'/0",      // first address : m/44'/137'/0'/0/0
    hwESNetworkPath: "m/44'/31102'/0'/0",      // first address : m/44'/31102'/0'/0/0
    hwPirlPath: "m/44'/164'/0'/0",      // first address: m/44'/164'/0'/0/0
};

globalFuncs.getWalletPath = function (walletType = 'trezor', nodeType = nodes.nodeTypes.CLO) {

    if (walletType === "ledger") {
        switch (nodeType) {
            case nodes.nodeTypes.ETH:
                return globalFuncs.HDWallet.ledgerPath;
            case nodes.nodeTypes.ETC:
                return globalFuncs.HDWallet.ledgerClassicPath;
            case nodes.nodeTypes.EXP:
                return globalFuncs.HDWallet.hwExpansePath;
            case nodes.nodeTypes.UBQ:
                return globalFuncs.HDWallet.hwUbqPath;
            case nodes.nodeTypes.PIRL:
                return globalFuncs.HDWallet.hwPirlPath;
            default:
                return globalFuncs.HDWallet.ledgerPath;
        }
    } else if (walletType === "trezor") {
        switch (nodeType) {
            case nodes.nodeTypes.ETH:
                return globalFuncs.HDWallet.trezorPath;
            case nodes.nodeTypes.ETC:
                return globalFuncs.HDWallet.trezorClassicPath;
            case nodes.nodeTypes.ETCT:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.Ropsten:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.Rinkeby:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.Kovan:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.EXP:
                return globalFuncs.HDWallet.hwExpansePath;
            case nodes.nodeTypes.UBQ:
                return globalFuncs.HDWallet.hwUbqPath;
            case nodes.nodeTypes.RSK:
                return globalFuncs.HDWallet.hwRskPath;
            case nodes.nodeTypes.ELLA:
                return globalFuncs.HDWallet.hwEllaismPath;
            case nodes.nodeTypes.CLO:
                return globalFuncs.HDWallet.hwCallistoPath;
            case nodes.nodeTypes.CLOT:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.ETSC:
                return globalFuncs.HDWallet.hwSocialPath;
            case nodes.nodeTypes.MUSIC:
                return globalFuncs.HDWallet.hwMusicoinPath;
            case nodes.nodeTypes.ESN:
                return globalFuncs.HDWallet.hwESNetworkPath;
            case nodes.nodeTypes.PIRL:
                return globalFuncs.HDWallet.hwPirlPath;
            default:
                return globalFuncs.HDWallet.defaultDPath;
        }
    } else {
        switch (nodeType) {
            case nodes.nodeTypes.ETH:
                return globalFuncs.HDWallet.defaultDPath;
            case nodes.nodeTypes.ETC:
                return globalFuncs.HDWallet.trezorClassicPath;
            case nodes.nodeTypes.ETCT:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.Ropsten:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.Rinkeby:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.Kovan:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.EXP:
                return globalFuncs.HDWallet.hwExpansePath;
            case nodes.nodeTypes.UBQ:
                return globalFuncs.HDWallet.hwUbqPath;
            case nodes.nodeTypes.CLO:
                return globalFuncs.HDWallet.hwCallistoPath;
            case nodes.nodeTypes.CLOT:
                return globalFuncs.HDWallet.trezorTestnetPath;
            case nodes.nodeTypes.ETSC:
                return globalFuncs.HDWallet.hwSocialPath;
            case nodes.nodeTypes.MUSIC:
                return globalFuncs.HDWallet.hwMusicoinPath;
            case nodes.nodeTypes.ESN:
                return globalFuncs.HDWallet.hwESNetworkPath;
            case nodes.nodeTypes.PIRL:
                return globalFuncs.HDWallet.hwPirlPath;
            default:
                return globalFuncs.HDWallet.defaultDPath;
        }


    }
}

module.exports = globalFuncs;
