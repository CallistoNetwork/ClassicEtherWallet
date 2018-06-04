'use strict';

var transactionCostDrtv = function () {
    return {
        //restrict: "E",
        template: require('./transactionCost.html'),
        link: function ($scope, element, attrs) {


            function main() {

                $scope.cost = null;
                $scope.txCost = null;
                getTxCost();

                $scope.nodeType = nodes.nodeList[globalFuncs.getCurNode()].type;
            }

            main();

            $scope.$watch(function () {

                return nodes.nodeList[globalFuncs.getCurNode()].type;
            }, function (val, _val) {

                if (!angular.equals(val, _val)) {

                    getTxCost();

                    $scope.nodeType = val;
                }
            })


            function getTxCost() {


                ajaxReq.getCoinValue(function (prices) {

                    const gasPrice = etherUnits.unitToUnit(globalFuncs.localStorage.getItem('gasPrice'), 'gwei', 'ether');

                    const {gasLimit} = $scope.tx;

                    const txCost = new BigNumber(gasPrice).mul(gasLimit);

                    $scope.txCost = txCost;

                    // fixme: add currencies based on language

                    $scope.cost = txCost.mul(prices.usd);


                });

            }


            $scope.$watch(function () {

                return globalFuncs.getCurNode();
            }, function (val, _val) {

                if (!angular.equals(val, _val)) {

                    getTxCost();
                }

            });


            $scope.$watch(function () {

                return globalFuncs.localStorage.getItem('gasPrice');
            }, function (val, _val) {

                if (!angular.equals(val, _val)) {

                    getTxCost();
                }

            })


        }
    };
};
module.exports = transactionCostDrtv;
