"use strict";
var viewWalletCtrl = function($scope, $rootScope, walletService) {
    $scope.tokenVisibility = "hidden";
    $scope.networks = globalFuncs.networks;
    walletService.wallet = null;
    walletService.password = "";
    $scope.$on("ChangeWallet", function() {
        $scope.showEnc = walletService.password !== "";
        $scope.wd = true;
        if (walletService.wallet.type === "default")
            $scope.blob = globalFuncs.getBlob(
                "text/json;charset=UTF-8",
                walletService.wallet.toJSON()
            );
        if (walletService.password !== "") {
            $scope.blobEnc = globalFuncs.getBlob(
                "text/json;charset=UTF-8",
                walletService.wallet.toV3(walletService.password, {
                    kdf: globalFuncs.kdf,
                    n: globalFuncs.scrypt.n
                })
            );
            $scope.encFileName = walletService.wallet.getV3Filename();
        }
    });

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

    $scope.resetWallet = function() {
        walletService.wallet = null;
        walletService.password = "";
        $scope.blob = $scope.blobEnc = $scope.password = "";
    };
};
module.exports = viewWalletCtrl;
