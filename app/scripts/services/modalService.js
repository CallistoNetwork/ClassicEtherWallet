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
  return {
    startStakingModal,
    openClaimRewardModal,
    openWithdrawModal
  };
};

module.exports = modalService;
