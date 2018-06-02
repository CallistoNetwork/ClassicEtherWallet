var broadcastTxCtrl = function ($scope) {


    function main() {


        init();

    }

    function init() {

        $scope.input = {
            signedTx: null,
            rawTx: {
                gasPrice: null,
                gasLimit: null,
                to: null,
                value: null,
                data: null,
                nonce: null,
            },

        }
    }

    $scope.handleSubmit = function () {


        uiFuncs.sendTx($scope.input.signedTx, function (resp) {

            if (!resp.isError) {
                const txHashLink = ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data);
                const verifyTxBtn = ajaxReq.type !== nodes.nodeTypes.Custom ? '<a class="btn btn-xs btn-info strong" href="' + txHashLink + '" target="_blank" rel="noopener noreferrer">Verify Transaction</a>' : '';
                const completeMsg = '<p>' + globalFuncs.successMsgs[2] + '<strong>' + resp.data + '</strong></p>' + verifyTxBtn;
                $scope.notifier.success(completeMsg, 0);

                init();

            } else {


                if (resp.error.includes('insufficient funds')) {

                    $scope.notifier.danger(globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                }
                else {

                    $scope.notifier.danger(resp.error || globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
                }

            }
        });


    }


    $scope.validTx = function () {


        return $scope.input.signedTx;
    }


    $scope.handleDecodeTx = function () {


        const tx = new ethUtil.Tx($scope.input.signedTx);


        function mapToHex(param) {

            return ethFuncs.sanitizeHex(param.toString('hex'));
        }


        $scope.input.rawTx = {
            to: mapToHex(tx.to),
            value: mapToHex(tx.value),
            chainId: tx._chainId,
            gasPrice: mapToHex(tx.gasPrice),
            gasLimit: mapToHex(tx.gasLimit),
            data: mapToHex(tx.data),
            nonce: tx.nonce.toString('hex'),
        };

        $scope.input.decodedInput = Object.assign({}, $scope.input.rawTx, {
            nonce: ethUtil.solidityCoder.decodeParam('int', $scope.input.rawTx.nonce).toNumber(),
            gasPrice: ethUtil.solidityCoder.decodeParam('int', $scope.input.rawTx.gasPrice).toNumber(),
            gasLimit: ethUtil.solidityCoder.decodeParam('int', $scope.input.rawTx.gasLimit).toNumber(),
            value: ethUtil.solidityCoder.decodeParam('int256', $scope.input.rawTx.value).toNumber(),
        });


    }


    main();


};


module.exports = broadcastTxCtrl;
