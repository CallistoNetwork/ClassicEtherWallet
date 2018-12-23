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

    /*

            send tx to contract

            sendTransaction defaults to start_staking();
         */

    // would have been easier to call start_staking() directly;

    $scope.startStaking = function() {
        if (0 < coldStakingService.stakingInfo.amount) {
            const {
                input: { understand }
            } = $scope;
            if (!understand) {
                return uiFuncs.notifier.danger("Press checkbox to continue");
            }
        }

        uiFuncs
            .genTxContract(
                "start_staking",
                coldStakingService.contract,
                walletService.wallet,
                Object.assign({}, $scope.tx, {
                    value: ethFuncs.sanitizeHex(
                        ethFuncs.decimalToHex(
                            etherUnits.toWei($scope.tx.value, $scope.tx.unit)
                        )
                    ),
                    from: walletService.wallet.getAddressString(),
                    unit: "wei"
                })
            )
            .then(tx => {
                return uiFuncs.sendTxContract(coldStakingService.contract, tx);
            })
            .catch(err => {
                uiFuncs.notifier.danger(err);
            })
            .finally(() => modalService.startStakingModal.close());
    };

    function handleUserCanWithdraw() {
        if (!coldStakingService.userCanWithdraw()) {
            // fixme: translation

            uiFuncs.notifier.danger("ERROR: Cannot withdraw");

            return false;
        }

        return true;
    }

    $scope.withdraw_stake = function() {
        if (handleUserCanWithdraw()) {
            uiFuncs
                .genTxContract(
                    "withdraw_stake",
                    coldStakingService.contract,
                    walletService.wallet,
                    Object.assign({}, coldStakingService.tx, {
                        value: ethFuncs.sanitizeHex(
                            ethFuncs.decimalToHex(new BigNumber(0))
                        ),
                        from: walletService.wallet.getAddressString(),
                        unit: "wei"
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
        if (!handleUserCanWithdraw()) {
            return;
        }
        uiFuncs
            .genTxContract(
                "claim",
                coldStakingService.contract,
                walletService.wallet,
                Object.assign({}, coldStakingService.tx, {
                    value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(0)),
                    from: walletService.wallet.getAddressString(),
                    unit: "wei"
                })
            )
            .then(tx => {
                return uiFuncs.sendTxContract(coldStakingService.contract, tx);
            })
            .finally(() => {
                modalService.openClaimRewardModal.close();
                init();
            });
    };

    function main() {
        init();
    }

    main();
};

module.exports = coldStakingCtrl;
