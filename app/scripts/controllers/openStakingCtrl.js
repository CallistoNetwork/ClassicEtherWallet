'use strict';

var openStakingCtrl = function ($scope, modalService, coldStakingService, walletService) {

    $scope.modalService = modalService;
    $scope.coldStakingService = coldStakingService;
    $scope.walletService = walletService;

    coldStakingService.stake_reward();


};


module.exports = openStakingCtrl;
