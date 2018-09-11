"use strict";

const coldStakingCtrl = function(
    $scope,
    $rootScope,
    walletService,
    modalService,
    coldStakingService
) {
    $scope.walletService = walletService;
    $scope.modalService = modalService;
    $scope.coldStakingService = coldStakingService;

    function init() {
        $scope.input = {
            understand: false
        };

        $scope.tx = {
            unit: "ether",
            value: 0,
            to: coldStakingService.contract.address,
            gasLimit: "",
            data: ""
        };
    }

    /*

            When switching network, reset staker info, update contract address and fetch staking
            threshold and staker info if wallet unlocked.
         */

    $scope.$watch(
        function() {
            return ajaxReq.type;
        },
        function(val, _val) {
            coldStakingService.handleInit();
            $scope.tx.to = coldStakingService.contract.address;
        }
    );

    /*

            send tx to contract

            sendTransaction defaults to start_staking();
         */

    // would have been easier to call start_staking() directly;

    $scope.startStaking = function() {
        if (coldStakingService.staker_info.weight > 0) {
            const {
                input: { understand }
            } = $scope;
            if (!understand) {
                return $scope.notifier.danger("Press checkbox to continue");
            }
        }

        uiFuncs
            .genTxContract(
                "start_staking",
                coldStakingService.contract,
                walletService.wallet,
                Object.assign({}, $scope.tx, {
                    value: etherUnits.toWei($scope.tx.value, $scope.tx.unit),
                    from: walletService.wallet.getAddressString(),
                    unit: "wei"
                })
            )
            .then(tx => {
                return uiFuncs.sendTxContract(coldStakingService.contract, tx);
            })
            .catch(err => {
                conosle.error(err);
            })
            .finally(() => modalService.startStakingModal.close());
    };

    function handleUserCanWithdraw() {
        if (!coldStakingService.userCanWithdraw()) {
            // fixme: translation

            $scope.notifier.danger("ERROR: Cannot withdraw");

            return false;
        }

        return true;
    }

    $scope.claim_and_withdraw = function() {
        if (handleUserCanWithdraw()) {
            uiFuncs
                .genTxContract(
                    "claim_and_withdraw",
                    coldStakingService.contract,
                    walletService.wallet,
                    Object.assign({}, coldStakingService.tx, {
                        from: walletService.wallet.getAddressString()
                    })
                )
                .then(tx => {
                    return uiFuncs.sendTxContract(
                        coldStakingService.contract,
                        tx
                    );
                })
                .finally(() => {
                    modalService.openWithdrawModal.close();
                    init();
                });
        }
    };

    $scope.claim = function() {
        if (handleUserCanWithdraw()) {
            uiFuncs
                .genTxContract(
                    "claim",
                    coldStakingService.contract,
                    walletService.wallet,
                    Object.assign({}, coldStakingService.tx, {
                        from: walletService.wallet.getAddressString()
                    })
                )
                .then(tx => {
                    return uiFuncs.sendTxContract(
                        coldStakingService.contract,
                        tx
                    );
                })
                .finally(() => {
                    modalService.openClaimRewardModal.close();
                    init();
                });
        }
    };

    function main() {
        init();
    }

    main();
};

module.exports = coldStakingCtrl;
