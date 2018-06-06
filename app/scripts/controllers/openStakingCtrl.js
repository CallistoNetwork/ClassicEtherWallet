'use strict';

var openStakingCtrl = function ($scope) {


    const startStakingModal = new Modal(document.getElementById('startStakingModal'));
    //const openWithdrawModal = new Modal(document.getElementById('openWithdrawlModal'));
    //const openClaimRewardModal = new Modal(document.getElementById('openClaimRewardModal'));


    $scope.openStakingModal = function () {

        startStakingModal.open();

    };

    $scope.openWithdrawModal = function () {

        // openWithdrawModal.open();
    }

    $scope.openClaimRewardModal = function () {

        // openClaimRewardModal.open();
    }


};


module.exports = openStakingCtrl;
