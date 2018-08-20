"use strict";

const AddressOnlyWallet = require("../AddressOnlyWallet");

const _sample = require("lodash/sample");

const decryptWalletCtrl = function(
    $rootScope,
    $scope,
    $sce,
    walletService,
    globalService
) {
    $scope.walletType = "";
    $scope.requireFPass = $scope.requirePPass = $scope.showFDecrypt = $scope.showPDecrypt = $scope.showAOnly = $scope.showParityDecrypt = false;
    $scope.filePassword = "";
    $scope.fileContent = "";
    $scope.isSSL = window.location.protocol === "https:";
    $scope.nodeType = ajaxReq.type;

    $scope.HDWallet = Object.assign({}, globalFuncs.HDWallet, {
        numWallets: 0,
        walletsPerDialog: 5,
        wallets: [],
        id: 0,
        hdk: null,
        dPath: globalFuncs.HDWallet.defaultDPath
    });

    $scope.mnemonicModel = new Modal(document.getElementById("mnemonicModel"));
    $scope.$watch("ajaxReq.type", function() {
        $scope.nodeType = ajaxReq.type;
        $scope.setdPath();
    });
    $scope.$watch("walletType", function() {
        $scope.setdPath();
    });
    $scope.setdPath = function() {
        $scope.HDWallet.dPath = globalFuncs.getWalletPath(
            $scope.walletType,
            $scope.nodeType
        );
    };
    $scope.onHDDPathChange = function(password = $scope.mnemonicPassword) {
        $scope.HDWallet.numWallets = 0;
        if ($scope.walletType === "pastemnemonic") {
            $scope.HDWallet.hdk = hd.HDKey.fromMasterSeed(
                hd.bip39.mnemonicToSeed($scope.manualmnemonic.trim(), password)
            );
            $scope.setHDAddresses(
                $scope.HDWallet.numWallets,
                $scope.HDWallet.walletsPerDialog
            );
        } else if ($scope.walletType === "ledger") {
            $scope.scanLedger();
        } else if ($scope.walletType === "trezor") {
            $scope.scanTrezor();
        } else if ($scope.walletType === "digitalBitbox") {
            $scope.scanDigitalBitbox();
        }
    };

    $scope.onCustomHDDPathChange = function() {
        $scope.HDWallet.dPath = $scope.HDWallet.customDPath;
        $scope.onHDDPathChange();
    };
    $scope.showContent = function($fileContent) {
        $scope.notifier.info(
            globalFuncs.successMsgs[4] +
                document.getElementById("fselector").files[0].name
        );
        try {
            $scope.requireFPass = Wallet.walletRequirePass($fileContent);
            $scope.showFDecrypt = !$scope.requireFPass;
            $scope.fileContent = $fileContent;
        } catch (e) {
            $scope.notifier.danger(e);
        }
    };

    $scope.openFileDialog = function($fileContent) {
        document.getElementById("fselector").click();
    };
    $scope.onFilePassChange = function() {
        $scope.showFDecrypt = $scope.filePassword.length >= 0;
    };
    $scope.onPrivKeyChange = function() {
        const manualprivkey = fixPkey($scope.manualprivkey);

        $scope.requirePPass =
            manualprivkey.length == 128 || manualprivkey.length == 132;
        $scope.showPDecrypt = manualprivkey.length == 64;
    };
    $scope.onPrivKeyPassChange = function() {
        $scope.showPDecrypt = $scope.privPassword.length > 0;
    };
    $scope.onMnemonicChange = function() {
        $scope.showMDecrypt = hd.bip39.validateMnemonic($scope.manualmnemonic);
    };
    $scope.onParityPhraseChange = function() {
        if ($scope.parityPhrase) $scope.showParityDecrypt = true;
        else $scope.showParityDecrypt = false;
    };
    $scope.onAddressChange = function() {
        $scope.showAOnly = Validator.isValidAddress($scope.addressOnly);
    };
    $scope.setHDAddresses = function(start, limit) {
        $scope.HDWallet.wallets = [];
        for (var i = start; i < start + limit; i++) {
            $scope.HDWallet.wallets.push(
                new Wallet(
                    $scope.HDWallet.hdk.derive(
                        $scope.HDWallet.dPath + "/" + i
                    )._privateKey
                )
            );
            $scope.HDWallet.wallets[
                $scope.HDWallet.wallets.length - 1
            ].setBalance(false);
        }
        $scope.HDWallet.id = 0;
        $scope.HDWallet.numWallets = start + limit;
    };
    $scope.setHDAddressesHWWallet = function(start, limit, ledger) {
        $scope.HDWallet.wallets = [];
        for (var i = start; i < start + limit; i++) {
            var derivedKey = $scope.HDWallet.hdk.derive("m/" + i);
            if ($scope.walletType == "ledger") {
                $scope.HDWallet.wallets.push(
                    new Wallet(
                        undefined,
                        derivedKey.publicKey,
                        $scope.HDWallet.dPath + "/" + i,
                        $scope.walletType,
                        $scope.ledger
                    )
                );
            } else if ($scope.walletType == "digitalBitbox") {
                $scope.HDWallet.wallets.push(
                    new Wallet(
                        undefined,
                        derivedKey.publicKey,
                        $scope.HDWallet.dPath + "/" + i,
                        $scope.walletType,
                        $scope.digitalBitbox
                    )
                );
            } else {
                $scope.HDWallet.wallets.push(
                    new Wallet(
                        undefined,
                        derivedKey.publicKey,
                        $scope.HDWallet.dPath + "/" + i,
                        $scope.walletType
                    )
                );
            }
            $scope.HDWallet.wallets[$scope.HDWallet.wallets.length - 1].type =
                "addressOnly";
            $scope.HDWallet.wallets[
                $scope.HDWallet.wallets.length - 1
            ].setBalance(false);
        }
        $scope.HDWallet.id = 0;
        $scope.HDWallet.numWallets = start + limit;
    };
    $scope.AddRemoveHDAddresses = function(isAdd) {
        if (
            $scope.walletType == "ledger" ||
            $scope.walletType == "trezor" ||
            $scope.walletType == "digitalBitbox"
        ) {
            if (isAdd)
                $scope.setHDAddressesHWWallet(
                    $scope.HDWallet.numWallets,
                    $scope.HDWallet.walletsPerDialog
                );
            else
                $scope.setHDAddressesHWWallet(
                    $scope.HDWallet.numWallets -
                        2 * $scope.HDWallet.walletsPerDialog,
                    $scope.HDWallet.walletsPerDialog
                );
        } else {
            if (isAdd)
                $scope.setHDAddresses(
                    $scope.HDWallet.numWallets,
                    $scope.HDWallet.walletsPerDialog
                );
            else
                $scope.setHDAddresses(
                    $scope.HDWallet.numWallets -
                        2 * $scope.HDWallet.walletsPerDialog,
                    $scope.HDWallet.walletsPerDialog
                );
        }
    };
    $scope.setHDWallet = function() {
        walletService.wallet = $scope.wallet =
            $scope.HDWallet.wallets[$scope.HDWallet.id];
        $scope.mnemonicModel.close();
        $scope.notifier.info(globalFuncs.successMsgs[1]);
    };
    $scope.decryptWallet = function() {
        $scope.wallet = null;
        try {
            if ($scope.showPDecrypt && $scope.requirePPass) {
                $scope.wallet = Wallet.fromMyEtherWalletKey(
                    $scope.manualprivkey,
                    $scope.privPassword
                );
                walletService.password = $scope.privPassword;
            } else if ($scope.showPDecrypt && !$scope.requirePPass) {
                if (!Validator.isValidHex($scope.manualprivkey)) {
                    $scope.notifier.danger(globalFuncs.errorMsgs[37]);
                    return;
                }
                $scope.wallet = new Wallet(fixPkey($scope.manualprivkey));
                walletService.password = "";
            } else if ($scope.showFDecrypt) {
                $scope.wallet = Wallet.getWalletFromPrivKeyFile(
                    $scope.fileContent,
                    $scope.filePassword
                );
                walletService.password = $scope.filePassword;
            } else if ($scope.showMDecrypt) {
                $scope.mnemonicModel = new Modal(
                    document.getElementById("mnemonicModel")
                );
                $scope.mnemonicModel.open();
                $scope.onHDDPathChange($scope.mnemonicPassword);
            } else if ($scope.showParityDecrypt) {
                $scope.wallet = Wallet.fromParityPhrase($scope.parityPhrase);
            }
            walletService.wallet = $scope.wallet;
        } catch (e) {
            $scope.notifier.danger(globalFuncs.errorMsgs[6] + e);
        }
        if ($scope.wallet != null)
            $scope.notifier.info(globalFuncs.successMsgs[1]);
    };
    $scope.decryptAddressOnly = function() {
        if (Validator.isValidAddress($scope.addressOnly)) {
            Object.assign(walletService, {
                wallet: new AddressOnlyWallet($scope.addressOnly)
            });

            uiFuncs.notifier.info(globalFuncs.successMsgs[1]);
        } else {
            uiFuncs.notifier.danger(globalFuncs.errorMsgs[3]);
        }
    };
    $scope.HWWalletCreate = function(publicKey, chainCode, walletType, path) {
        $scope.mnemonicModel = new Modal(
            document.getElementById("mnemonicModel")
        );
        $scope.mnemonicModel.open();
        $scope.HDWallet.hdk = new hd.HDKey();
        $scope.HDWallet.hdk.publicKey = new Buffer(publicKey, "hex");
        $scope.HDWallet.hdk.chainCode = new Buffer(chainCode, "hex");
        $scope.HDWallet.numWallets = 0;
        $scope.HDWallet.dPath = path;
        $scope.setHDAddressesHWWallet(
            $scope.HDWallet.numWallets,
            $scope.HDWallet.walletsPerDialog,
            walletType
        );
        walletService.wallet = null;
    };
    $scope.ledgerCallback = function(result, error) {
        if (result) {
            $scope.HWWalletCreate(
                result["publicKey"],
                result["chainCode"],
                "ledger",
                $scope.getLedgerPath()
            );
        } else {
            $scope.ledgerError = true;
            $scope.ledgerErrorString = error;
            $scope.$apply();
        }
    };
    $scope.trezorCallback = function(response) {
        if (response.success) {
            $scope.HWWalletCreate(
                response.publicKey,
                response.chainCode,
                "trezor",
                $scope.getTrezorPath()
            );
        } else {
            $scope.trezorError = true;
            $scope.trezorErrorString = response.error;
            $scope.$apply();
        }
    };
    $scope.digitalBitboxCallback = function(result, error) {
        $scope.HDWallet.digitalBitboxSecret = "";
        if (typeof result != "undefined") {
            $scope.HWWalletCreate(
                result["publicKey"],
                result["chainCode"],
                "digitalBitbox",
                $scope.HDWallet.dPath
            );
            $scope.notifier.close();
        } else $scope.notifier.danger(error);
    };
    $scope.scanLedger = function() {
        $scope.ledger = new Ledger3("w0w");
        var app = new ledgerEth($scope.ledger);

        var path = $scope.getLedgerPath();

        console.log("path", path);

        app.getAddress(path, $scope.ledgerCallback, false, true);
    };
    $scope.scanDigitalBitbox = function() {
        $scope.digitalBitbox = new DigitalBitboxUsb();
        var app = new DigitalBitboxEth(
            $scope.digitalBitbox,
            $scope.HDWallet.digitalBitboxSecret
        );
        var path = $scope.HDWallet.dPath;
        app.getAddress(path, $scope.digitalBitboxCallback);
    };
    $scope.scanTrezor = function() {
        // trezor is using the path without change level id
        var path = $scope.getTrezorPath();
        TrezorConnect.getXPubKey(path, $scope.trezorCallback, "1.4.0");
    };

    $scope.getLedgerPath = $scope.getTrezorPath = function() {
        return $scope.HDWallet.dPath;
    };

    $scope.scanMetamask = function() {
        const web3 = window.web3;

        if (!web3) {
            $scope.notifier.danger("ClassicMask / Metamask / Mist not found");
        } else {
            web3.eth.getAccounts(function(err, accounts) {
                if (err) {
                    $scope.notifier.danger(
                        err +
                            ". Are you sure you are on a secure (SSL / HTTPS) connection?"
                    );
                } else if (!(Array.isArray(accounts) && accounts.length > 0)) {
                    $scope.notifier.danger("Unlock Account");
                } else {
                    var address = accounts[0];
                    var addressBuffer = Buffer.from(address.slice(2), "hex");
                    var wallet = new Web3Wallet(addressBuffer);
                    wallet.setBalance(false);
                    // set wallet
                    walletService.wallet = wallet;
                    $scope.wallet = wallet;

                    const _node = _sample(
                        Object.values(nodes.nodeList)
                            .map((node, i) =>
                                Object.assign({}, node, {
                                    key: Object.keys(nodes.nodeList)[i]
                                })
                            )
                            .filter(node => node.type === wallet.network)
                    );

                    if (_node) {
                        $rootScope.$broadcast("ChangeNode", _node.key || 0);
                    }

                    $scope.notifier.info(globalFuncs.successMsgs[6]);
                }
            });
        }
    };

    // helper function that removes 0x prefix from strings
    function fixPkey(key) {
        if (key.indexOf("0x") === 0) {
            return key.slice(2);
        }
        return key;
    }

    if (globalService.currentTab === globalService.tabs.viewWalletInfo.id) {
        const addr =
            globalFuncs.urlGet("address", null) ||
            globalFuncs.urlGet("addr", null);

        if (addr && Validator.isValidAddress(addr)) {
            $scope.addressOnly = addr;

            $scope.decryptAddressOnly();
        }
    }
};
module.exports = decryptWalletCtrl;
