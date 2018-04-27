'use strict';


var _sample = require('lodash/sample');


var backgroundNodeCtrl = function ($scope, backgroundNodeService, $timeout, $interval) {


    const availableNodes = Object.keys(nodes.nodeList).filter(nodeName =>
        nodes.nodeList[nodeName].type.toUpperCase() === 'ETC');

    var backgroundNode = _sample(availableNodes);


    Object.assign(backgroundNodeService, {backgroundNode, availableNodes});

    $scope.backgroundNodeService = backgroundNodeService;

    $scope.nodeList = nodes.nodeList;
    $scope.dropdownNodeBackground = false;

    const changeBackgroundNode = () => {


        const {backgroundNode, availableNodes} = backgroundNodeService;


        const availableNodes_ = availableNodes.filter(node => node !== backgroundNode);

        const sampleNode = _sample(availableNodes_);

        Object.assign(backgroundNodeService, {backgroundNode: sampleNode});


    };





    $scope.setBackgroundNode = (backgroundNode) => {


        Object.assign(backgroundNodeService, {backgroundNode});


        $scope.dropdownNodeBackground = false;


    };

    $scope.$watch(function () {

        return globalFuncs.getCurNode();

    }, function (curNode) {

        const {backgroundNode} = backgroundNodeService;

        if (backgroundNode === curNode) {


            changeBackgroundNode();

        }

    });


    var interval = $interval(urlExists, 1000 * 30);




    function urlExists() {

        const {lib} = nodes.nodeList[backgroundNodeService.backgroundNode];

        lib.getCurrentBlock(function (result) {


            if (result.error) {


                changeBackgroundNode();
            }
        });


    }


    $timeout(urlExists, 10);
}


module.exports = backgroundNodeCtrl;
