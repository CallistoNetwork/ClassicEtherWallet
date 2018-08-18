"use strict";
var globalService = function($http, $httpParamSerializerJQLike) {
    globalFuncs.checkAndRedirectHTTPS();
    ajaxReq.http = $http;
    ajaxReq.postSerializer = $httpParamSerializerJQLike;
    var tabs = {
        generateWallet: {
            id: 0,
            name: "NAV_GenerateWallet_alt",
            url: "generate-wallet",
            mew: true,
            cx: false
        },
        myWallet: {
            id: 1,
            name: "NAV_MyWallets",
            url: "my-wallet",
            mew: false,
            cx: true
        },
        addWallet: {
            id: 2,
            name: "NAV_AddWallet",
            url: "add-wallet",
            mew: false,
            cx: true
        },
        sendTransaction: {
            id: 3,
            name: "NAV_SendEther",
            url: "send-transaction",
            mew: true,
            cx: true
        },
        swap: {
            id: 4,
            name: "NAV_Swap",
            url: "swap",
            mew: true,
            cx: true
        },
        offlineTransaction: {
            id: 5,
            name: "NAV_Offline",
            url: "offline-transaction",
            mew: true,
            cx: false
        },
        contracts: {
            id: 6,
            name: "NAV_Contracts",
            url: "contracts",
            mew: true,
            cx: true
        },
        ens: {
            id: 7,
            name: "NAV_ENS",
            url: "ens",
            mew: true,
            cx: true
        },
        dexns: {
            id: 8,
            name: "NAV_DexNS",
            url: "dexns",
            mew: true,
            cx: true
        },
        viewWalletInfo: {
            id: 9,
            name: "NAV_ViewWallet",
            url: "view-wallet-info",
            mew: true,
            cx: false
        },
        signMsg: {
            id: 10,
            name: "NAV_SignMsg",
            url: "sign-message",
            mew: false,
            cx: false
        },
        bulkGenerate: {
            id: 11,
            name: "NAV_BulkGenerate",
            url: "bulk-generate",
            mew: false,
            cx: false
        },
        messages: {
            id: 12,
            name: "NAV_Messages",
            url: "messages",
            mew: true,
            cx: true
        },
        reEncrypt: {
            id: 13,
            name: "NAV_Encrypt",
            url: "encrypt-wallet",
            mew: true,
            cx: false
        },
        broadcastTx: {
            id: 14,
            name: "NAV_Broadcast",
            url: "broadcast-tx",
            mew: true,
            cx: true
        },
        networkInfo: {
            id: 15,
            name: "NAV_Network_Info",
            url: "network-info",
            mew: true,
            cx: true
        }
    };
    var currentTab = 0;
    if (typeof chrome !== "undefined")
        currentTab = chrome.windows === undefined ? 0 : 3;

    const navigate = _id => {
        const _tab = Object.values(this.tabs).find(tab => {
            return tab.id === _id;
        });

        if (!_tab) {
            throw new Error("Invalid Request");
        }

        this.currentTab = _id;

        location.hash = _tab.url;
    };

    const dropdownNode = false;

    return {
        tabs: tabs,
        currentTab: currentTab,
        navigate,
        dropdownNode
    };
};
module.exports = globalService;
