"use strict";

var encryptCtrl = function($scope, walletService) {
    $scope.ajaxReq = ajaxReq;

    $scope.input = {};

    walletService.wallet = null;
    $scope.showPass = true;

    $scope.unlockWallet = false;

    $scope.newWallet = false;

    $scope.newWalletDetails = {
        fileName: null,
        blob: null,
        downloaded: false
    };
    $scope.loading = false;
    $scope.showPaperWallet = false;

    // We can customize if we like
    $scope.options = {
        kdf: globalFuncs.kdf,
        n: globalFuncs.scrypt.n
    };

    $scope.networks = globalFuncs.networks;

    $scope.$on("ChangeWallet", () => {
        $scope.unlockWallet = true;
    });

    $scope.reEncrypt = function reEncrypt($event, password) {
        $event.preventDefault();
        $scope.loading = true;

        if ($scope.isStrongPass(password)) {
            var wallet_ = walletService.wallet.toV3(password, $scope.options);

            walletService.password = password;

            $scope.newWallet = true;

            $scope.newWalletDetails = {
                blob: globalFuncs.getBlob("text/json;charset=UTF-8", wallet_),
                fileName: walletService.wallet.getV3Filename()
            };
        } else {
            $scope.notifier.danger(globalFuncs.errorMsgs[1]);
        }
        $scope.loading = false;
    };

    $scope.isStrongPass = function(password) {
        return globalFuncs.isStrongPass(password);
    };

    $scope.downloaded = function() {
        $scope.newWalletDetails.downloaded = true;
    };

    $scope.continueToPaper = function() {
        $scope.showPaperWallet = true;
    };

    $scope.printQRCode = function() {
        globalFuncs.printPaperWallets(
            JSON.stringify([
                {
                    address: walletService.wallet.getChecksumAddressString(),
                    private: walletService.wallet.getPrivateKeyString()
                }
            ])
        );
    };

    $scope.getAddress = function() {
        $scope.input = {};

        walletService.wallet = null;

        $scope.showPass = true;

        $scope.unlockWallet = false;

        $scope.newWallet = false;

        $scope.newWalletDetails = {
            fileName: null,
            blob: null,
            downloaded: false
        };
        $scope.loading = false;
        $scope.showPaperWallet = false;
        walletService.wallet = null;
    };
};
module.exports = encryptCtrl;
