"use strict";

module.exports = function transactionCost() {
    return {
        //restrict: "E",
        template: require("./transactionCost.html"),
        link: function($scope) {
            function getTxCost() {
                const _node = globalFuncs.getCurNode();

                $scope.node = nodes.nodeList[_node];

                // coin to look up -> ETC
                const nodeType = ajaxReq.type;

                coinPriceService
                    .getCoinPrice(nodeType)
                    .then(handleCoinPriceResult)
                    .catch(err => {
                        $scope.txCostEther = 0;
                    });

                function handleCoinPriceResult(result) {
                    const { gasLimit } = $scope.tx;

                    $scope.gasPrice = etherUnits.toWei(
                        globalFuncs.localStorage.getItem("gasPrice") || 20,
                        "gwei"
                    );

                    const txCost = new BigNumber($scope.gasPrice).mul(gasLimit);

                    $scope.txCostEther = etherUnits.toEther(txCost, "wei");

                    // fixme: add currencies based on language

                    // https://jsfiddle.net/LFN8x/1/

                    $scope.txCostFiat = etherUnits.toFiat(
                        txCost,
                        "wei",
                        result.usd
                    );
                }
            }

            function handleTxCost(val, _val) {
                if (!angular.equals(val, _val)) {
                    getTxCost();
                }
            }

            $scope.$watchGroup(
                [
                    "ajaxReq.chainId",
                    () => globalFuncs.localStorage.getItem("gasPrice"),
                    "tx.gasLimit"
                ],
                handleTxCost
            );

            function main() {
                Object.assign($scope, {
                    txCostEther: 0,
                    txCostFiat: 0,
                    coinPrices: {},
                    node: null
                });

                getTxCost();
            }

            main();
        }
    };
};
