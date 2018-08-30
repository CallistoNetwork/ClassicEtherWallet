"use strict";
const footerCtrl = function($scope) {
    $scope.curLang = globalFuncs.curLang;
    $scope.footerModal = new Modal(document.getElementById("disclaimerModal"));

    const LOADING = "loading";
    const ERROR = "error";

    $scope.currentBlockNumber = LOADING;

    $scope.setBlockNumbers = function() {
        ajaxReq.getCurrentBlock(function(data) {
            if (data.error || !data.data) {
                $scope.currentBlockNumber = ERROR;
            } else {
                $scope.currentBlockNumber = parseInt(data.data);
            }
        });
    };

    $scope.$watch(
        function() {
            return globalFuncs.getCurNode();
        },
        function(newNode, oldNode) {
            if (!angular.equals(newNode, oldNode)) {
                $scope.currentBlockNumber = LOADING;

                $scope.setBlockNumbers();
            }
        }
    );

    $scope.setBlockNumbers();
};
module.exports = footerCtrl;
