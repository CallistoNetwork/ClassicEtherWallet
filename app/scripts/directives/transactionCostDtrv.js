'use strict';

var transactionCostDrtv = function () {
    return {
        //restrict: "E",
        template: require('./transactionCost.html'),
        link: function ($scope) {


            function main() {


                Object.assign($scope, {
                    txCostEther: null,
                    txCostFiat: null,
                });

                getTxCost();

            }

            main();


            function getTxCost() {


                ajaxReq.getCoinValue(function (prices) {

                    const {gasLimit} = $scope.tx;

                    $scope.nodeType = nodes.nodeList[globalFuncs.getCurNode()].type;

                    $scope.gasPrice = etherUnits.unitToUnit(globalFuncs.localStorage.getItem('gasPrice') || 20, 'gwei', 'wei');
                    const gasPriceE = etherUnits.unitToUnit($scope.gasPrice, 'wei', 'ether');

                    $scope.txCostEther = new BigNumber(gasPriceE).mul(gasLimit);

                    // fixme: add currencies based on language

                    $scope.txCostFiat = $scope.txCostEther.mul(prices.usd).toNumber();

                    var j = 'hi';


                });

            }

            function handleTxCost(val, _val) {

                if (!angular.equals(val, _val)) {

                    getTxCost();


                }

            }

            $scope.$watch(function () {

                return ajaxReq.chainId;
            }, handleTxCost);


            $scope.$watch(function () {

                return globalFuncs.localStorage.getItem('gasPrice');
            }, handleTxCost);


            $scope.$watch(function () {

                return $scope.tx.gasLimit;

            }, handleTxCost)


        }
    };
};
module.exports = transactionCostDrtv;
