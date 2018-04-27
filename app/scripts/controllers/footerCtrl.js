'use strict';
var footerCtrl = function ($scope) {


    $scope.curLang = globalFuncs.curLang;

    $scope.footerModal = new Modal(document.getElementById('disclaimerModal'));

    const LOADING = "loading";
    const ERROR = 'error';

    $scope.ethBlockNumber = LOADING;
    $scope.etcBlockNumber = "loading";

    $scope.showBlocks = window.location.protocol === "https:";




    $scope.setBlockNumbers = function () {
        if (!$scope.showBlocks) return;
        ajaxReq.getCurrentBlock(function (data) {

            if (data.error) {

                $scope.currentBlockNumber = ERROR;

            } else {

                $scope.currentBlockNumber = data.data;
            }
        });
    };

    $scope.$watch(function () {

        return globalFuncs.getCurNode();

    }, function (newNode) {

        $scope.currentBlockNumber = LOADING;

        $scope.setBlockNumbers();
    });

    $scope.setBlockNumbers();
};
module.exports = footerCtrl;
