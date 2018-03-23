'use strict';


var _sample = require('lodash/sample');


var backgroundNodeCtrl = function ($scope, backgroundNodeService) {


    const availableNodes = Object.keys(nodes.nodeList).filter(nodeName =>
        nodes.nodeList[nodeName].name.toUpperCase() === 'ETC');

    var backgroundNode = _sample(availableNodes);

    $scope.backgroundNode = backgroundNode;

    Object.assign(backgroundNodeService, {backgroundNode, availableNodes});


    const changeBackgroundNode = () => {


        const {backgroundNode, availableNodes} = backgroundNodeService;


        const availableNodes_ = availableNodes.filter(node => node !== backgroundNode);

        const sampleNode = _sample(availableNodes_);

        $scope.backgroundNode = sampleNode;


        Object.assign(backgroundNodeService, {backgroundNode: sampleNode});


    };

    $scope.$watch(function () {

        return globalFuncs.getCurNode();

    }, function (curNode) {

        const {backgroundNode, availableNodes} = backgroundNodeService;

        if (backgroundNode === curNode) {


            changeBackgroundNode();

        }

    })
}


module.exports = backgroundNodeCtrl;
