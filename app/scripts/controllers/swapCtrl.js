'use strict';


var swapCtrl = function ($scope, $rootScope, $interval) {


    const bitcoinExplorer = `https://blockchain.info/tx/[[txHash]]`;

    const lStorageKey = "swapOrder";


    // sort swapOrder coins
    const popularCoins = ['ETC', 'CLO', 'BTC', 'XMR', 'ZEC'];

    //fixme
    const ethCoins = ['ETC', 'ETH', 'UBQ', 'CLO'];


    // priceTicker in page header
    const priceTickers = ['ETC'];


    let priceTicker = {};

    priceTickers.forEach(ticker => {
        priceTicker[ticker + 'BTC'] = 1;

        priceTicker['BTC' + ticker] = 1;

    });


    const verifyToAddress = function (coin) {

        if ($scope.swapOrder.toCoin.toUpperCase() === 'BTC') {

            return Validator.isValidBTCAddress($scope.swapOrder.toCoin)

        } else if (ethCoins.includes($scope.swapOrder.toCoin)) {


            return Validator.isValidAddress($scope.swapOrder.toCoin);
        }
        else {

            return true;
        }
    };


    $scope.mailHref = () => `mailto:support@changenow.io,support@classicetherwallet.com?
    Subject=${$scope.orderResult.reference} - Issue regarding my Swap via classicetherwallet.com 
    &Body=${encodeURIComponent(`
            Please include the below if this issue is regarding your order. 
            REF ID: ${$scope.orderResult.reference} 
            Amount to send: ${$scope.orderResult.expectedSendAmount || $scope.swapOrder.fromVal}  ${$scope.orderResult.fromCurrency || $scope.swapOrder.fromCoin} 
            Amount to receive: ${$scope.orderResult.expectedReceiveAmount || $scope.swapOrder.toVal}  ${$scope.orderResult.toCurrency || $scope.swapOrder.toCoin} 
            Payment Address: ${$scope.orderResult.payinAddress}
            Payout Address: ${$scope.orderResult.payoutAddress}
        `)}
    `;


    $scope.initChangeNow = async function () {


        const currencies = await $scope.changeNow.getCurrencies();

        if (currencies) {


            $scope.availableCoins = currencies.sort($scope.coinOrder);


            // get price ticker values

            return Promise.all(priceTickers.map(async (ticker) => {

                const result = await $scope.changeNow.exchangeAmount(1, 'btc', ticker);

                if (result) {

                    const {conversionRatio, amount, estimatedAmount} = result;

                    Object.assign($scope.priceTicker, {
                        [ticker + 'BTC']: 1 / conversionRatio,
                        ['BTC' + ticker]: conversionRatio
                    });

                    // Initialize conversion ratio for etc

                    if (ticker.toUpperCase() === 'ETC') {


                        $scope.$apply(function () {


                            Object.assign($scope.swapOrder, {
                                fromVal: estimatedAmount,
                                toVal: amount,
                                toCoin: 'BTC',
                                fromCoin: 'ETC',
                            })
                        });
                    }
                }

            }));
        }
    }


    const initValues = function () {


        Object.assign($scope, {
            stage: 1,
            orderResult: {
                "status": null,
                "payinAddress": null,
                "payoutAddress": null,
                "fromCurrency": null,
                "toCurrency": null,
                "id": null,
                "updatedAt": null,
                "expectedSendAmount": null,
                "expectedReceiveAmount": null,
                progress: {
                    status: null,
                    bar: null//getProgressBarArr(4, 5),
                }
            },
            swapOrder: {
                fromCoin: 'etc',
                toCoin: 'btc',
                isFrom: false,
                fromVal: null,
                toVal: 1,
                toAddress: null,
                swapRate: null,
            }

        });
    }


    $scope.verifyMinMaxValues = function () {


        return Validator.isPositiveNumber($scope.swapOrder.toVal) &&
            Validator.isPositiveNumber($scope.swapOrder.fromVal) &&
            !$scope.showedMinMaxError;


    };


    $scope.setOrderCoin = function (isFrom, coin) {

        isFrom ? $scope.swapOrder.fromCoin = coin : $scope.swapOrder.toCoin = coin;

        $scope.dropdownFrom = $scope.dropdownTo = false;

        $scope.updateEstimate(isFrom);

    }

    $scope.toggleDropdown = function (isFrom) {

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


    }

    $scope.handleSubmit = function (isFrom) {

        const coins = $scope.filterCoins(isFrom ? $scope.input.fromCoin : $scope.input.toCoin);


        if (coins.length > 0) {

            $scope.setOrderCoin(isFrom, coins[0].ticker);

            $scope.updateEstimate(isFrom);
        }
    }


    $scope.updateEstimate = function (isFrom) {


        let amount = isFrom ? parseFloat($scope.swapOrder.fromVal) : parseFloat($scope.swapOrder.toVal);

        let fromCoin, toCoin;


        $scope.swapOrder.isFrom = isFrom;

        if (isFrom) {


            fromCoin = $scope.swapOrder.fromCoin;
            toCoin = $scope.swapOrder.toCoin;


            if ($scope.stage === 1) {


                $scope.swapOrder.toVal = '';
            }


        } else {


            toCoin = $scope.swapOrder.fromCoin;

            fromCoin = $scope.swapOrder.toCoin;

            if ($scope.stage === 1) {


                $scope.swapOrder.fromVal = '';
            }
        }


        const handleEstimate = $scope.stage === 1 ?
            $scope.changeNow.estimateConversion(toCoin, fromCoin, amount) :
            $scope.changeNow.exchangeAmount(amount, fromCoin, toCoin);

        return handleEstimate.then(result => {


            if (result) {

                $scope.$apply(function () {

                    Object.assign($scope.swapOrder, {
                        toVal: isFrom ? result.estimatedAmount : amount,
                        fromVal: isFrom ? amount : result.estimatedAmount,
                    });

                });

            } else {


                $scope.notifier.danger('error connecting to server');


                Object.assign($scope, {
                    swapOrder: {
                        toVal: '',
                        fromVal: '',
                    }
                });

            }
        });


    };

    $scope.setFinalPrices = function () {
        $scope.showedMinMaxError = false;

        if (!Validator.isPositiveNumber($scope.swapOrder.fromVal) ||
            !Validator.isPositiveNumber($scope.swapOrder.toVal)) throw globalFuncs.errorMsgs[0];

        $scope.stage = 2;
        $scope.updateEstimate($scope.swapOrder.isFrom);

        $scope.changeNow.minAmount($scope.swapOrder.fromCoin, $scope.swapOrder.toCoin).then(result => {

            if (result) {

                const {minAmount} = result;


                if ($scope.swapOrder.fromVal < minAmount) {

                    $scope.notifier.danger(`Minimum transfer amount: ${minAmount}`);

                    Object.assign($scope.swapOrder, {fromVal: minAmount});

                    $scope.updateEstimate(true);
                }

            }
        })

    };


    const getProgressBarArr = function (index, len) {


        var tempArr = [];
        for (var i = 0; i < len; i++) {
            if (i < index) tempArr.push('progress-true');
            else if (i === index) tempArr.push('progress-active');
            else tempArr.push('');
        }
        return tempArr;
    }
    var isStorageOrderExists = function () {
        var order = globalFuncs.localStorage.getItem(lStorageKey, null);
        return order && Validator.isJSON(order);
    }
    var setOrderFromStorage = function () {
        const order = JSON.parse(globalFuncs.localStorage.getItem(lStorageKey, null));
        $scope.orderResult = order;

    }
    $scope.saveOrderToStorage = function (order) {

        globalFuncs.localStorage.setItem(lStorageKey, JSON.stringify(order))
    }

    $scope.processOrder = async function () {

        if (['new', 'waiting'].includes($scope.orderResult.status.toLowerCase())) {


            if (Validator.isValidAddress($scope.orderResult.payinAddress)) {



                //TODO: only switch if different

                //const node = globalFuncs.getCurNode();

                // if (nodes.nodeList[node].type.toUpperCase() !== $scope.orderResult.fromCurrency.toUpperCase()) {

                $rootScope.$broadcast('ChangeNode', $scope.orderResult.fromCurrency.toUpperCase());

                //}


                const {orderResult: {payinAddress, expectedSendAmount}} = $scope;

                Object.assign($scope.parentTxConfig, {
                    to: ethUtil.toChecksumAddress(payinAddress),
                    value: expectedSendAmount,
                    sendMode: 'ether'
                });


            }
        }


        const statuses = {
            new: 'new',
            waiting: 'waiting',
            confirming: 'confirming',
            exchanging: 'exchanging',
            sending: 'sending',
            finished: 'finished',
            failed: 'failed',
            refunded: 'refunded',
            expired: 'expired',
        };


        $scope.progressCheck = $interval(async () => await handleProgressCheck(), 1000 * 15);


        await handleProgressCheck();

        async function handleProgressCheck() {

            const data = await $scope.changeNow.transactionStatus($scope.orderResult.id);


            if (!data) {

                $scope.notifier.danger('error checking tx');

            }

            /*

            {
              id: "b712390255",
              status: "finished",
              payinConfirmations: 12,
              hash: "transactionhash",
              payinHash: "58eccbfb713d430004aa438a",
              payoutHash: "58eccbfb713d430004aa438a",
              payinAddress: "58eccbfb713d430004aa438a",
              payoutAddress: "0x9d8032972eED3e1590BeC5e9E4ea3487fF9Cf120",
              payinExtraId: "123456",
              payoutExtraId: "123456",
              fromCurrency: "btc",
              toCurrency: "eth",
              amountSend: "1.000001",
              amountReceive: "20.000001",
              networkFee: "0.000001",
              updatedAt: "2017-11-29T19:17:55.130Z"
            }

             */
            else {

                const {status} = data;

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
                    $scope.orderResult.progress.bar = getProgressBarArr(5, 5);


                    let url = `tx hash: ${$scope.orderResult.hash}`;


                    if (ethCoins.includes($scope.orderResult.toCurrency.toUpperCase())) {

                        url = ajaxReq.blockExplorerTX.replace("[[txHash]]", $scope.orderResult.hash);

                    } else if ($scope.orderResult.toCurrency.toUpperCase() === 'BTC') {


                        url = bitcoinExplorer.replace('[[txHash]]', $scope.orderResult.hash);
                    }


                    const bExStr = "<a href='" + url + "' target='_blank' rel='noopener'> View your transaction </a>";


                    $scope.notifier.success(globalFuncs.successMsgs[2] + $scope.orderResult.hash + "<br />" + bExStr);


                } else if ([statuses.failed, statuses.refunded, statuses.expired].includes(status)) {
                    $interval.cancel($scope.progressCheck);
                    $scope.orderResult.progress.bar = getProgressBarArr(-1, 5);
                    $scope.notifier.danger('Order Status:' + '<br />' + status, 0);
                }

                $scope.saveOrderToStorage($scope.orderResult);

            }

        }


    }


    $scope.coinOrder = function coinOrder(a, b) {


        function weight(coin) {

            if (popularCoins.indexOf(coin.ticker.toUpperCase()) > -1) {


                coin.weight = 100 - popularCoins.indexOf(coin.ticker.toUpperCase());


            } else {

                coin.weight = 0;
            }

            return coin;
        }

        a = weight(a);

        b = weight(b);

        return b.weight - a.weight;


    }

    $scope.openOrder = async function () {


        if (verifyToAddress()) {


            const order = {
                amount: $scope.swapOrder.fromVal,
                from: $scope.swapOrder.fromCoin,
                to: $scope.swapOrder.toCoin,
                address: $scope.swapOrder.toAddress
            };


            const orderResult = await $scope.changeNow.openOrder(order);


            if (orderResult) {

                $scope.stage = 3;

                Object.assign($scope.orderResult, {
                    status: 'new',
                    fromCurrency: order.from,
                    toCurrency: order.to,
                    expectedSendAmount: order.amount,
                    progress: {
                        status: 'new',
                        bar: getProgressBarArr(0, 5),
                    }
                }, orderResult);

                await $scope.processOrder();
            } else {

                $scope.notifier.danger('Error opening order');
            }
        }
    };

    $scope.filterCoins = function (coin) {


        const regex = new RegExp(coin, 'i');

        return $scope.availableCoins.filter(item => item.ticker.match(regex));

    }


    $scope.newSwap = function () {

        $interval.cancel($scope.progressCheck);

        $scope.saveOrderToStorage('');

        initValues();


        $scope.initChangeNow().then(() => {

            return $scope.setOrderCoin(false, 'btc');
        });

    }


    async function main() {


        Object.assign($scope, {
            errorCount: 0,
            ethCoins,
            availableCoins: [],
            parentTxConfig: {},
            showedMinMaxError: false,
            changeNow: new changeNow(),
            priceTicker,
            stage: 1,
            orderResult: null,
            progressCheck: null,
            input: {
                toCoin: '',
                fromCoin: '',
            }
        });


        if (isStorageOrderExists()) {

            $scope.stage = 3;
            setOrderFromStorage();
            await $scope.processOrder();


        } else {

            initValues();
            await $scope.initChangeNow();

        }


    }

    main().finally(() => {

    });
};
module.exports = swapCtrl;
