"use strict";

const backgroundNodeCtrl = function($scope, $interval, backgroundNodeService) {
    $scope.backgroundNodeService = backgroundNodeService;

    $scope.dropdownNodeBackground = false;

    $scope.nodes = nodes;

    $scope.setBackgroundNode = backgroundNode => {
        Object.assign(backgroundNodeService, { backgroundNode });
        $scope.dropdownNodeBackground = false;
    };

    $scope.$on("ChangeNode", function(_, curNode) {
        const { backgroundNode, changeBackgroundNode } = backgroundNodeService;

        if (backgroundNode === curNode) {
            $scope.stopHealthCheck();
            changeBackgroundNode();
            $scope.startHealthCheck();
        }
    });

    function healthCheck() {
        const { lib } = nodes.nodeList[backgroundNodeService.backgroundNode];

        return lib.healthCheck().catch(_handle);

        function _handle(err) {
            if (1 < backgroundNodeService.availableNodes.length) {
                backgroundNodeService.changeBackgroundNode();
            }
        }
    }

    $scope.stopHealthCheck = function() {
        if ($scope.interval) {
            $interval.cancel($scope.interval);

            $scope.interval = null;
        }
    };

    $scope.$on("$destroy", () => $scope.stopHealthCheck());

    $scope.startHealthCheck = function() {
        $scope.interval = $interval(healthCheck, 1000 * 30);
    };
    healthCheck();
    $scope.startHealthCheck();
};

module.exports = backgroundNodeCtrl;
