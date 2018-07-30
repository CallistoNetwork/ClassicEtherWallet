"use strict";

/*


    get coin prices

 */
const CCRATEAPI = (sym = "ETC") =>
  `https://min-api.cryptocompare.com/data/price?fsym=${sym}&tsyms=USD,EUR,GBP,BTC,CHF,REP`;

var coinPrice = function() {};

/*

    get coin price based on ajaxReq
 */

coinPrice.getCoinPrice = function(callback) {
  const coin = nodes.nodeList[globalFuncs.getCurNode()].type;

  const uri = CCRATEAPI(coin);

  ajaxReq.http
    .get(uri)
    .then(function(_data) {
      if (
        (_data.hasOwnProperty("Response") && _data.Response === "Error") ||
        (_data.hasOwnProperty("data") && _data.data.Response === "Error")
      ) {
        callback(Object.assign({}, _data, { error: true }));
      } else {
        const { data } = _data;

        var priceObj = {
          usd: parseFloat(data["USD"]).toFixed(6),
          eur: parseFloat(data["EUR"]).toFixed(6),
          btc: parseFloat(data["BTC"]).toFixed(6),
          chf: parseFloat(data["CHF"]).toFixed(6),
          rep: parseFloat(data["REP"]).toFixed(6),
          gbp: parseFloat(data["GBP"]).toFixed(6)
        };
        callback(priceObj);
      }
    })
    .catch(err => {
      callback(Object.assign({}, err, { error: true }));
    });
};
module.exports = coinPrice;
