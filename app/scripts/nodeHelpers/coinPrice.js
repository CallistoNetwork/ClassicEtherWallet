'use strict';

/*


    get coin prices

 */
var BITYRATEAPI = "https://bity.com/api/v1/rate2/";

var coinPrice = function () {


}


const CCRATEAPI = (sym = 'ETC') => `https://min-api.cryptocompare.com/data/price?fsym=${sym}&tsyms=USD,EUR,GBP,BTC,CHF,REP`;


coinPrice.getCoinValue = function (callback) {

    const coin = nodes.nodeList[globalFuncs.getCurNode()].type;


    var uri = CCRATEAPI(coin);

    ajaxReq.http.get(uri).then(function (data) {
        data = data['data'];

        var priceObj = {
            usd: parseFloat(data['USD']).toFixed(6),
            eur: parseFloat(data['EUR']).toFixed(6),
            btc: parseFloat(data['BTC']).toFixed(6),
            chf: parseFloat(data['CHF']).toFixed(6),
            rep: parseFloat(data['REP']).toFixed(6),
            gbp: parseFloat(data['GBP']).toFixed(6),
        };
        console.log('coin', coin);
        console.log(priceObj);
        callback(priceObj);
    });
}
coinPrice.getRates = function (callback) {
    ajaxReq.http.get(BITYRATEAPI).then(function (data) {
        callback(data['data']['objects']);
    });
}
module.exports = coinPrice;
