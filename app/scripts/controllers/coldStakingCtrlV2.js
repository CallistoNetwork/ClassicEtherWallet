"use strict";

const coldStakingCtrlV2 = function(
    $scope,
    $rootScope,
    walletService,
    modalService,
    coldStakingV2Service
) {
    $scope.walletService = walletService;
    $scope.modalService = modalService;
    $scope.coldStakingV2Service = coldStakingV2Service;

    function init() {
        $scope.input = {
            understand: false,
            stakingPeriod: 1
        };

        $scope.tx = {
            unit: "ether",
            value: 0,
            to: coldStakingV2Service.contract.address,
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

    $scope.startStakingV2 = function() {
        if (0 < coldStakingV2Service.stakingInfo.amount) {
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
                coldStakingV2Service.contract,
                walletService.wallet,
                Object.assign({}, $scope.tx, {
                    value: ethFuncs.sanitizeHex(
                        ethFuncs.decimalToHex(
                            etherUnits.toWei($scope.tx.value, $scope.tx.unit)
                        )
                    ),
                    inputs: [$scope.input.stakingPeriod],
                    from: walletService.wallet.getAddressString(),
                    unit: "wei"
                })
            )
            .then(tx => {
                return uiFuncs.sendTxContract(
                    coldStakingV2Service.contract,
                    tx
                );
            })
            .catch(err => {
                uiFuncs.notifier.danger(err);
            })
            .finally(() => modalService.startStakingModalV2.close());
    };

    function handleUserCanWithdraw() {
        if (!coldStakingV2Service.userCanWithdraw()) {
            // fixme: translation

            uiFuncs.notifier.danger("ERROR: Cannot withdraw");

            return false;
        }

        return true;
    }

    $scope.withdraw_stakeV2 = function() {
        if (handleUserCanWithdraw()) {
            uiFuncs
                .genTxContract(
                    "withdraw_stake",
                    coldStakingV2Service.contract,
                    walletService.wallet,
                    Object.assign({}, coldStakingV2Service.tx, {
                        value: ethFuncs.sanitizeHex(
                            ethFuncs.decimalToHex(new BigNumber(0))
                        ),
                        from: walletService.wallet.getAddressString(),
                        unit: "wei"
                    })
                )
                .then(tx => {
                    return uiFuncs.sendTxContract(
                        coldStakingV2Service.contract,
                        tx
                    );
                })
                .finally(() => {
                    modalService.openWithdrawModalV2.close();
                    init();
                });
        }
    };

    $scope.claimV2 = function() {
        if (!handleUserCanWithdraw()) {
            return;
        }
        uiFuncs
            .genTxContract(
                "claim",
                coldStakingV2Service.contract,
                walletService.wallet,
                Object.assign({}, coldStakingV2Service.tx, {
                    value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(0)),
                    from: walletService.wallet.getAddressString(),
                    unit: "wei"
                })
            )
            .then(tx => {
                return uiFuncs.sendTxContract(
                    coldStakingV2Service.contract,
                    tx
                );
            })
            .finally(() => {
                modalService.openClaimRewardModalV2.close();
                init();
            });
    };

    function main() {
        init();
    }

    main();
};

module.exports = coldStakingCtrlV2;
