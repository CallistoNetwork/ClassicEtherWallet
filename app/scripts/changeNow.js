'use strict';

var uri_base = 'https://change-now.herokuapp.com/swap';

var ChangeNow = function ChangeNow() {


    this.affiliateLink = 'https://changenow.io?link_id=ace83609250351';

    this.availableCoins = [];

    this.priceTicker = null;


    this.getCurrencies = async function () {

        const result = await ajaxReq.http.get(uri_base + '/currencies');

        if (result.statusText.toUpperCase() === 'OK') {

            this.availableCoins = result.data;

            return this.availableCoins;

        }

        return false;


    }


    this.estimateConversion = async function (to = 'etc', from = 'btc', amount = 1) {


        const result = await this.exchangeAmount(amount, from, to);

        if (result) {

            return this.availableCoins.find(coin => coin.ticker.toUpperCase() === to.toUpperCase()).converstionRatio;
        }

        return false

    }


    this.exchangeAmount = async function (amount, from, to) {

        amount = parseFloat(amount);


        if (!amount) return false;


        const result = await ajaxReq.http.get(uri_base + `/exchange-amount/${amount}/${from.toLowerCase()}/${to.toLowerCase()}`);

        if (result.statusText.toUpperCase() === 'OK') {


            const idx = this.availableCoins.findIndex(coin => coin.ticker.toUpperCase() === to.toUpperCase());


            if (idx > -1) {

                return Object.assign(this.availableCoins[idx], result.data, {
                    amount,
                    converstionRatio: amount / result.data.estimatedAmount
                });


            }


        }


        return false;


    }


    this.minAmount = async function (from, to) {


        const result = await ajaxReq.http.get(uri_base + `/min-amount/${from}/${to}`);


        if (result.statusText === 'OK') {

            return result.data;
        }

        return false;
    }

    this.openOrder = async function (order) {


        /*
        from (Required): Ticker of a currency you want to send
        to (Required): Ticker of a currency you want to receive
        address (Required): Address to receive a currency
        amount (Required): Amount you want to exchnage
        extraId (Optional): Extra Id for currencies that require it
         */
        const result = await ajaxReq.http.post(uri_base + `/transactions`, JSON.stringify(order));


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
    }


    this.transactionStatus = async function (id) {

        const result = await ajaxReq.http.get(uri_base + `/transactions/${id}`);

        if (result.statusText === 'OK') {

            return result.data;
        }
        return false;
    }


    this.handleTransactionStatus = function (tx) {


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

    }


}


module.exports = ChangeNow;
