'use strict';
var contractsCtrl = function ($scope, $sce, $rootScope, walletService) {
    $scope.ajaxReq = ajaxReq;
    walletService.wallet = null;
    $scope.networks = {
        ETH: "eth_ethscan",
        ETC: "etc_epool",
        UBQ: "ubq",
        EXP: "exp",
    };


    var network = globalFuncs.urlGet('network') || null;

    if (network) {
        $rootScope.$broadcast('ChangeNode', $scope.networks[network.toUpperCase()] || 0);
    }
    $scope.visibility = "interactView";
    $scope.sendContractModal = new Modal(document.getElementById('sendContract'));
    $scope.showReadWrite = false;
    $scope.sendTxModal = new Modal(document.getElementById('deployContract'));
    $scope.Validator = Validator;
    $scope.tx = {
        gasLimit: '',
        data: '',
        to: '',
        unit: "ether",
        value: 0,
        nonce: null,
        gasPrice: null
    };

    $scope.contract = {
        address: globalFuncs.urlGet('address') != null && $scope.Validator.isValidAddress(globalFuncs.urlGet('address')) ? globalFuncs.urlGet('address') : '',
        abi: [],
        functions: [],
        selectedFunc: null,
        applyConstructorParams: true,
        constructorParams: [],
    };

    $scope.selectedAbi = ajaxReq.abiList[0];
    $scope.showRaw = false;
    $scope.$watch(function () {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function () {
        if (walletService.wallet == null) return;
        $scope.wallet = walletService.wallet;
        $scope.wd = true;
        $scope.tx.nonce = 0;

    });
    $scope.$watch('visibility', function (newValue, oldValue) {
        $scope.tx = {
            gasLimit: '',
            data: '',
            to: '',
            unit: "ether",
            value: 0,
            nonce: null,
            gasPrice: null
        }

    });
    $scope.$watch('tx.data', function (newValue, oldValue) {
        $scope.showRaw = false;

        if (newValue === oldValue) {

            return;
        } else if (newValue.substring(2) === oldValue) {

            return;
        }


        if ($scope.Validator.isValidHex($scope.tx.data) && $scope.Validator.isPositiveNumber($scope.tx.value)) {


            $scope.estimateGasLimit();
        }
    }, true);
    $scope.$watch('contract.address', function (newValue, oldValue) {
        if ($scope.Validator.isValidAddress($scope.contract.address)) {

            for (var i in ajaxReq.abiList) {
                if (ajaxReq.abiList[i].address.toLowerCase() === $scope.contract.address.toLowerCase()) {
                    $scope.contract.abi = ajaxReq.abiList[i].abi;
                    break;
                }
            }
        }
    });
    $scope.selectExistingAbi = function (index) {
        $scope.selectedAbi = ajaxReq.abiList[index];
        $scope.contract.address = $scope.selectedAbi.address;
        $scope.addressDrtv.ensAddressField = $scope.selectedAbi.address;
        $scope.addressDrtv.showDerivedAddress = false;
        $scope.dropdownExistingContracts = false;
        $scope.contract.selectedFunc = null
        $scope.dropdownContracts = false;

        if ($scope.initContractTimer) clearTimeout($scope.initContractTimer);
        $scope.initContractTimer = setTimeout(function () {
            $scope.initContract();
        }, 50);
    }
    $scope.estimateGasLimit = function () {
        var estObj = {
            from: $scope.wallet && $scope.wallet.getAddressString() ? $scope.wallet.getAddressString() : globalFuncs.donateAddress,
            value: ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei($scope.tx.value, $scope.tx.unit))),
            data: ethFuncs.sanitizeHex($scope.tx.data),
        };

        if ($scope.tx.to) {

            estObj.to = $scope.tx.to;
        }


        ethFuncs.estimateGas(estObj, function (data) {


            if (data.error) {

                // console.error('data eerror', data);

                // console.log(estObj);


                return $scope.tx.gasLimit = 0;
            }

            // console.log('ESTIMATED GAS = ', data.data);

            $scope.tx.gasLimit = data.data;
        });
    };


    /*


    //FIXME: gasLimit display

     */
    $scope.generateTx = function () {

        const {applyConstructorParams, abi, constructorParams} = $scope.contract;
        let {data, gasLimit} = $scope.tx;

        console.log('gaslimit', gasLimit);


        try {
            if ($scope.wallet == null) throw globalFuncs.errorMsgs[3];
            else if (!ethFuncs.validateHexString(data)) throw globalFuncs.errorMsgs[9];
            else if (!globalFuncs.isNumeric(gasLimit) || parseFloat(gasLimit) <= 0) throw globalFuncs.errorMsgs[8];


            //FIXME: if previously signed transaction, and params added, we need to remove params and attach again
            if (applyConstructorParams && abi) {


                data += ethUtil.solidityCoder.encodeParams(
                    constructorParams.inputs.map(i => i.type),
                    constructorParams.inputs.map(i => i.value)
                )


            }


            $scope.tx.data = ethFuncs.sanitizeHex(data);


            ajaxReq.getTransactionData($scope.wallet.getAddressString(), function (data) {
                if (data.error) $scope.notifier.danger(data.msg);

                data = data.data;

                console.log('get trans data ajaz', data);

                $scope.tx.to = $scope.tx.to || '0xCONTRACT';
                $scope.tx.contractAddr = $scope.tx.to === '0xCONTRACT' ? ethFuncs.getDeteministicContractAddress($scope.wallet.getAddressString(), data.nonce) : '';

                var txData = uiFuncs.getTxData($scope);


                uiFuncs.generateTx(txData, function (rawTx) {
                    if (!rawTx.isError) {
                        $scope.rawTx = rawTx.rawTx;
                        $scope.signedTx = rawTx.signedTx;

                        $scope.showRaw = true;
                    } else {
                        $scope.showRaw = false;
                        $scope.notifier.danger(rawTx.error);
                    }
                    if (!$scope.$$phase) $scope.$apply();
                });
            });
        } catch (e) {
            $scope.notifier.danger(e);
        }
    };


    $scope.sendTx = function () {
        $scope.sendTxModal.close();
        $scope.sendContractModal.close();
        uiFuncs.sendTx($scope.signedTx, function (resp) {
            if (!resp.isError) {
                var bExStr = $scope.ajaxReq.type != nodes.nodeTypes.Custom ? "<a href='" + $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                var contractAddr = $scope.tx.contractAddr != '' ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', $scope.tx.contractAddr) + "' target='_blank' rel='noopener'>" + $scope.tx.contractAddr + "</a>" : '';
                $scope.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);
            } else {
                $scope.notifier.danger(resp.error);
            }
        });
    }
    $scope.setVisibility = function (str) {
        $scope.visibility = str;
    }
    $scope.selectFunc = function (index) {
        $scope.contract.selectedFunc = {name: $scope.contract.functions[index].name, index: index};
        if (!$scope.contract.functions[index].inputs.length) {
            $scope.readFromContract();
            $scope.showRead = false;
        } else $scope.showRead = true;
        $scope.dropdownContracts = !$scope.dropdownContracts;
    };


    /*

        Gather contract information

     */

    $scope.getContractData = function () {


        const {functions, selectedFunc} = $scope.contract;

        var curFunc = functions[selectedFunc.index];
        var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
        var typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
        var types = typeName.split(',');
        types = types[0] == "" ? [] : types;
        var values = [];
        for (var i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
                if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));
                else values.push(curFunc.inputs[i].value);
            } else values.push('');
        }


        return '0x' + funcSig + ethUtil.solidityCoder.encodeParams(types, values);

    };


    /*

      Write to a contract
   */

    $scope.writeToContract = function () {
        if (!$scope.wd) {
            $scope.notifier.danger(globalFuncs.errorMsgs[3]);
            return;
        }
        $scope.tx.data = $scope.getContractData();
        $scope.tx.to = $scope.contract.address;
        $scope.sendContractModal.open();
    };


    $scope.toggleContractParams = function () {


        $scope.contract.applyConstructorParams = !$scope.contract.applyConstructorParams;

    };


    $scope.readFromContract = function () {
        ajaxReq.getEthCall({to: $scope.contract.address, data: $scope.getContractData()}, function (data) {
            if (!data.error) {
                var curFunc = $scope.contract.functions[$scope.contract.selectedFunc.index];
                var outTypes = curFunc.outputs.map(function (i) {
                    return i.type;
                });
                var decoded = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''));
                for (var i in decoded) {
                    if (decoded[i] instanceof BigNumber) curFunc.outputs[i].value = decoded[i].toFixed(0);
                    else curFunc.outputs[i].value = decoded[i];
                }
            } else throw data.msg;

        });
    };
    $scope.initContract = function () {
        try {
            if (!$scope.Validator.isValidAddress($scope.contract.address)) throw globalFuncs.errorMsgs[5];
            else if (!$scope.Validator.isJSON($scope.contract.abi)) throw globalFuncs.errorMsgs[26];
            $scope.contract.functions = [];
            var tAbi = JSON.parse($scope.contract.abi);
            for (var i in tAbi)
                if (tAbi[i].type == "function") {
                    tAbi[i].inputs.map(function (i) {
                        i.value = '';
                    });
                    $scope.contract.functions.push(tAbi[i]);
                }
            $scope.showReadWrite = true;

        } catch (e) {
            $scope.notifier.danger(e);
        }
    };


    $scope.$watch('contract.abi', function handleAbiUpdate(newVal, oldVal) {


        if (newVal && newVal !== oldVal) {

            // console.log('abi change');

            const constructor = $scope.initConstructorParamsFrom(newVal);

            if (constructor &&
                constructor.hasOwnProperty('inputs') &&
                Array.isArray(constructor.inputs) &&
                constructor.inputs.length > 0
            ) {

                $scope.contract.abi = newVal;

                $scope.contract.constructorParams = constructor;

            } else {

                // TODO: no constructor found, notifiy user
            }


            // console.log($scope.contract.constructorParams);

        }


    });

    $scope.initConstructorParamsFrom = function (abi) {


        try {

            abi = JSON.parse(abi);

        } catch (e) {


            console.error('error parsing abi', abi);

            return [];
        }


        const constructor = abi.find(i => i.type === 'constructor');

        if (!constructor) return [];

        constructor.inputs.forEach(input => input.value = '');

        return constructor;


    }
}
module.exports = contractsCtrl;
