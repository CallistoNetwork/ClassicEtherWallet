'use strict';

// TODO: add ability to send contract a value on deployment


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

    const initTrans = {
        gasLimit: '',
        data: '',
        to: '',
        unit: "ether",
        value: 0,
        nonce: null,
        gasPrice: null
    };

    const initContract = {
        address: globalFuncs.urlGet('address') != null && $scope.Validator.isValidAddress(globalFuncs.urlGet('address')) ? globalFuncs.urlGet('address') : '',
        abi: [],
        functions: [],
        selectedFunc: null,
        applyConstructorParams: false,
        constructorParams: [],
        bytecode: '',
    };


    $scope.tx = initTrans;

    $scope.rawTx = null;

    $scope.signedTx = null;

    $scope.contract = initContract;

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


    /*
        Reset data on visibility switch
     */
    $scope.$watch('visibility', function () {

        $scope.tx = Object.assign({}, $scope.tx, initTrans);
        $scope.contract = Object.assign({}, $scope.contract, initContract);


        $scope.rawTx = null;
        $scope.signedTx = null;

    });

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
    };


    $scope.$watch('contract.bytecode', function (newVal, oldVal) {


        $scope.tx.data = handleContractData();

    });


    /*


        if adding params to constructor, append params to data
     */

    function handleContractData() {

        const {applyConstructorParams, abi, constructorParams, bytecode, selectedFunc} = $scope.contract;


        if ($scope.visibility === 'interactView') {


            if (selectedFunc === null) {

                return '';
            }

            return $scope.getContractData();
        }

        else if (applyConstructorParams && abi) {


            return ethFuncs.sanitizeHex(bytecode + ethUtil.solidityCoder.encodeParams(
                constructorParams.inputs.map(i => i.type),
                constructorParams.inputs.map(i => i.value)
            ))

        }


        return ethFuncs.sanitizeHex(bytecode);
    }


    $scope.estimateGasLimit = function (callback = null) {


        const {value, unit, to, data} = $scope.tx;

        if (!data) {

            $scope.tx.gasLimit = '';
            return false;
        }


        var estObj = {

            from: $scope.wallet && $scope.wallet.getAddressString() ? $scope.wallet.getAddressString() : globalFuncs.donateAddress,
            data: handleContractData(),

        };

        if (to && to !== '0xCONTRACT') {

            estObj.to = to;
        }


        estObj.value = ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(value, unit)));


        $scope.tx.gasLimit = 'loading...';


        ethFuncs.estimateGas(estObj, function (data) {


            if (data.error) {

                $scope.tx.gasLimit = '';

                $scope.notifier.danger(data.msg);

            } else {

                $scope.tx.gasLimit = data.data;
            }

            if (callback) {

                callback();
            }

        });
    };


    $scope.generateTx = function (callback = null) {

        let {data, gasLimit} = $scope.tx;

        try {
            if ($scope.wallet == null) throw globalFuncs.errorMsgs[3];
            else if (!ethFuncs.validateHexString(data)) throw globalFuncs.errorMsgs[9];
            else if (!globalFuncs.isNumeric(gasLimit) || parseFloat(gasLimit) <= 0) throw globalFuncs.errorMsgs[8];


            $scope.tx.data = handleContractData();

            const walletString = $scope.wallet.getAddressString();


            ajaxReq.getTransactionData(walletString, function (data) {

                if (data.error) {
                    $scope.notifier.danger(data.msg);
                }


                $scope.tx.to = $scope.tx.to || '0xCONTRACT';

                $scope.tx.contractAddr = $scope.tx.to === '0xCONTRACT' ? ethFuncs.getDeteministicContractAddress(walletString, data.data.nonce) : '';

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
        } finally {

            if (callback) {

                $scope.sendContractModal.open();
            }
        }
    };


    $scope.sendTx = function () {
        $scope.sendTxModal.close();
        $scope.sendContractModal.close();
        uiFuncs.sendTx($scope.signedTx, function (resp) {
            if (!resp.isError) {
                var bExStr = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? "<a href='" + $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                var contractAddr = $scope.tx.contractAddr ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', $scope.tx.contractAddr) + "' target='_blank' rel='noopener'>" + $scope.tx.contractAddr + "</a>" : '';
                $scope.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);
            } else {
                $scope.notifier.danger(resp.error);
            }
        });
    };

    $scope.setVisibility = function (str) {
        $scope.visibility = str;


    };

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
        types = types[0] === "" ? [] : types;
        var values = [];
        for (var i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
                if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));
                else values.push(curFunc.inputs[i].value);
            } else values.push('');
        }

        return ethFuncs.sanitizeHex(funcSig + ethUtil.solidityCoder.encodeParams(types, values));

    };


    /*

      Write to a contract
   */

    $scope.writeToContract = function () {
        if (!$scope.wd) {
            $scope.notifier.danger(globalFuncs.errorMsgs[3]);
            return;
        }

        $scope.tx.to = $scope.contract.address;
        $scope.tx.data = $scope.getContractData();

        // estimate gas limit via ajax request, generate tx data, open sendTransactionModal

        $scope.estimateGasLimit($scope.generateTx.bind(this, true));


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


    $scope.$watch('contract.abi', function handleAbiUpdate(newVal) {


        if ($scope.visibility === 'deployView') {


            const constructor = $scope.initConstructorParamsFrom(newVal);

            if (constructor &&
                constructor.hasOwnProperty('inputs') &&
                Array.isArray(constructor.inputs) &&
                constructor.inputs.length > 0
            ) {

                $scope.contract.abi = newVal;

                $scope.contract.constructorParams = constructor;

            }


        }


    });

    $scope.initConstructorParamsFrom = function (abi) {

        try {

            if (Array.isArray(abi) && abi.length === 0) {

                return abi;
            }

            abi = JSON.parse(abi);

        } catch (e) {


            console.error('error parsing abi', abi);

            return [];
        }


        const constructor = abi.find(i => i.type === 'constructor');

        if (!constructor) {


            $scope.notifier.danger('No constructor found in abi');
            return [];
        }

        constructor.inputs.forEach(input => input.value = '');

        return constructor;


    }
}
module.exports = contractsCtrl;
