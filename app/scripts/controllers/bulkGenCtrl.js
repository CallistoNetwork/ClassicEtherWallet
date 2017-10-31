'use strict';
var bulkGenCtrl = function($scope) {
	$scope.showWallets = false;
    $scope.networks = {
         ETH: "eth_ethscan",
         ETC: "etc_epool",
         UBQ: "ubq",
         EXP: "exp",
    }
var network = globalFuncs.urlGet('network') == null ? "" : globalFuncs.urlGet('network');
     if (network) {
         $rootScope.$broadcast('ChangeNode', $scope.networks[network.toUpperCase()] || 0);
     }

    $scope.genWallets = function(){
        if($scope.amount==''||$scope.amount != parseInt($scope.amount, 10)) alert(globalFuncs.errorMsgs[0]);
        else {
            $scope.wallets = [];
            var csv = ''; var txt = '';
            $scope.jsonWallets = [];
            for(var i=0;i<$scope.amount;i++){
                var tWallet = Wallet.generate(false);
                csv += tWallet.getChecksumAddressString() + ',' + tWallet.getPrivateKeyString() + '\n';
                txt += tWallet.getChecksumAddressString() + '\t' + tWallet.getPrivateKeyString() + '\n';
                $scope.jsonWallets.push({
                     address: tWallet.getChecksumAddressString(),
			         private: tWallet.getPrivateKeyString()
                });
                $scope.wallets.push(tWallet);
            }
            $scope.showWallets = true;
            $scope.bJSON = globalFuncs.getBlob("text/json;charset=UTF-8",JSON.stringify($scope.jsonWallets));
            $scope.bTXT =  globalFuncs.getBlob("text/plain;charset=UTF-8",txt);
            $scope.bCSV = globalFuncs.getBlob("text/csv;charset=UTF-8",csv);
        }
    }
    $scope.printQRCode = function() {
		globalFuncs.printPaperWallets(JSON.stringify($scope.jsonWallets));
	}
};
module.exports = bulkGenCtrl;
