'use strict';
var swapCtrl = function ($scope) {
    const lStorageKey = "swapOrder";


    const priceTickers = ['ETC'];

    let priceTicker = {};

    priceTickers.forEach(ticker => {
        priceTicker[ticker + 'BTC'] = 1;

        priceTicker['BTC' + ticker] = 1;

    });


    //$scope.priceTicker = {ETCBTC: 1, BTCETC: 1, ETHBTC: 1, ETHREP: 1, BTCREP: 1, BTCETH: 1, REPBTC: 1, REPETH: 1};

    Object.assign($scope, {
        ajaxReq,
        availableCoins: [],
        networks: globalFuncs.networks,
        showedMinMaxError: false,
        Validator: Validator,
        changeNow: new changeNow(),
        //priceTicker: {ETCBTC: 1, BTCETC: 1}
        priceTicker,
    })

    $scope.initChangeNow = async function () {


        const currencies = await $scope.changeNow.getCurrencies();

        if (currencies) {


            $scope.availableCoins = currencies;


            await Promise.all(priceTickers.map(async (ticker) => {

                const conversionRatio = await $scope.changeNow.estimateConversion(ticker.toUpperCase());

                if (conversionRatio) {


                    Object.assign($scope, {
                        priceTicker: {
                            [ticker + 'BTC']: 1 / conversionRatio,
                            ['BTC' + ticker]: conversionRatio
                        }
                    });
                }

            }));
        }
    }


    function test() {

        $scope.showStage1 = false;
        $scope.showStage2 = false;
        $scope.showStage3Eth = true;
        $scope.showStage3Btc = false;
        $scope.orderResult = {
            "status": "waiting",
            "payinAddress": "0xDe4d2977D23b6f0eFedb3D48a00581860D2c787d",
            "payoutAddress": "0xE82862a5aFdC00Abf953E50E94E562f844588c56",
            "fromCurrency": "etc",
            "toCurrency": "eth",
            "id": "c1ebc63a44b39b",
            "updatedAt": "2018-05-10T15:42:55.987Z",
            "expectedSendAmount": 50,
            "expectedReceiveAmount": 1.4027197998
        };


        $scope.currentOrder = {
            rawInput: $scope.orderResult,
            output: {
                amount: 1.4,
                currency: 'eth',
            },
            input: {
                amount: 50,
                currency: 'etc',
            },
            progress: {
                status: 'open',
                bar: getProgressBarArr(-1, 5),
            }
        };


        $scope.swapOrder = {
            fromCoin: "ETC",
            toCoin: "eth",
            isFrom: true,
            fromVal: 50,
            toVal: 1.4027197998,
            toAddress: '0xE82862a5aFdC00Abf953E50E94E562f844588c56',
            swapRate: 1,
            swapPair: ''
        }

    }


    var initValues = function () {
        $scope.showStage1 = true;
        $scope.showStage2 = false;
        $scope.showStage3Eth = false;
        $scope.showStage3Btc = false;
        $scope.orderResult = {
            "status": null,
            "payinAddress": null,
            "payoutAddress": null,
            "fromCurrency": null,
            "toCurrency": null,
            "id": null,
            "updatedAt": null,
            "expectedSendAmount": null,
            "expectedReceiveAmount": null,
        };


        $scope.currentOrder = {
            rawInput: $scope.orderResult,
            output: {
                amount: null,
                currency: null,
            },
            input: {
                amount: null,
                currency: null,
            },
            progress: {
                status: null,
                bar: null//getProgressBarArr(4, 5),
            }
        };


        $scope.swapOrder = {
            fromCoin: 'etc',
            toCoin: 'btc',
            isFrom: false,
            fromVal: null,
            toVal: 1,
            toAddress: null,
            swapRate: null,
            swapPair: null,
        }
    };


    $scope.verifyMinMaxValues = function () {


        return Validator.isPositiveNumber($scope.swapOrder.toVal) &&
            Validator.isPositiveNumber($scope.swapOrder.fromVal) &&
            !$scope.showedMinMaxError;


    };


    $scope.setOrderCoin = function (isFrom, coin) {
        if (isFrom) $scope.swapOrder.fromCoin = coin;
        else $scope.swapOrder.toCoin = coin;
        if ($scope.swapOrder.fromCoin == $scope.swapOrder.toCoin)
            for (var i in $scope.availableCoins)
                if ($scope.availableCoins[i] != $scope.swapOrder.fromCoin) {
                    $scope.swapOrder.toCoin = $scope.availableCoins[i];
                    break;
                }
        $scope.swapOrder.swapPair = $scope.swapOrder.fromCoin + "/" + $scope.swapOrder.toCoin;

        $scope.dropdownFrom = $scope.dropdownTo = false;
        $scope.updateEstimate(isFrom);

    }
    $scope.updateEstimate = function (isFrom) {


        let amount = isFrom ? parseFloat($scope.swapOrder.fromVal) : parseFloat($scope.swapOrder.toVal);


        if (!Validator.isPositiveNumber(amount)) {

            return false;

        }


        let fromCoin, toCoin;


        $scope.swapOrder.isFrom = isFrom;
        if (isFrom) {


            if (!$scope.showStage2) {

                $scope.swapOrder.toVal = '...';
            }

            fromCoin = $scope.swapOrder.fromCoin;
            toCoin = $scope.swapOrder.toCoin;


        } else {

            if (!$scope.showStage2) {

                $scope.swapOrder.fromVal = '...';

            }

            toCoin = $scope.swapOrder.fromCoin;

            fromCoin = $scope.swapOrder.toCoin;
        }

        $scope.changeNow.exchangeAmount(amount, fromCoin, toCoin)
            .then(result => {


                if (result) {


                    if (isFrom) {

                        $scope.swapOrder.toVal = result.estimatedAmount;
                        $scope.swapOrder.fromVal = amount;

                    } else {


                        $scope.swapOrder.toVal = amount;
                        $scope.swapOrder.fromVal = result.estimatedAmount;


                    }
                }
            }).catch(err => {

            $scope.notifier.danger('error swap curr');

            Object.assign($scope, {
                swapOrder: {
                    toVal: '',
                    fromVal: '',
                }
            });

        })


    }

    $scope.setFinalPrices = function () {
        $scope.showedMinMaxError = false;
        try {

            if (!$scope.Validator.isPositiveNumber($scope.swapOrder.fromVal) || !$scope.Validator.isPositiveNumber($scope.swapOrder.toVal)) throw globalFuncs.errorMsgs[0];
            $scope.showStage1 = false;
            $scope.showStage2 = true;
            $scope.updateEstimate($scope.swapOrder.isFrom);
        } catch (e) {
            $scope.notifier.danger(e);
        }

    }


    var getProgressBarArr = function (index, len) {
        var tempArr = [];
        for (var i = 0; i < len; i++) {
            if (i < index) tempArr.push('progress-true');
            else if (i == index) tempArr.push('progress-active');
            else tempArr.push('');
        }
        return tempArr;
    }
    var isStorageOrderExists = function () {
        var order = globalFuncs.localStorage.getItem(lStorageKey, null);
        return order && $scope.Validator.isJSON(order);
    }
    var setOrderFromStorage = function () {
        var order = JSON.parse(globalFuncs.localStorage.getItem(lStorageKey, null));
        $scope.orderResult = order;
        $scope.swapOrder = order.swapOrder;
        processOrder();
    }
    var saveOrderToStorage = function (order) {

        // fixme: attach id
        globalFuncs.localStorage.setItem(lStorageKey, JSON.stringify(order));
    }

    /*
       {
             "payinAddress": "0xC3bFD8E9C4961d2366f1851F5F1ee602035A7794",
             "payoutAddress": "0xE82862a5aFdC00Abf953E50E94E562f844588c56",
             "fromCurrency": "etc",
             "toCurrency": "eth",
             "id": "d6ece24311b1eb"
}
        */
    var processOrder = function () {
        var orderResult = $scope.orderResult;
        orderResult.progress = {
            status: "OPEN",
            bar: getProgressBarArr(1, 5),
            pendingStatusReq: false,
        };

        var progressCheck = setInterval(function () {
            if (!orderResult) clearInterval(progressCheck);
            if (!orderResult.progress.pendingStatusReq) {
                orderResult.progress.pendingStatusReq = true;
                $scope.changeNow.getTransaction(orderResult.id).then(function (data) {


                    if (!data) $scope.notifier.danger('error');

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

                        const {status, id, payinAddress} = data;

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
                        }


                        if ([statuses.new, statuses.waiting].includes(status)) {

                            orderResult.progress.status = "OPEN";
                            orderResult.progress.bar = getProgressBarArr(1, 5);

                            orderResult.reference = id;

                            orderResult.payment_address = payinAddress;


                        } else if ([statuses.confirming].includes(status)) {

                            orderResult.progress.bar = getProgressBarArr(2, 5);
                            orderResult.progress.status = "RCVE";
                        } else if ([statuses.exchanging].includes(status)) {
                            orderResult.progress.status = "RCVE";
                            orderResult.progress.bar = getProgressBarArr(3, 5);
                        } else if ([statuses.sending].includes(status)) {

                            orderResult.progress.status = "RCVE";
                            orderResult.progress.bar = getProgressBarArr(4, 5);
                        } else if ([statuses.finished].includes(status)) {

                            orderResult.progress.status = "FILL";
                            orderResult.progress.bar = getProgressBarArr(5, 5);
                            orderResult.progress.showTimeRem = false;
                            //var url = orderResult.output.currency === 'BTC' ? bity.btcExplorer.replace("[[txHash]]", data.output.reference) : bity.ethExplorer.replace("[[txHash]]", data.output.reference)
                            //var bExStr = "<a href='" + url + "' target='_blank' rel='noopener'> View your transaction </a>";
                            $scope.notifier.success(globalFuncs.successMsgs[2] + data.output.reference + "<br />" + '');
                            clearInterval(progressCheck);
                            clearInterval(timeRem);
                        } else if ([statuses.failed, statuses.refunded, statuses.expired].includes(status)) {
                            orderResult.progress.status = "CANC";
                            orderResult.progress.bar = getProgressBarArr(-1, 5);
                            $scope.notifier.danger('Order Status:', status);
                            clearInterval(progressCheck);
                        }
                        if (!$scope.$$phase) $scope.$apply();
                    }
                    orderResult.progress.pendingStatusReq = false;
                });
            }
        }, 1000 * 60);
        $scope.showStage2 = false;
        if ($scope.orderResult.input.currency === 'BTC') $scope.showStage3Btc = true;
        else {
            $scope.parentTxConfig = {
                to: ethUtil.toChecksumAddress($scope.orderResult.payment_address),
                value: $scope.orderResult.input.amount,
                sendMode: $scope.orderResult.input.currency === 'ETH' ? 'ether' : 'token',
                tokensymbol: $scope.orderResult.input.currency === 'ETH' ? '' : $scope.orderResult.input.currency,
                readOnly: true
            }
            new Modal(document.getElementById('sendTransaction'));
            $scope.showStage3Eth = true;
        }
    }
    $scope.openOrder = async function () {

        if (($scope.swapOrder.toCoin !== 'BTC' && $scope.Validator.isValidAddress($scope.swapOrder.toAddress)) || ($scope.swapOrder.toCoin == 'BTC' && $scope.Validator.isValidBTCAddress($scope.swapOrder.toAddress))) {
            var order = {
                amount: $scope.swapOrder.isFrom ? $scope.swapOrder.fromVal : $scope.swapOrder.toVal,
                from: $scope.swapOrder.isFrom ? $scope.swapOrder.fromCoin : $scope.swapOrder.toCoin,
                to: $scope.swapOrder.isFrom ? $scope.swapOrder.toCoin : $scope.swapOrder.fromCoin,
                address: $scope.swapOrder.toAddress
            }


            const data = await $scope.changeNow.openOrder(order);
            if (!data.error) {
                $scope.orderResult = data;
                $scope.orderResult.swapOrder = $scope.swapOrder;
                saveOrderToStorage($scope.orderResult);
                processOrder();
            } else $scope.notifier.danger(data.msg);
            if (!$scope.$$phase) $scope.$apply();
        } else {
            $scope.notifier.danger(globalFuncs.errorMsgs[5]);
        }
    }


    $scope.newSwap = function () {
        globalFuncs.localStorage.setItem(lStorageKey, '');
        initValues();
    }


    function main() {


        initValues();

        test();

        if (isStorageOrderExists()) {
            $scope.showStage1 = false;
            setOrderFromStorage();
        }


        $scope.initChangeNow()
            .then(() => $scope.setOrderCoin(false, 'btc'));


    }

    main();
};
module.exports = swapCtrl;
