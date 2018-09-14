"use strict";

const _url = (coin = "ETC", syms = "USD,EUR,GBP,BTC,CHF") =>
    `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=${syms}`;

const coinPriceService = function coinPriceService() {
    this.coinPrices = {};

    this.initPrices = function() {
        return Promise.all(
            [
                nodes.nodeTypes.ETC,
                nodes.nodeTypes.ETH,
                nodes.nodeTypes.CLO,
                nodes.nodeTypes.EXP,
                nodes.nodeTypes.UBQ
            ].map(coin => this.getCoinPrice(coin))
        );
    };

    this.getCoinPrice = function getCoinPrice(coin = ajaxReq.type) {
        const uri = _url(coin);

        return ajaxReq.http
            .get(uri, {
                cache: true
            })
            .then(result => {
                if (
                    (result.hasOwnProperty("Response") &&
                        result.Response === "Error") ||
                    (result.hasOwnProperty("data") &&
                        result.data.Response === "Error")
                ) {
                    // fixme: throw err;

                    return Object.assign({}, result, { error: true });
                } else {
                    const { data } = result;

                    const prices = {
                        usd: parseFloat(data["USD"]),
                        eur: parseFloat(data["EUR"]),
                        btc: parseFloat(data["BTC"]),
                        chf: parseFloat(data["CHF"]),
                        gbp: parseFloat(data["GBP"])
                    };

                    this.coinPrices[coin] = prices;

                    return prices;
                }
            });
    };

    return this;
};

module.exports = coinPriceService;
