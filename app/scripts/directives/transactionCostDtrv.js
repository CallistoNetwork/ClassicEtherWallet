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

                    $scope.gasPrice = globalFuncs.localStorage.getItem('gasPrice');
                    const gasPriceE = etherUnits.unitToUnit($scope.gasPrice, 'gwei', 'ether');


                    $scope.txCostEther = new BigNumber(gasPriceE).mul(gasLimit);

                    // fixme: add currencies based on language

                    $scope.txCostFiat = $scope.txCostEther.mul(prices.usd);

                    $scope.nodeType = nodes.nodeList[globalFuncs.getCurNode()].type;


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
