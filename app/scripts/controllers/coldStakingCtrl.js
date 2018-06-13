'use strict';


var coldStakingCtrl = function ($scope, $rootScope, walletService, modalService, coldStakingService) {


    $scope.walletService = walletService;
    $scope.modalService = modalService;
    $scope.coldStakingService = coldStakingService;


    $scope.contract = coldStakingService.contract;


    function init() {


        $scope.tx = {
            unit: 'ether',
            value: 0,
            to: coldStakingService.contract.address,
            gasLimit: '',
            data: '',
        };

    }

    $scope.$watch(function () {


        return ajaxReq.type;
    }, function (val, _val) {


        coldStakingService.updateAddress();


    });


    /*

        send tx to contract

        sendTransaction defaults to start_staking();
     */


    // would have been easier just to call start_staking();


    $scope.startStaking = function () {


        $scope.wallet = walletService.wallet;


        ethFuncs.estimateGas({
            to: $scope.tx.to,
            value: etherUnits.toWei($scope.tx.value, $scope.tx.unit)
        }, function (data) {

            if (data.error) {

                $scope.notifier.danger(data.msg);

                return false;

            } else if (data.data === '-1') {

                $scope.notifier.danger(globalFuncs.errorMsgs[21]);

                return false;
            }


            $scope.tx.gasLimit = data.data;

            Object.assign($scope.tx, uiFuncs.getTxData($scope));


            uiFuncs.generateTx($scope.tx, function callback(tx_) {


                uiFuncs.sendTx(tx_, function (resp) {


                    modalService.startStakingModal.close();

                    if (!resp.isError) {
                        var txHashLink = $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data);
                        var verifyTxBtn = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? '<a class="btn btn-xs btn-info strong" href="' + txHashLink + '" target="_blank" rel="noopener noreferrer">Verify Transaction</a>' : '';
                        var completeMsg = '<p>' + globalFuncs.successMsgs[2] + '<strong>' + resp.data + '</strong></p>' + verifyTxBtn;
                        $scope.notifier.success(completeMsg, 0);
                        $scope.wallet.setBalance();
                    } else {


                        if (resp.error.includes('insufficient funds')) {

                            $scope.notifier.danger(globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                        }
                        else {

                            $scope.notifier.danger(resp.error || globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                        }

                    }
                })


            })

        })


    };


    $scope.stake_reward = function () {


        coldStakingService.stake_reward(function (data) {

            modalService.openClaimRewardModal.close();
            // console.log('stake_reward', data);


        });

    };



    $scope.claim_and_withdraw = function () {

        coldStakingService.claim_and_withdraw(function (data) {


            handleResponse();

            modalService.openWithdrawModal.close();
            // console.log('claim_and_withdraw', data);


        });

    };

    function handleResponse(data) {

        if (!data || data.error) {


            $scope.notifier.danger(data);
        }
    }

    $scope.claim = function () {

        coldStakingService.claim(function (data) {

            handleResponse();


            modalService.openClaimRewardModal.close();
            // console.log('claim', data);
        })
    }

    function main() {


        init();

        // const testing = true;
        //
        // if (testing) {
        //
        //
        //     $rootScope.$broadcast('ChangeNode', globalFuncs.networks['RIN'] || 0);
        //
        //
        // } else {
        //
        //     //$rootScope.$broadcast('ChangeNode', globalFuncs.networks['CLO'] || 0);
        //
        // }


    }

    main();


};

module.exports = coldStakingCtrl;
