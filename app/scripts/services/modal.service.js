var modalService = function() {
    const startStakingModal = new Modal(
        document.getElementById("startStakingModal")
    );
    const openWithdrawModal = new Modal(
        document.getElementById("openWithdrawModal")
    );
    const openClaimRewardModal = new Modal(
        document.getElementById("openClaimRewardModal")
    );

    const startStakingModalV2 = new Modal(
        document.getElementById("startStakingModalV2")
    );
    const openWithdrawModalV2 = new Modal(
        document.getElementById("openWithdrawModalV2")
    );
    const openClaimRewardModalV2 = new Modal(
        document.getElementById("openClaimRewardModalV2")
    );

    return {
        startStakingModal,
        openClaimRewardModal,
        openWithdrawModal,
        startStakingModalV2,
        openClaimRewardModalV2,
        openWithdrawModalV2
    };
};

module.exports = modalService;
