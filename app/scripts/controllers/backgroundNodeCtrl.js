"use strict";

const backgroundNodeCtrl = function(
    $scope,
    $interval,
    $http,
    backgroundNodeService
) {
    const changeBackgroundNode = () => {
        backgroundNodeService.changeBackgroundNode();
        healthCheck();
    };

    $scope.backgroundNodeService = backgroundNodeService;

    $scope.dropdownNodeBackground = false;

    $scope.nodes = nodes;

    $scope.setBackgroundNode = backgroundNode => {
        Object.assign(backgroundNodeService, { backgroundNode });
        $scope.dropdownNodeBackground = false;
        healthCheck();
    };

    $scope.$watch(
        function() {
            return globalFuncs.getCurNode();
        },
        function(curNode) {
            const { backgroundNode } = backgroundNodeService;

            if (backgroundNode === curNode) {
                changeBackgroundNode();
            }
        }
    );

    function healthCheck() {
        const { lib } = nodes.nodeList[backgroundNodeService.backgroundNode];

        return lib
            .healthCheck()
            .then(result => {
                if (300 <= result.status) {
                    _handleChange();
                }
            })
            .catch(_handleChange);

        function _handleChange() {
            if (1 < backgroundNodeService.availableNodes.length) {
                changeBackgroundNode();
            }
        }
    }
    healthCheck();
    $scope.interval = $interval(healthCheck, 1000 * 30);
};

module.exports = backgroundNodeCtrl;
