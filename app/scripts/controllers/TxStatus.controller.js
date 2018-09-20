"use strict";

const etherUnits = require("../etherUnits");

const statusCodes = {
    found: 0,
    notFound: 1,
    mined: 2
};

const BigNumber = require("bignumber.js");

module.exports = function TxStatusController($scope) {
    $scope.txStatus = statusCodes;
    $scope.txInfo = {
        status: null, // notFound foundInPending foundOnChain
        hash:
            globalFuncs.urlGet("txHash", null) ||
            globalFuncs.urlGet("tx", null),
        from: "",
        to: "",
        value: "",
        gasLimit: "",
        gasPrice: "",
        data: "",
        nonce: "",
        txFee: ""
    };

    $scope.mapTxToScope = function mapTxToScope(tx) {
        const _gasPrice = new BigNumber(tx.gasPrice);

        const _gas = new BigNumber(tx.gas);

        const _value = new BigNumber(tx.value);

        const txFee = _gasPrice.mul(_gas);

        let txFee_fiat = null;

        let value_fiat = null;

        const { coinPrices } = window.coinPriceService;

        if (coinPrices.hasOwnProperty(ajaxReq.type)) {
            const usd = coinPrices[ajaxReq.type].usd;
            txFee_fiat = etherUnits.toFiat(txFee, "wei", usd);
            value_fiat = etherUnits.toFiat(_value, "wei", usd);
        }

        $scope.txInfo = Object.assign({}, tx, {
            status: tx.blockNumber
                ? $scope.txStatus.mined
                : $scope.txStatus.found,
            from: ethUtil.toChecksumAddress(tx.from),
            blockNumber: ethFuncs.hexToDecimal(tx.blockNumber),
            to: tx.to ? ethUtil.toChecksumAddress(tx.to) : "",
            value: _value.toString(),
            valueStr: etherUnits.toEther(_value, "wei"),
            value_fiat,
            txFee_fiat,
            gasLimit: _gas.toString(),
            gasPrice: {
                wei: _gasPrice.toString(),
                gwei: _gasPrice
                    .div(etherUnits.getValueOfUnit("gwei"))
                    .toString(),
                eth: etherUnits.toEther(tx.gasPrice, "wei")
            },
            txFee: {
                wei: txFee.toString(),
                gwei: etherUnits.unitToUnit(txFee, "wei", "gwei")
            },
            data: tx.input === "0x" ? "" : tx.input,
            nonce: new BigNumber(tx.nonce).toString()
        });
    };
};
