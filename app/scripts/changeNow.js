'use strict';


const ChangeNow = function () {


    this.uri_base = 'https://change-now.herokuapp.com/swap';
    this.linkId = 'ace83609250351';

    this.affiliateLink = `https://changenow.io/&link_id=${this.linkId}`;


    this.exchangeLink = (from = 'btc', to = 'etc', amount = 1) =>
        `https://changenow.io/exchange?amount=${amount}&from=${from}&link_id=${this.linkId}&to=${to}`;
    this.availableCoins = [];

    this.conversionRatios = {};

    this.priceTicker = null;


    this.getCurrencies = async function () {

        const result = await ajaxReq.http.get(this.uri_base + '/currencies');

        if (result.statusText.toUpperCase() === 'OK') {

            this.availableCoins = result.data;

            return this.availableCoins;

        }

        return false;


    };


    this.estimateConversion = async function (to = 'etc', from = 'btc', amount = 1) {

        from = from.toLowerCase();

        to = to.toLowerCase();


        if (this.conversionRatios.hasOwnProperty(from + '/' + to)) {

            const itm = this.conversionRatios[from + '/' + to];


            return Object.assign({}, itm, {
                estimatedAmount: (itm.estimatedAmount / itm.amount) * amount
            });

        } else if (this.conversionRatios.hasOwnProperty(to + '/' + from)) {

            const itm = this.conversionRatios[to + '/' + from];

            return Object.assign({}, itm, {
                estimatedAmount: (itm.amount / itm.estimatedAmount) * amount,
            })
        } else {

            const result = await this.exchangeAmount(amount, from, to);

            return result && this.availableCoins.find(coin => coin.ticker.toLowerCase() === to);


        }


    };


    this.exchangeAmount = async function (amount, from, to) {

        amount = parseFloat(amount);

        from = from.toLowerCase();

        to = to.toLowerCase();


        if (!(amount && from && to && from !== to)) return false;

        const result = await ajaxReq.http.get(this.uri_base + `/exchange-amount/${amount}/${from}/${to}`);

        if (result.statusText.toUpperCase() === 'OK') {


            const idx = this.availableCoins.findIndex(coin => coin.ticker.toLowerCase() === to);


            if (idx > -1) {


                this.conversionRatios[from + '/' + to] = {
                    from,
                    to,
                    amount,
                    estimatedAmount: result.data.estimatedAmount,
                    conversionRatio: amount / result.data.estimatedAmount,
                };

                return Object.assign(this.availableCoins[idx], result.data, {
                    amount,
                    conversionRatio: amount / result.data.estimatedAmount,
                    conversionTo: to,
                });


            }


        }


        return false;


    };


    this.minAmount = async function (from, to) {


        const result = await ajaxReq.http.get(this.uri_base + `/min-amount/${from}/${to}`);


        if (result.statusText === 'OK') {

            return result.data;
        }

        return false;
    };

    this.openOrder = async function (order) {


        /*
        from (Required): Ticker of a currency you want to send
        to (Required): Ticker of a currency you want to receive
        address (Required): Address to receive a currency
        amount (Required): Amount you want to exchnage
        extraId (Optional): Extra Id for currencies that require it
         */
        const result = await ajaxReq.http.post(this.uri_base + `/transactions`, JSON.stringify(order));


        if (result.statusText === 'OK') {

            return result.data;

            /*
            {
                  "payinAddress": "0xC3bFD8E9C4961d2366f1851F5F1ee602035A7794",
                  "payoutAddress": "0xE82862a5aFdC00Abf953E50E94E562f844588c56",
                  "fromCurrency": "etc",
                  "toCurrency": "eth",
                  "id": "d6ece24311b1eb"
}
             */


        }

        return false;
    };


    this.transactionStatus = async function (id) {

        const result = await ajaxReq.http.get(this.uri_base + `/transactions/${id}`);

        if (result.statusText === 'OK') {

            return result.data;
        }
        return false;
    };


}


module.exports = ChangeNow;
