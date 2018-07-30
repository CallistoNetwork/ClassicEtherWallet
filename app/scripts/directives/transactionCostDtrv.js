"use strict";

var transactionCostDrtv = function() {
  return {
    //restrict: "E",
    template: require("./transactionCost.html"),
    link: function($scope) {
      function main() {
        Object.assign($scope, {
          txCostEther: 0,
          txCostFiat: 0,
          coinPrices: {}
        });

        getTxCost();
      }

      main();

      function getTxCost() {
        $scope.nodeType = nodes.nodeList[globalFuncs.getCurNode()].type;

        if ($scope.coinPrices.hasOwnProperty($scope.nodeType)) {
          handleCoinPriceResult($scope.coinPrices[$scope.nodeType]);
        } else {
          ajaxReq.getCoinPrice(function(result) {
            if (!result.error) {
              handleCoinPriceResult(result);

              $scope.coinPrices[$scope.nodeType] = result;
            } else {
              $scope.txCostEther = 0;

              // todo: handle err
            }
          });
        }
      }

      function handleTxCost(val, _val) {
        if (!angular.equals(val, _val)) {
          getTxCost();
        }
      }

      function handleCoinPriceResult(result) {
        const { gasLimit } = $scope.tx;

        $scope.nodeType = nodes.nodeList[globalFuncs.getCurNode()].type;

        $scope.gasPrice = etherUnits.toWei(
          globalFuncs.localStorage.getItem("gasPrice") || 20,
          "gwei"
        );

        const txCost = new BigNumber($scope.gasPrice).mul(gasLimit);

        $scope.txCostEther = etherUnits.toEther(txCost, "wei");

        // fixme: add currencies based on language

        // https://jsfiddle.net/LFN8x/1/

        $scope.txCostFiat = etherUnits.toFiat(txCost, "wei", result.usd);
      }

      $scope.$watch(function() {
        return ajaxReq.chainId;
      }, handleTxCost);

      $scope.$watch(function() {
        return globalFuncs.localStorage.getItem("gasPrice");
      }, handleTxCost);

      $scope.$watch(function() {
        return $scope.tx.gasLimit;
      }, handleTxCost);
    }
  };
};
module.exports = transactionCostDrtv;
