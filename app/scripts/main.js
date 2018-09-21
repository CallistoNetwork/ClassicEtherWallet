"use strict";
require("./localStoragePolyfill");
let IS_CX = false;
if (typeof chrome != "undefined")
    IS_CX = chrome.windows === undefined ? false : true;
var angular = require("angular");
var angularTranslate = require("angular-translate");
var angularTranslateErrorLog = require("angular-translate-handler-log");
var angularSanitize = require("angular-sanitize");
var angularAnimate = require("angular-animate");
var bip39 = require("bip39");
var HDKey = require("hdkey");
window.hd = { bip39: bip39, HDKey: HDKey };
var BigNumber = require("bignumber.js");
window.BigNumber = BigNumber;
var marked = require("./staticJS/customMarked");
window.marked = marked;
var ethUtil = require("ethereumjs-util");
ethUtil.crypto = require("crypto");
ethUtil.Tx = require("ethereumjs-tx");
ethUtil.scrypt = require("scryptsy");
ethUtil.uuid = require("uuid");
ethUtil.solidityCoder = require("./solidity/coder");
ethUtil.solidityUtils = require("./solidity/utils");
ethUtil.WAValidator = require("wallet-address-validator");
window.ethUtil = ethUtil;
var format = require("string-format");
window.format = format;
var browser = require("detect-browser");
window.browser = browser;

// fixme: window variables should be accessed as services for dependency injection

// we can keep winow vars for useage in conosole, but pain to keep handling order right

var nodes = require("./nodes");
window.nodes = nodes;

const coinPrice = require("./coinPrice");

window._coinPrice = coinPrice;

var Wallet = require("./myetherwallet");
window.Wallet = Wallet;
var Web3Wallet = require("./web3Wallet");
window.Web3Wallet = Web3Wallet;
var Token = require("./tokenlib");
window.Token = Token;
var globalFuncs = require("./globalFuncs");
window.globalFuncs = globalFuncs;
var uiFuncs = require("./uiFuncs");
window.uiFuncs = uiFuncs;
var etherUnits = require("./etherUnits");
window.etherUnits = etherUnits;
var ajaxReq = require("./ajaxReq");
window.ajaxReq = ajaxReq;

var ethFuncs = require("./ethFuncs");
window.ethFuncs = ethFuncs;
var Validator = require("./validator");
window.Validator = Validator;

var changeNow = require("./changeNow");

window.changeNow = changeNow;

var ens = require("./ens");
window.ens = ens;
var translate = require("./translations/translate.js");

if (IS_CX) {
    var cxFuncs = require("./cxFuncs");
    window.cxFuncs = cxFuncs;
} else {
    var u2f = require("./staticJS/u2f-api");
    var ledger3 = require("./staticJS/ledger3");
    var ledgerEth = require("./staticJS/ledger-eth");
    var trezorConnect = require("./staticJS/trezorConnect");
    var digitalBitboxUsb = require("./staticJS/digitalBitboxUsb");
    var digitalBitboxEth = require("./staticJS/digitalBitboxEth");
    window.u2f = u2f;
    window.Ledger3 = ledger3;
    window.ledgerEth = ledgerEth;
    window.TrezorConnect = trezorConnect.TrezorConnect;
    window.DigitalBitboxUsb = digitalBitboxUsb;
    window.DigitalBitboxEth = digitalBitboxEth;
}
var CustomGasMessages = require("./customGas.js");
window.CustomGasMessages = CustomGasMessages;

// CONTROLLERS

const tabsCtrl = require("./controllers/tabsCtrl");
const viewCtrl = require("./controllers/viewCtrl");
const coldStakingCtrl = require("./controllers/coldStakingCtrl");
const walletGenCtrl = require("./controllers/walletGenCtrl");
const bulkGenCtrl = require("./controllers/bulkGenCtrl");
const decryptWalletCtrl = require("./controllers/decryptWalletCtrl");
const viewWalletCtrl = require("./controllers/viewWalletCtrl");
const TxStatusController = require("./controllers/TxStatus.controller");
const sendTxCtrl = require("./controllers/sendTxCtrl");
const swapCtrl = require("./controllers/swapCtrl");
const signMsgCtrl = require("./controllers/signMsgCtrl");
const contractsCtrl = require("./controllers/contractsCtrl");
const broadcastTxCtrl = require("./controllers/broadcastTxCtrl");
const ensCtrl = require("./controllers/ensCtrl");
const DexnsController = require("./controllers/DexnsController");
const offlineTxCtrl = require("./controllers/offlineTxCtrl");
const walletBalanceCtrl = require("./controllers/walletBalanceCtrl");
const backgroundNodeCtrl = require("./controllers/backgroundNodeCtrl");
const encryptCtrl = require("./controllers/encryptCtrl");
const helpersCtrl = require("./controllers/helpersCtrl");
const messagesControl = require("./controllers/messagesCtrl");
const switchNetworkCtrl = require("./controllers/switchNetworkCtrl");

// cx controllers

const addWalletCtrl = require("./controllers/CX/addWalletCtrl");
const cxDecryptWalletCtrl = require("./controllers/CX/cxDecryptWalletCtrl");
const myWalletsCtrl = require("./controllers/CX/myWalletsCtrl");
const mainPopCtrl = require("./controllers/CX/mainPopCtrl");
const quickSendCtrl = require("./controllers/CX/quickSendCtrl");

// SERVICES

const lookupService = require("./services/lookup");
const globalService = require("./services/globalService");
const coldStakingService = require("./services/coldStakingService");
const modalService = require("./services/modalService");
const walletService = require("./services/walletService");
const messageService = require("./services/messageService");
const dexnsService = require("./services/dexnsService");
const backgroundNodeService = require("./services/backgroundNodeService");

// DIRECTIVES
const eosKeypair = require("./directives/eos-keypair");
const sendTxModal = require("./directives/sendTxModal");
const validTxHash = require("./directives/validTxHash");
const swapOpenOrderForm = require("./directives/swapOpenOrderForm");
const swapInitForm = require("./directives/swapInitForm");
const customNodeForm = require("./directives/customNodeForm");
const officialityChecker = require("./directives/officiality-checker");
const lookup = require("./directives/crosschain-lookup");
const dexnsNameDisplay = require("./directives/dexns-name-display");
const blockiesDrtv = require("./directives/blockiesDrtv");
const addressFieldDrtv = require("./directives/addressFieldDrtv");
const QRCodeDrtv = require("./directives/QRCodeDrtv");
const walletDecryptDrtv = require("./directives/walletDecryptDrtv");
const cssThemeDrtv = require("./directives/cssThemeDrtv");
const cxWalletDecryptDrtv = require("./directives/cxWalletDecryptDrtv");
const fileReaderDrtv = require("./directives/fileReaderDrtv");
const transactionCost = require("./directives/transactionCostDtrv");
const arrayInputDrtv = require("./directives/arrayInputDrtv");
const newMessagesDrtv = require("./directives/newMessagesDrtv");
const accountBalanceTable = require("./directives/accountBalanceTable");
const tokenBalances = require("./directives/tokenBalances");
const sidebarAds = require("./directives/sidebar-ads");
const sidebar = require("./directives/sidebar");
const accountInfo = require("./directives/accountInfo");
const messagesOverview = require("./directives/messagesOverview");
const sendTransactionFormDrtv = require("./directives/sendTransactionForm");
const dexnsTokenRegistrationForm = require("./directives/dexns-token-registration");
const networkInfo = require("./directives/networkInfo");
const txStatus = require("./directives/txStatus");

const coinIcon = require("./directives/coinIcon");

var app = angular.module("mewApp", [
    "pascalprecht.translate",
    "ngSanitize",
    "ngAnimate"
]);
app.config([
    "$compileProvider",
    function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(
            /^\s*(|blob|https|mailto):/
        );
    }
]);
app.config([
    "$translateProvider",
    function($translateProvider) {
        $translateProvider.useMissingTranslationHandlerLog();
        new translate($translateProvider);
    }
]);
app.config([
    "$animateProvider",
    function($animateProvider) {
        $animateProvider.classNameFilter(/^no-animate$/);
    }
]);
app.factory("globalService", [
    "$http",
    "$httpParamSerializerJQLike",
    globalService
]);
app.factory("walletService", walletService);
app.factory("backgroundNodeService", backgroundNodeService);

app.factory("changeNowService", changeNow);
app.factory("modalService", modalService);

app.factory("messageService", messageService);

app.factory("dexnsService", dexnsService);

app.factory("lookupService", ["dexnsService", lookupService]);

app.factory("messageService", messageService);
app.factory("coldStakingService", ["walletService", coldStakingService]);

app.directive("coinIcon", coinIcon);
app.directive("validTxHash", validTxHash);
app.directive("swapInitForm", swapInitForm);
app.directive("accountBalanceTable", accountBalanceTable);
app.directive("sidebarAds", sidebarAds);
app.directive("sidebar", ["walletService", "$timeout", sidebar]);
app.directive("accountInfo", accountInfo);
app.directive("tokenBalances", tokenBalances);
app.directive("sendTransactionForm", sendTransactionFormDrtv);
app.directive("officialityChecker", [officialityChecker]);
app.directive("dexnsTokenRegistrationForm", dexnsTokenRegistrationForm);
app.directive("dexnsNameDisplay", [
    "dexnsService",
    "walletService",
    "globalService",
    dexnsNameDisplay
]);
app.directive("sendTxModal", sendTxModal);
app.directive("networkInfo", networkInfo);
app.directive("txStatus", txStatus);
app.directive("eosKeypair", eosKeypair);
app.directive("swapOpenOrderForm", swapOpenOrderForm);
app.directive("lookup", ["$rootScope", "lookupService", lookup]);
app.directive("blockieAddress", blockiesDrtv);
app.directive("cssThemeDrtv", cssThemeDrtv);
app.directive("addressField", ["lookupService", addressFieldDrtv]);
app.directive("qrCode", QRCodeDrtv);
app.directive("onReadFile", fileReaderDrtv);
app.directive("walletDecryptDrtv", walletDecryptDrtv);
app.directive("cxWalletDecryptDrtv", cxWalletDecryptDrtv);
app.directive("messagesOverview", [
    "globalService",
    "walletService",
    "messageService",
    messagesOverview
]);
app.directive("arrayInputDrtv", arrayInputDrtv);
app.directive("newMessagesDrtv", ["globalService", newMessagesDrtv]);
app.directive("transactionCost", [transactionCost]);
app.directive("sendContractTx", [
    "walletService",
    require("./directives/sendContractTx")
]);

app.directive("customNodeForm", [customNodeForm]);

app.controller("tabsCtrl", [
    "$http",
    "$scope",
    "globalService",
    "walletService",
    "$translate",
    "$sce",
    tabsCtrl
]);
app.controller("switchNetworkCtrl", [
    "$scope",
    "$rootScope",
    "globalService",
    switchNetworkCtrl
]);
app.controller("viewCtrl", ["$scope", "globalService", "$sce", viewCtrl]);
app.controller("walletGenCtrl", ["$rootScope", "$scope", walletGenCtrl]);
app.controller("bulkGenCtrl", ["$scope", bulkGenCtrl]);
app.controller("decryptWalletCtrl", [
    "$rootScope",
    "$scope",
    "$sce",
    "walletService",
    "globalService",
    decryptWalletCtrl
]);
app.controller("viewWalletCtrl", [
    "$scope",
    "$rootScope",
    "walletService",
    "coldStakingService",
    viewWalletCtrl
]);
app.controller("TxStatusController", [
    "$scope",
    "$rootScope",
    TxStatusController
]);
app.controller("sendTxCtrl", [
    "$scope",
    "$sce",
    "$rootScope",
    "walletService",
    sendTxCtrl
]);

app.controller("swapCtrl", [
    "$scope",
    "$rootScope",
    "$interval",
    "walletService",
    swapCtrl
]);
app.controller("signMsgCtrl", ["$scope", "$sce", "walletService", signMsgCtrl]);
app.controller("contractsCtrl", [
    "$scope",
    "$sce",
    "$rootScope",
    "walletService",
    contractsCtrl
]);
app.controller("ensCtrl", [
    "$scope",
    "$sce",
    "$rootScope",
    "walletService",
    ensCtrl
]);
app.controller("DexnsController", [
    "$scope",
    "$sce",
    "$rootScope",
    "walletService",
    "backgroundNodeService",
    "dexnsService",
    DexnsController
]);
app.controller("offlineTxCtrl", [
    "$scope",
    "$sce",
    "$rootScope",
    "walletService",
    offlineTxCtrl
]);
app.controller("walletBalanceCtrl", [
    "$scope",
    "$sce",
    "walletService",
    "backgroundNodeService",
    "modalService",
    "coldStakingService",
    "messageService",
    walletBalanceCtrl
]);
app.controller("helpersCtrl", ["$scope", helpersCtrl]);
app.controller("messagesCtrl", [
    "$scope",
    "$rootScope",
    "$interval",
    "globalService",
    "messageService",
    "walletService",
    "backgroundNodeService",
    messagesControl
]);
app.controller("encryptCtrl", ["$scope", "walletService", encryptCtrl]);
app.controller("backgroundNodeCtrl", [
    "$scope",
    "$interval",
    "backgroundNodeService",
    backgroundNodeCtrl
]);

app.controller("broadcastTxCtrl", ["$scope", broadcastTxCtrl]);

app.controller("coldStakingCtrl", [
    "$scope",
    "$rootScope",
    "walletService",
    "modalService",
    "coldStakingService",
    coldStakingCtrl
]);
if (IS_CX) {
    app.controller("addWalletCtrl", ["$scope", "$sce", addWalletCtrl]);
    app.controller("myWalletsCtrl", [
        "$scope",
        "$sce",
        "walletService",
        myWalletsCtrl
    ]);
    app.controller("mainPopCtrl", ["$scope", "$sce", mainPopCtrl]);
    app.controller("quickSendCtrl", ["$scope", "$sce", quickSendCtrl]);
    app.controller("cxDecryptWalletCtrl", [
        "$scope",
        "$sce",
        "walletService",
        cxDecryptWalletCtrl
    ]);
}
