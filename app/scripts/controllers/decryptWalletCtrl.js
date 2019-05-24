"use strict";

const AddressOnlyWallet = require("../AddressOnlyWallet");

const _sample = require("lodash/sample");

const Transport = require("@ledgerhq/hw-transport-u2f").default;
const LedgerEth = require("@ledgerhq/hw-app-eth").default;

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
    $scope.wd = false;

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
        uiFuncs.notifier.info(
            globalFuncs.successMsgs[4] +
                document.getElementById("fselector").files[0].name
        );
        try {
            $scope.requireFPass = Wallet.walletRequirePass($fileContent);
            $scope.showFDecrypt = !$scope.requireFPass;
            $scope.fileContent = $fileContent;
        } catch (e) {
            uiFuncs.notifier.danger(e);
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
            manualprivkey.length === 128 || manualprivkey.length === 132;
        $scope.showPDecrypt = manualprivkey.length === 64;
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
            ].setBalanceOfNetwork();
        }
        $scope.HDWallet.id = 0;
        $scope.HDWallet.numWallets = start + limit;
    };
    $scope.setHDAddressesHWWallet = function(start, limit) {
        $scope.HDWallet.wallets = [];
        for (let i = start; i < start + limit; i++) {
            const derivedKey = $scope.HDWallet.hdk.derive("m/" + i);
            if ($scope.walletType === "ledger") {
                $scope.HDWallet.wallets.push(
                    new Wallet(
                        undefined,
                        derivedKey.publicKey,
                        $scope.HDWallet.dPath + "/" + i,
                        $scope.walletType,
                        $scope.ledger
                    )
                );
            } else if ($scope.walletType === "digitalBitbox") {
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
            ].setBalanceOfNetwork();
        }
        $scope.HDWallet.id = 0;
        $scope.HDWallet.numWallets = start + limit;
    };
    $scope.AddRemoveHDAddresses = function(isAdd) {
        if (
            $scope.walletType === "ledger" ||
            $scope.walletType === "trezor" ||
            $scope.walletType === "digitalBitbox"
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
        uiFuncs.notifier.info(globalFuncs.successMsgs[1]);
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
                    uiFuncs.notifier.danger(globalFuncs.errorMsgs[37]);
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
                $scope.mnemonicModel.open();
                $scope.onHDDPathChange($scope.mnemonicPassword);
            } else if ($scope.showParityDecrypt) {
                $scope.wallet = Wallet.fromParityPhrase($scope.parityPhrase);
            }
            walletService.wallet = $scope.wallet;
        } catch (e) {
            uiFuncs.notifier.danger(globalFuncs.errorMsgs[6] + e);
        }
        if ($scope.wallet != null)
            uiFuncs.notifier.info(globalFuncs.successMsgs[1]);
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

    $scope.digitalBitboxCallback = function(result, error) {
        $scope.HDWallet.digitalBitboxSecret = "";
        if (typeof result !== "undefined") {
            $scope.HWWalletCreate(
                result["publicKey"],
                result["chainCode"],
                "digitalBitbox",
                $scope.HDWallet.dPath
            );
            uiFuncs.notifier.close();
        } else uiFuncs.notifier.danger(error);
    };
    $scope.scanLedger = function() {
        Transport.create()
            .then(transport => {
                const eth = new LedgerEth(transport);
                $scope.ledger = eth;

                const path = $scope.getLedgerPath();
                const _display = false;
                const _chainCode = true;

                eth.getAddress(path, _display, _chainCode).then(result => {
                    const { publicKey, address, chainCode = 60 } = result;
                    $scope.HWWalletCreate(publicKey, chainCode, "ledger", path);
                });
            })
            .catch(error => {
                $scope.ledgerError = true;
                $scope.ledgerErrorString = error;
            });
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
        const path = $scope.getTrezorPath();
        TrezorConnect.getPublicKey({ path })
            .then(
                ({
                    success,
                    payload: {
                        path,
                        serializedPath,
                        xpub,
                        chainCode,
                        childNum,
                        publicKey,
                        fingerprint,
                        depth,
                        error = ""
                    }
                }) => {
                    if (!success) {
                        throw error;
                    }
                    $scope.HWWalletCreate(
                        publicKey,
                        chainCode,
                        "trezor",
                        $scope.getTrezorPath()
                    );
                }
            )
            .catch(err => {
                $scope.trezorError = true;
                $scope.trezorErrorString = err;
            });
    };

    $scope.getLedgerPath = $scope.getTrezorPath = function() {
        return $scope.HDWallet.dPath;
    };

    $scope.scanMetamask = function() {
        const web3 = window.web3;

        if (!web3) {
            uiFuncs.notifier.danger("ClassicMask / Metamask / Mist not found");
        } else {
            web3.eth.getAccounts(function(err, accounts) {
                if (err) {
                    uiFuncs.notifier.danger(
                        err +
                            ". Are you sure you are on a secure (SSL / HTTPS) connection?"
                    );
                } else if (!(Array.isArray(accounts) && accounts.length > 0)) {
                    uiFuncs.notifier.danger("Unlock Account");
                } else {
                    const address = accounts[0];
                    const addressBuffer = Buffer.from(address.slice(2), "hex");
                    walletService.wallet = new Web3Wallet(addressBuffer);

                    const network =
                        globalFuncs.networks[walletService.wallet.network];

                    $scope.changeNode(network);

                    walletService.wallet.setBalanceOfNetwork();
                    $scope.wallet = walletService.wallet;
                    uiFuncs.notifier.info(globalFuncs.successMsgs[6]);
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

    if (
        [globalService.tabs.viewWalletInfo.id].includes(
            globalService.currentTab
        )
    ) {
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
