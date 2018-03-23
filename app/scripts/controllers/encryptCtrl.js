'use strict';


var encryptCtrl = function ($scope, walletService) {
    $scope.ajaxReq = ajaxReq;


    //FIXME: ng-model not working???
    $scope.input = {};


    walletService.wallet = null;


    $scope.showPass = true;

    $scope.unlockWallet = false;

    $scope.newWallet = false;

    $scope.newWalletDetails = {
        fileName: null,
        blob: null,
        downloaded: false,
    };
    $scope.loading = false;
    $scope.showPaperWallet = false;
    $scope.wallet = null;


    // We can customize if we like
    $scope.options = {
        kdf: globalFuncs.kdf,
        n: globalFuncs.scrypt.n
    };

    $scope.networks = {
        ETH: "eth_ethscan",
        ETC: "etc_epool",
        UBQ: "ubq",
        EXP: "exp",
    };


    var network = globalFuncs.urlGet('network') || null;

    if (network) {
        $rootScope.$broadcast('ChangeNode', $scope.networks[network.toUpperCase()] || 0);
    }


    $scope.$watch(function () {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function () {
        if (walletService.wallet == null) return;
        $scope.wallet = walletService.wallet;
        $scope.unlockWallet = true;

    });

    $scope.reEncrypt = function reEncrypt($event, password) {

        $event.preventDefault();
        $scope.loading = true;


        if ($scope.isStrongPass(password)) {

            var wallet_ = $scope.wallet.toV3(password, $scope.options);

            $scope.newWallet = true;

            $scope.newWalletDetails = {
                //blob: globalFuncs.getBlob("text/json;charset=UTF-8", $scope.wallet.toJSON()),
                blob: globalFuncs.getBlob("text/json;charset=UTF-8", wallet_),
                fileName: $scope.wallet.getV3Filename()
            }

        } else {
            $scope.notifier.danger(globalFuncs.errorMsgs[1]);
        }
        $scope.loading = false;


    };


    // FIXME: cannot call in html template

    $scope.isStrongPass = function (password) {

        return globalFuncs.isStrongPass(password);
    }

    $scope.downloaded = function () {
        $scope.newWalletDetails.downloaded = true;
    };

    $scope.continueToPaper = function () {
        $scope.showPaperWallet = true;
    }

    $scope.printQRCode = function () {
        globalFuncs.printPaperWallets(JSON.stringify([{
            address: $scope.wallet.getChecksumAddressString(),
            private: $scope.wallet.getPrivateKeyString()
        }]));
    };

    $scope.getAddress = function () {

        $scope.input = {};


        walletService.wallet = null;

        $scope.showPass = true;

        $scope.unlockWallet = false;

        $scope.newWallet = false;

        $scope.newWalletDetails = {
            fileName: null,
            blob: null,
            downloaded: false,
        };
        $scope.loading = false;
        $scope.showPaperWallet = false;
        $scope.wallet = null;

    }


}
module.exports = encryptCtrl;
