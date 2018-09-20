"use strict";

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

        const txFee = etherUnits.toEther(_gasPrice.mul(_gas), "wei");

        $scope.txInfo = Object.assign({}, tx, {
            status: tx.blockNumber
                ? $scope.txStatus.mined
                : $scope.txStatus.found,
            hash: tx.hash,
            from: ethUtil.toChecksumAddress(tx.from),
            to: tx.to ? ethUtil.toChecksumAddress(tx.to) : "",
            value: _value.toString(),
            valueStr: etherUnits.toEther(_value, "wei"),
            gasLimit: _gas.toString(),
            gasPrice: {
                wei: _gasPrice.toString(),
                gwei: _gasPrice
                    .div(etherUnits.getValueOfUnit("gwei"))
                    .toString(),
                eth: etherUnits.toEther(tx.gasPrice, "wei")
            },
            txFee,
            // txFeeFiat: etherUnits.toFiat(txFee, "ether", $scope.coinPrices[ajaxReq.type].usd),
            data: tx.input === "0x" ? "" : tx.input,
            nonce: new BigNumber(tx.nonce).toString()
        });
    };
};
