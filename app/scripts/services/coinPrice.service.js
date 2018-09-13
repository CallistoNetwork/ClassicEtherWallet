"use strict";

const _url = (sym = "ETC", syms = "USD,EUR,GBP,BTC,CHF") =>
    `https://min-api.cryptocompare.com/data/price?fsym=${sym}&tsyms=${syms}`;

const coinPriceService = function coinPriceService() {
    this.coinPrices = {};

    this.getCoinPrice = function getCoinPrice(coin = ajaxReq.type) {
        const uri = _url(coin);

        return ajaxReq.http.get(uri).then(result => {
            if (
                (result.hasOwnProperty("Response") &&
                    result.Response === "Error") ||
                (result.hasOwnProperty("data") &&
                    result.data.Response === "Error")
            ) {
                return Object.assign({}, result, { error: true });
            } else {
                const { data } = result;

                const prices = {
                    usd: parseFloat(data["USD"]).toFixed(6),
                    eur: parseFloat(data["EUR"]).toFixed(6),
                    btc: parseFloat(data["BTC"]).toFixed(6),
                    chf: parseFloat(data["CHF"]).toFixed(6),
                    gbp: parseFloat(data["GBP"]).toFixed(6)
                };

                this.coinPrices[coin] = prices;

                return prices;
            }
        });
    };

    return this;
};

module.exports = coinPriceService;
