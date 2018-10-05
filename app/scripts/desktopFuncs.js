"use strict";
const _filter = require("lodash/filter");
var cxFuncs = function() {};

const storedWalletsKey = "storedWallets";

cxFuncs.getAllNickNames = function(callback) {
    const local = globalFuncs.localStorage.getItem(storedWalletsKey);

    let nickNames = [];
    if (local) {
        try {
            const arr = JSON.parse(local);

            for (let nickName in arr) {
                if (["watchOnly", "wallet"].includes(nickName.type)) {
                    nickNames.push(nickName);
                }
            }
        } catch (e) {
            nickNames = [];
        }
    }

    callback(nickNames);
};
cxFuncs.addWalletToStorage = function(address, encStr, nickname, callback) {
    nickname = nickname.replace(/(<([^>]+)>)/gi, "");
    const value = {
        nick: nickname,
        priv: encStr,
        type: "wallet"
    };
    const keyname = ethUtil.toChecksumAddress(address);
    const obj = {};
    obj[keyname] = JSON.stringify(value);
    globalFuncs.localStorage.setItem(storedWalletsKey, JSON.stringify(obj));

    callback();
};
cxFuncs.addWatchOnlyAddress = function(address, nickname, callback) {
    nickname = nickname.replace(/(<([^>]+)>)/gi, "");
    var value = {
        nick: nickname,
        type: "watchOnly"
    };
    var keyname = ethUtil.toChecksumAddress(address);
    var obj = {};
    obj[keyname] = JSON.stringify(value);
    globalFuncs.localStorage.setItem(storedWalletsKey, JSON.stringify(obj));

    callback(obj[keyname]);
};

cxFuncs.getLocalWallets = function() {
    const local = globalFuncs.localStorage.getItem(storedWalletsKey, {});
    try {
        return JSON.parse(local);
    } catch (e) {
        return {};
    }
};

cxFuncs.getStorageArr = function(filter) {
    const wallets = [];

    const items = this.getLocalWallets();

    for (const key in items) {
        if (items.hasOwnProperty(key)) {
            const tobj = JSON.parse(items[key]);
            if (tobj.type === filter) {
                tobj["addr"] = key;
                wallets.push(tobj);
            }
        }
    }
    wallets.sort(function(a, b) {
        if (a.nick < b.nick) return -1;
        if (a.nick > b.nick) return 1;
        return 0;
    });

    return wallets;
};
cxFuncs.getWalletsArr = function(callback) {
    callback(this.getStorageArr("wallet"));
};
cxFuncs.getWatchOnlyArr = function(callback) {
    callback(this.getStorageArr("watchOnly"));
};
cxFuncs.deleteAccount = function(address, callback) {
    const wallets = cxFuncs.getLocalWallets();

    const filtered = _filter(wallets, wallet => wallet.address !== address);

    globalFuncs.localStorage.setItem(storedWalletsKey, filtered);

    callback();
};
cxFuncs.editNickName = function(address, newNick, callback) {
    newNick = newNick.replace(/(<([^>]+)>)/gi, "");

    const wallets = cxFuncs.getLocalWallets();

    if (address in wallets) {
        Object.assign(wallets[address], { nick: newNick });

        globalFuncs.localStorage.setItem(
            storedWalletsKey,
            JSON.stringify(wallets)
        );
    }

    callback();
};
module.exports = cxFuncs;
