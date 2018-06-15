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

    /*

        When switching network, reset staker info, update contract address and fetch staking
        threshold and staker info if wallet unlocked.
     */

    $scope.$watch(function () {


        return ajaxReq.type;
    }, function (val, _val) {

        coldStakingService.updateAddress();

        $scope.tx.to = coldStakingService.contract.address;

        if (walletService && walletService.wallet && walletService.wallet.getAddressString()) {

            coldStakingService.reset_staker_info();
            coldStakingService.staking_threshold();
            coldStakingService.staker_info();
        }


    });


    /*

        send tx to contract

        sendTransaction defaults to start_staking();
     */


    // would have been easier to call start_staking() directly;


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

                const {signedTx, isError} = tx_;


                if (!isError) {

                    uiFuncs.sendTx(signedTx, function (resp) {


                        modalService.startStakingModal.close();

                        if (!resp.isError) {
                            var txHashLink = $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data);
                            var verifyTxBtn = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? '<a class="btn btn-xs btn-info strong" href="' + txHashLink + '" target="_blank" rel="noopener noreferrer">Verify Transaction</a>' : '';
                            var completeMsg = '<p>' + globalFuncs.successMsgs[2] + '<strong>' + resp.data + '</strong></p>' + verifyTxBtn;
                            $scope.notifier.success(completeMsg, 0);
                            $scope.wallet.setBalance();


                            // increment staker weight manually

                            coldStakingService._staker_info.weight = new BigNumber($scope.tx.value)
                                .add(coldStakingService._staker_info.weight).toString();

                            init();

                            // coldStakingService.staker_info();

                        } else {


                            if (resp.error.includes('insufficient funds')) {

                                $scope.notifier.danger(globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                            }
                            else {

                                $scope.notifier.danger(resp.error || globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                            }

                        }
                    })
                } else {

                    $scope.notifier.danger('Error generating transaction');
                }


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


            notifyError(data);

            modalService.openWithdrawModal.close();
            // console.log('claim_and_withdraw', data);


        });

    };

    function notifyError(result) {

        if (result.error) {

            $scope.notifier.danger(result.error.msg);

        }

    }

    $scope.claim = function () {

        coldStakingService.claim(function (data) {

            notifyError(data);


            modalService.openClaimRewardModal.close();
            // console.log('claim', data);
        })
    };


    function main() {


        init();


    }

    main();


};

module.exports = coldStakingCtrl;
