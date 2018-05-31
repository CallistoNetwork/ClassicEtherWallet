var broadcastTxCtrl = function ($scope) {


    function main() {


        $scope.input = {
            signedTx: '',
        }
    }

    $scope.handleSubmit = function () {


        uiFuncs.sendTx(input.signedTx);


        /*

        uiFuncs.sendTx($scope.signedTx, function (resp) {
            if (!resp.isError) {
                var txHashLink = $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data);
                var verifyTxBtn = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? '<a class="btn btn-xs btn-info strong" href="' + txHashLink + '" target="_blank" rel="noopener noreferrer">Verify Transaction</a>' : '';
                var completeMsg = '<p>' + globalFuncs.successMsgs[2] + '<strong>' + resp.data + '</strong></p>' + verifyTxBtn;
                $scope.notifier.success(completeMsg, 0);
                $scope.wallet.setBalance(applyScope);
                if ($scope.tx.sendMode === 'token') $scope.wallet.tokenObjs[$scope.tokenTx.id].setBalance();
            } else {


                if (resp.error.includes('insufficient funds')) {

                    $scope.notifier.danger(globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                }
                else {

                    $scope.notifier.danger(resp.error || globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                }

            }
        });
         */
    }

    main();

    $scope.validTx = function () {


        return $scope.input.signedTx;
    }

    $scope.rawTx = '';

}
