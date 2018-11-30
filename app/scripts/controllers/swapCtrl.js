"use strict";

const bitcoinExplorer = `https://blockchain.info/tx/[[txHash]]`;
const lStorageKey = "swapOrder";
// sort swapOrder coins
const popularCoins = ["ETC", "CLO", "BTC", "XMR", "ZEC"];

const statuses = {
    new: "new",
    waiting: "waiting",
    confirming: "confirming",
    exchanging: "exchanging",
    sending: "sending",
    finished: "finished",
    failed: "failed",
    refunded: "refunded",
    expired: "expired"
};

const ethCoins = Object.keys(nodes.alternativeBalance).concat("CLO");

// priceTicker in page header
const priceTickers = ["ETC"];

const SwapCryptoCurrenciesController = function(
    $scope,
    $rootScope,
    $interval,
    changeNowService,
    walletService
) {
    let priceTicker = {};

    $scope.statuses = statuses;
    $scope.walletService = walletService;

    priceTickers.forEach(ticker => {
        priceTicker[ticker + "BTC"] = 1;

        priceTicker["BTC" + ticker] = 1;
    });

    const verifyAddress = function(coin, address) {
        if (coin.toUpperCase() === "BTC") {
            return Validator.isValidBTCAddress(address);
        } else if (ethCoins.includes(coin.toUpperCase())) {
            return Validator.isValidAddress(address);
        } else {
            return address.length > 0;
        }
    };

    function handleErr(err) {
        uiFuncs.notifier.danger(err);
    }

    $scope.TEXT = () => `
            Please include the below if this issue is regarding your order:\n
            
            REF ID: ${$scope.orderResult.id} 
            Amount to send: ${$scope.orderResult.expectedSendAmount ||
                $scope.swapOrder.fromVal}  ${$scope.orderResult.fromCurrency ||
        $scope.swapOrder.fromCoin} 
            Amount to receive: ${$scope.orderResult.expectedReceiveAmount ||
                $scope.swapOrder.toVal}  ${$scope.orderResult.toCurrency ||
        $scope.swapOrder.toCoin} 
            Payment Address: ${$scope.orderResult.payinAddress}
            Payout Address: ${$scope.orderResult.payoutAddress}
        `;

    $scope.mailHref = () => `mailto:support@changenow.io,support@classicetherwallet.com?
    Subject=${
        $scope.orderResult.reference
    } - Issue regarding my Swap via classicetherwallet.com 
    &Body=${encodeURIComponent($scope.TEXT())}
    `;

    $scope.initChangeNow = async function() {
        const currencies = await changeNowService
            .getCurrencies()
            .catch(handleErr);

        $scope.availableCoins = currencies.sort($scope.coinOrder);

        // get price ticker values

        return Promise.all(
            priceTickers.map(async ticker => {
                const result = await changeNowService
                    .exchangeAmount(1, "btc", ticker)
                    .catch(handleErr);

                const { conversionRatio, amount, estimatedAmount } = result;

                Object.assign($scope.priceTicker, {
                    [ticker + "BTC"]: 1 / conversionRatio,
                    ["BTC" + ticker]: conversionRatio
                });

                // Initialize conversion ratio for etc

                if (ticker.toUpperCase() === "ETC") {
                    $scope.$apply(function() {
                        Object.assign($scope.swapOrder, {
                            fromVal: estimatedAmount,
                            toVal: amount,
                            toCoin: "BTC",
                            fromCoin: "ETC"
                        });
                    });
                }
            })
        );
    };

    const initValues = function() {
        Object.assign($scope, {
            stage: 1,
            swapIssue: false,
            initilizingOrder: false,
            ethCoins,
            availableCoins: [],
            parentTxConfig: {},
            showedMinMaxError: false,
            changeNow: changeNowService,
            priceTicker,
            progressCheck: null,
            input: {
                toCoin: "",
                fromCoin: ""
            },
            orderResult: {
                status: null,
                payinAddress: null,
                payoutAddress: null,
                fromCurrency: null,
                reference: null,
                toCurrency: null,
                id: null,
                updatedAt: null,
                expectedSendAmount: null,
                expectedReceiveAmount: null,
                progress: {
                    status: null,
                    bar: null //getProgressBarArr(4, 5),
                }
            },
            swapOrder: {
                fromCoin: "etc",
                toCoin: "btc",
                isFrom: false,
                fromVal: null,
                toVal: 1,
                toAddress: null,
                swapRate: null
            }
        });
    };

    $scope.verifyMinMaxValues = function() {
        return (
            Validator.isPositiveNumber($scope.swapOrder.toVal) &&
            Validator.isPositiveNumber($scope.swapOrder.fromVal) &&
            !$scope.showedMinMaxError
        );
    };

    $scope.setOrderCoin = function(isFrom, coin) {
        isFrom
            ? ($scope.swapOrder.fromCoin = coin)
            : ($scope.swapOrder.toCoin = coin);

        $scope.dropdownFrom = $scope.dropdownTo = false;

        $scope.updateEstimate(isFrom);
    };

    $scope.toggleDropdown = function(isFrom) {
        //fixme: issue focusing element

        //const coin = document.getElementById(isFrom ? 'fromCoin' : 'toCoin');

        let open = false;
        if (isFrom) {
            $scope.dropdownFrom = !$scope.dropdownFrom;

            if ($scope.dropdownFrom) open = true;
        } else {
            $scope.dropdownTo = !$scope.dropdownTo;
            if ($scope.dropdownTo) open = true;
        }

        // if (open) {
        //
        //     coin.focus();
        //
        //     coin.select();
        // }
    };

    $scope.handleSubmit = function(isFrom) {
        const coins = $scope.filterCoins(
            isFrom ? $scope.input.fromCoin : $scope.input.toCoin
        );

        if (coins.length > 0) {
            $scope.setOrderCoin(isFrom, coins[0].ticker);

            $scope.updateEstimate(isFrom);
        }
    };

    $scope.updateEstimate = function(isFrom) {
        let amount = isFrom
            ? parseFloat($scope.swapOrder.fromVal)
            : parseFloat($scope.swapOrder.toVal);

        let fromCoin, toCoin;

        $scope.swapOrder.isFrom = isFrom;

        if (isFrom) {
            fromCoin = $scope.swapOrder.fromCoin;
            toCoin = $scope.swapOrder.toCoin;

            if ($scope.stage === 1) {
                $scope.swapOrder.toVal = "";
            }
        } else {
            toCoin = $scope.swapOrder.fromCoin;

            fromCoin = $scope.swapOrder.toCoin;

            if ($scope.stage === 1) {
                $scope.swapOrder.fromVal = "";
            }
        }

        const handleEstimate =
            $scope.stage === 1
                ? changeNowService.estimateConversion(toCoin, fromCoin, amount)
                : changeNowService.exchangeAmount(amount, fromCoin, toCoin);

        return handleEstimate.then(result => {
            if (result) {
                $scope.$apply(function() {
                    Object.assign($scope.swapOrder, {
                        toVal: isFrom ? result.estimatedAmount : amount,
                        fromVal: isFrom ? amount : result.estimatedAmount
                    });
                });
            } else {
                uiFuncs.notifier.danger("error connecting to server");

                Object.assign($scope, {
                    swapOrder: {
                        toVal: "",
                        fromVal: ""
                    }
                });
            }
        });
    };

    $scope.setFinalPrices = function() {
        $scope.showedMinMaxError = false;

        if (
            !Validator.isPositiveNumber($scope.swapOrder.fromVal) ||
            !Validator.isPositiveNumber($scope.swapOrder.toVal)
        )
            throw globalFuncs.errorMsgs[0];

        $scope.stage = 2;
        $scope.updateEstimate($scope.swapOrder.isFrom);

        changeNowService
            .minAmount($scope.swapOrder.fromCoin, $scope.swapOrder.toCoin)
            .then(result => {
                if (result) {
                    const { minAmount } = result;

                    if ($scope.swapOrder.fromVal < minAmount) {
                        uiFuncs.notifier.danger(
                            `Minimum transfer amount: ${minAmount}`
                        );

                        Object.assign($scope.swapOrder, { fromVal: minAmount });

                        $scope.updateEstimate(true);
                    }
                }
            })
            .catch(handleErr);
    };

    const getProgressBarArr = function(index, len) {
        var tempArr = [];
        for (var i = 0; i < len; i++) {
            if (i < index) tempArr.push("progress-true");
            else if (i === index) tempArr.push("progress-active");
            else tempArr.push("");
        }
        return tempArr;
    };
    const isStorageOrderExists = function() {
        const order = globalFuncs.localStorage.getItem(lStorageKey, null);
        return order && Validator.isJSON(order);
    };
    const setOrderFromStorage = function() {
        const order = JSON.parse(
            globalFuncs.localStorage.getItem(lStorageKey, null)
        );
        $scope.orderResult = order;
    };
    $scope.saveOrderToStorage = function(order) {
        globalFuncs.localStorage.setItem(lStorageKey, JSON.stringify(order));
    };

    $scope.processOrder = async function() {
        if (
            [statuses.new, statuses.waiting].includes(
                $scope.orderResult.status.toLowerCase()
            )
        ) {
            if (Validator.isValidAddress($scope.orderResult.payinAddress)) {
                const type = $scope.orderResult.fromCurrency.toUpperCase();
                if (ajaxReq.type !== type) {
                    const network = globalFuncs.networks[type];
                    $scope.changeNode(network);
                }

                const {
                    orderResult: { payinAddress, expectedSendAmount }
                } = $scope;

                const tx = {
                    to: ethUtil.toChecksumAddress(payinAddress),
                    value: new BigNumber(expectedSendAmount).toNumber(),
                    sendMode: "ether",
                    gasLimit: globalFuncs.defaultTxGasLimit
                };
                Object.assign($scope, {
                    parentTxConfig: tx,
                    tx
                });
            }
        }

        $scope.progressCheck = $interval(
            async () => await $scope.handleProgressCheck(),
            1000 * 15
        );

        return await $scope.handleProgressCheck();
    };

    $scope.handleProgressCheck = async function handleProgressCheck() {
        const data = await changeNowService
            .transactionStatus($scope.orderResult.id)
            .catch(handleErr);

        const { status } = data;

        Object.assign($scope.orderResult, data);

        if (statuses.new === status) {
            $scope.orderResult.progress.bar = getProgressBarArr(1, 5);
        } else if (statuses.waiting === status) {
            $scope.orderResult.progress.bar = getProgressBarArr(2, 5);
        } else if (statuses.confirming === status) {
            $scope.orderResult.progress.bar = getProgressBarArr(3, 5);
        } else if (statuses.exchanging === status) {
            $scope.orderResult.progress.bar = getProgressBarArr(3, 5);
        } else if (statuses.sending === status) {
            $scope.orderResult.progress.bar = getProgressBarArr(4, 5);
        } else if (statuses.finished === status) {
            $interval.cancel($scope.progressCheck);
            $scope.progressCheck = null;
            $scope.orderResult.progress.bar = getProgressBarArr(5, 5);

            let url = `tx hash: ${$scope.orderResult.hash}`;

            if (
                ethCoins.includes($scope.orderResult.toCurrency.toUpperCase())
            ) {
                url = ajaxReq.blockExplorerTX.replace(
                    "[[txHash]]",
                    $scope.orderResult.hash
                );
            } else if ($scope.orderResult.toCurrency.toUpperCase() === "BTC") {
                url = bitcoinExplorer.replace(
                    "[[txHash]]",
                    $scope.orderResult.hash
                );
            }

            const bExStr =
                "<a href='" +
                url +
                "' target='_blank' rel='noopener'> View your transaction </a>";

            uiFuncs.notifier.success(
                globalFuncs.successMsgs[2] +
                    $scope.orderResult.hash +
                    "<br />" +
                    bExStr
            );
        } else if (
            [statuses.failed, statuses.refunded, statuses.expired].includes(
                status
            )
        ) {
            $interval.cancel($scope.progressCheck);
            $scope.progressCheck = null;
            $scope.orderResult.progress.bar = getProgressBarArr(-1, 5);
            uiFuncs.notifier.danger("Order Status:" + "<br />" + status, 0);
        }

        $scope.saveOrderToStorage($scope.orderResult);
    };

    $scope.coinOrder = function coinOrder(a, b) {
        function weight(coin) {
            if (popularCoins.indexOf(coin.ticker.toUpperCase()) > -1) {
                coin.weight =
                    100 - popularCoins.indexOf(coin.ticker.toUpperCase());
            } else {
                coin.weight = 0;
            }

            return coin;
        }

        a = weight(a);

        b = weight(b);

        return b.weight - a.weight;
    };

    $scope.openOrder = async function() {
        const {
            swapOrder: { toCoin, fromCoin, toAddress }
        } = $scope;

        if (!verifyAddress(toCoin, toAddress)) {
            uiFuncs.notifier.danger("Error opening order");
        }
        const order = {
            amount: $scope.swapOrder.fromVal,
            from: fromCoin,
            to: toCoin,
            address: toAddress
        };

        $scope.initilizingOrder = true;

        const orderResult = await changeNowService
            .openOrder(order)
            .catch(err => {
                uiFuncs.notifier.danger(globalFuncs.errorMsgs[5]);
                initValues();
            });

        $scope.$apply(function() {
            $scope.stage = 3;

            $scope.initilizingOrder = false;
            Object.assign(
                $scope.orderResult,
                {
                    status: statuses.new,
                    expectedSendAmount: order.amount,
                    progress: {
                        status: statuses.new,
                        bar: getProgressBarArr(0, 5)
                    }
                },
                orderResult
            );
        });

        return await $scope.processOrder().catch(handleErr);
    };

    $scope.filterCoins = function(coin) {
        const regex = new RegExp(coin, "i");

        return $scope.availableCoins.filter(item => item.ticker.match(regex));
    };

    $scope.newSwap = function() {
        $interval.cancel($scope.progressCheck);

        $scope.progressCheck = null;

        $scope.saveOrderToStorage("");

        initValues();

        $scope.initChangeNow().then(() => {
            return $scope.setOrderCoin(false, "btc");
        });
    };

    async function main() {
        initValues();

        if (isStorageOrderExists()) {
            setOrderFromStorage();
            $scope.stage = 3;
            await $scope.processOrder().catch(handleErr);
        } else {
            await $scope.initChangeNow().catch(handleErr);
        }
    }

    main();
};

module.exports = SwapCryptoCurrenciesController;
