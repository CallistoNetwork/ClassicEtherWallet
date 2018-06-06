'use strict';


var coldStakingCtrl = function ($scope, $rootScope, walletService) {


    $scope.walletService = walletService;


    const contract = {
        CLOT: '0xa45083107ae67636cd9b93ad13c15b939dbdce31',
        'RINKEBY ETH': '0xa3a278371d1569d849f93f4241c7812969e863a3',
        CLO: '0x',

    };

    function init() {


        // FIXME: network
        const staking_address = contract['RINKEBY ETH'];
        $scope.staking_address = staking_address;


        $scope.tx = {
            unit: 'ether',
            value: '',
            to: staking_address,
            gasLimit: 3e6,
            data: '',
        };

    }


    $scope.$watch(function () {

        return ajaxReq.type;

    }, function (val, _val) {

        if (!angular.equals(val, _val) && Object.keys(contract).includes(val)) {

            $scope.staking_address = contract[val];

        }

    });


    /*
        Cold Staking


     */
    $scope.startStaking = function () {


        $scope.wallet = walletService.wallet;

        ethFuncs.estimateGas($scope.tx, function (data) {

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


                    const startStakingModal = new Modal(document.getElementById('startStakingModal'));

                    startStakingModal.close();

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


    /*

        Withdraw from cold Staking
     */

    $scope.withdraw = function () {


    };

    /*
        Claim Reward Cold Staking
     */
    $scope.claimReward = function () {

    };


    function main() {


        init();

        const testing = true;

        if (testing) {


            $rootScope.$broadcast('ChangeNode', globalFuncs.networks['RIN'] || 0);


        } else {

            $rootScope.$broadcast('ChangeNode', globalFuncs.networks['CLO'] || 0);

        }

    }

    main();


};

module.exports = coldStakingCtrl;
