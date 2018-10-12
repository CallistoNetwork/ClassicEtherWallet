"use strict";

const initTrans = {
    gasLimit: 21000,
    data: "",
    to: "",
    unit: "ether",
    value: 0,
    nonce: null,
    gasPrice: null
};

const initContract = {
    address: "",
    abi: [],
    functions: [],
    selectedFunc: null,
    applyConstructorParams: false,
    constructorParams: [],
    bytecode: ""
};

const contractsCtrl = function($scope, $sce, $rootScope, walletService) {
    walletService.wallet = null;

    Object.assign($scope, {
        rawTx: null,
        tx: initTrans,
        signedTx: null,
        contract: initContract,
        ajaxReq,
        Validator,
        visibility: "interactView",
        sendTxModal: new Modal(document.getElementById("deployContract")),
        sendContractModal: new Modal(document.getElementById("sendContract")),
        showReadWrite: false,
        showRaw: false,
        selectedAbi:
            Array.isArray(ajaxReq.abiList) && ajaxReq.abiList.length
                ? ajaxReq.abiList[0]
                : ""
    });

    $scope.selectExistingAbi = function(index) {
        const selectedAbi = ajaxReq.abiList[index];
        $scope.selectedAbi = selectedAbi;
        $scope.addressDrtv.ensAddressField = $scope.selectedAbi.address;
        $scope.addressDrtv.showDerivedAddress = false;
        $scope.dropdownExistingContracts = false;
        $scope.dropdownContracts = false;
        Object.assign($scope.contract, {
            selectedFunc: null,
            address: $scope.selectedAbi.address,
            abi: selectedAbi.abi
        });
        $scope.initContract();
    };

    /*


        if adding params to constructor, append params to bytecode
     */

    function _getContractData() {
        const {
            applyConstructorParams,
            abi,
            constructorParams,
            bytecode,
            selectedFunc
        } = $scope.contract;

        if ($scope.visibility === "interactView") {
            if (selectedFunc === null) {
                return "";
            }

            return $scope.getContractData();
        } else if (applyConstructorParams && abi) {
            return ethFuncs.sanitizeHex(
                bytecode +
                    ethUtil.solidityCoder.encodeParams(
                        constructorParams.inputs.map(i => i.type),
                        constructorParams.inputs.map(i => i.value)
                    )
            );
        }

        return ethFuncs.sanitizeHex(bytecode);
    }

    $scope.generateContractDeterministicAddr = function() {
        return new Promise((resolve, reject) => {
            ajaxReq.getTransactionData(
                walletService.wallet.getAddressString(),
                function(data) {
                    if (data.error) {
                        uiFuncs.notifier.danger(data.error);
                        return reject(data.error);
                    }

                    const contractAddr = ethFuncs.getDeteministicContractAddress(
                        walletService.wallet.getAddressString(),
                        data.data.nonce
                    );

                    Object.assign($scope.tx, {
                        data: _getContractData(),
                        to: contractAddr,
                        contractAddr
                    });

                    // const txData = uiFuncs.getTxData({
                    //     tx: $scope.tx,
                    //     wallet: walletService.wallet
                    // });

                    return resolve($scope.tx);
                }
            );
        });
    };

    $scope.estimateGasLimit = async function() {
        if (!$scope.tx.data) {
            $scope.tx.gasLimit = -1;
            uiFuncs.notifier.danger("Invalid Request");
            return false;
        }

        if ($scope.visibility === "deployView") {
            if (
                !(
                    walletService.wallet &&
                    walletService.wallet.getAddressString()
                )
            ) {
                uiFuncs.notifier.danger(globalFuncs.errorMsgs[3]);
                return;
            }
        }

        let estObj = {
            from:
                (walletService.wallet &&
                    walletService.wallet.getAddressString()) ||
                globalFuncs.donateAddress,
            to: $scope.tx.to,
            value: etherUnits.toWei($scope.tx.value, $scope.tx.unit),
            data: _getContractData()
        };

        if ($scope.visibility === "deployView") {
            if (!$scope.tx.to || angular.equals(to, "0xCONTRACT")) {
                // deploying contract, get add nonce to contract addr

                const result = await $scope.generateContractDeterministicAddr();
                Object.assign(estObj, { to: result.to });
            }
        } else if ($scope.visibility === "interactView") {
            const { functions, selectedFunc, address } = $scope.contract;

            Object.assign(estObj, {
                to: address,
                from: walletService.wallet.getAddressString(),
                data: $scope.getContractData()
            });
        }

        Object.assign($scope.tx, estObj);

        return ethFuncs
            .estimateGas(estObj)
            .then(function(gasLimit) {
                $scope.$apply(() => {
                    $scope.tx.gasLimit = new BigNumber(gasLimit).toNumber();
                });
                return gasLimit;
            })
            .catch(err => {
                $scope.$apply(() => {
                    $scope.tx.gasLimit = -1;
                });
                return err;
            });
    };

    $scope.generateTx = function() {
        if (
            !(walletService.wallet && walletService.wallet.getAddressString())
        ) {
            uiFuncs.notifier.danger("Unlock your wallet first!");
            return;
        }

        const walletString = walletService.wallet.getAddressString();

        ajaxReq.getTransactionData(walletString, function(data) {
            if (data.error) {
                uiFuncs.notifier.danger(data.error);
                return false;
            }

            const contractAddr =
                $scope.tx.to === "0xCONTRACT"
                    ? ethFuncs.getDeteministicContractAddress(
                          walletString,
                          data.data.nonce
                      )
                    : $scope.tx.to;

            Object.assign($scope.tx, {
                data: _getContractData(),
                to: contractAddr,
                contractAddr
            });

            const txData = uiFuncs.getTxData({
                tx: $scope.tx,
                wallet: walletService.wallet
            });

            uiFuncs
                .generateTx(txData)
                .then(function(tx) {
                    $scope.$apply(() => {
                        $scope.rawTx = tx.rawTx;
                        $scope.signedTx = tx.signedTx;
                        $scope.showRaw = true;
                    });
                })
                .catch(err => {
                    $scope.showRaw = false;

                    Object.assign($scope, {
                        rawTx: null,
                        signedTx: null
                    });
                })
                .finally(() => {
                    if ($scope.visibility === "deployView") {
                        $scope.sendTxModal.open();
                    } else {
                        $scope.sendContractModal.open();
                    }
                });
        });
    };

    $scope.sendTx = function() {
        if ($scope.visibility === "deployView") {
            $scope.sendTxModal.close();
        } else {
            $scope.sendContractModal.close();
        }
        uiFuncs.sendTx($scope.signedTx, false).then(function(resp) {
            const bExStr =
                ajaxReq.type !== nodes.nodeTypes.Custom
                    ? "<a href='" +
                      ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) +
                      "' target='_blank' rel='noopener'> View your transaction </a>"
                    : "";
            const contractAddr = $scope.tx.contractAddr
                ? " & Contract Address <a href='" +
                  ajaxReq.blockExplorerAddr.replace(
                      "[[address]]",
                      $scope.tx.contractAddr
                  ) +
                  "' target='_blank' rel='noopener'>" +
                  $scope.tx.contractAddr +
                  "</a>"
                : "";
            uiFuncs.notifier.success(
                globalFuncs.successMsgs[2] +
                    "<br />" +
                    resp.data +
                    "<br />" +
                    bExStr +
                    contractAddr
            );
        });
    };

    $scope.setVisibility = function(str = "interactView") {
        Object.assign($scope, {
            visibility: str,
            tx: Object.assign({}, $scope.tx, initTrans),
            contract: Object.assign({}, $scope.contract, initContract),
            rawTx: null,
            signedTx: null,
            showRaw: false
        });
    };

    $scope.selectFunc = function(index) {
        $scope.contract.selectedFunc = {
            name: $scope.contract.functions[index].name,
            index: index
        };
        if (!$scope.contract.functions[index].inputs.length) {
            $scope.readFromContract();
            $scope.showRead = false;
        } else $scope.showRead = true;
        $scope.dropdownContracts = !$scope.dropdownContracts;
    };

    /*

        Gather contract information

     */

    $scope.getContractData = function() {
        const { functions, selectedFunc } = $scope.contract;

        const curFunc = functions[selectedFunc.index];
        const fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
        const funcSig = ethFuncs.getFunctionSignature(fullFuncName);
        const typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
        let types = typeName.split(",");
        types = types[0] === "" ? [] : types;
        const values = [];
        for (var i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
                values.push(curFunc.inputs[i].value);
            } else values.push("");
        }

        return ethFuncs.sanitizeHex(
            funcSig + ethUtil.solidityCoder.encodeParams(types, values)
        );
    };

    /*

      Write to a contract
    */

    $scope.writeToContract = function() {
        if (
            !(walletService.wallet && walletService.wallet.getAddressString())
        ) {
            uiFuncs.notifier.danger(globalFuncs.errorMsgs[3]);
            return;
        }

        const { functions, selectedFunc, address } = $scope.contract;

        Object.assign($scope.tx, {
            to: address,
            contractAddr: address,
            data: $scope.getContractData()
        });

        function validData() {
            let check = true;

            functions[selectedFunc.index].inputs.forEach(i => {
                const isArray = i.type.slice(-2) === "[]";

                if (isArray) {
                    const type = i.type.replace("[]", "");

                    if (type === "string") {
                        return i.value;
                    }
                    const invalidValues = i.value.filter(item => item === "");

                    if (invalidValues.length > 0) {
                        uiFuncs.notifier.danger(globalFuncs.errorMsgs[39]);

                        check = false;
                    }
                }
            });

            return check;
        }

        // estimate gas limit via ajax request, generate tx data, open sendTransactionModal

        if (validData()) {
            $scope.estimateGasLimit().finally(() => {
                // open modal even if tx is failing
                // let user edit send value and re-check gas

                $scope.generateTx();
            });
        }
    };

    $scope.toggleContractParams = function() {
        $scope.contract.applyConstructorParams = !$scope.contract
            .applyConstructorParams;
    };

    $scope.readFromContract = function() {
        const data = $scope.getContractData();

        ajaxReq.getEthCall({ to: $scope.contract.address, data }, function(
            data
        ) {
            if (!data.error) {
                var curFunc =
                    $scope.contract.functions[
                        $scope.contract.selectedFunc.index
                    ];
                var outTypes = curFunc.outputs.map(function(i) {
                    return i.type;
                });
                var decoded = ethUtil.solidityCoder.decodeParams(
                    outTypes,
                    data.data.replace("0x", "")
                );
                for (var i in decoded) {
                    if (decoded[i] instanceof BigNumber)
                        curFunc.outputs[i].value = decoded[i].toFixed(0);
                    else curFunc.outputs[i].value = decoded[i];
                }
            } else throw data.msg;
        });
    };
    $scope.initContract = function() {
        let tAbi = $scope.contract.address;
        try {
            if (!Validator.isValidAddress($scope.contract.address)) {
                uiFuncs.notifier.danger(globalFuncs.errorMsgs[5]);
                return;
            }
            if (typeof $scope.contract.abi === "string") {
                tAbi = JSON.parse($scope.contract.abi);
            }

            $scope.contract.functions = [];
            for (const i in tAbi) {
                if (tAbi[i].type === "function") {
                    tAbi[i].inputs.map(function(i) {
                        i.value = "";
                    });
                    $scope.contract.functions.push(tAbi[i]);
                }
            }
            $scope.showReadWrite = true;
        } catch (e) {
            uiFuncs.notifier.danger(e);
        }
    };

    $scope.$watch("contract.abi", function handleAbiUpdate(newVal) {
        if ($scope.visibility === "deployView") {
            const constructor = $scope.initConstructorParamsFrom(newVal);

            if (
                constructor &&
                constructor.hasOwnProperty("inputs") &&
                Array.isArray(constructor.inputs) &&
                constructor.inputs.length > 0
            ) {
                $scope.contract.abi = newVal;

                $scope.contract.constructorParams = constructor;
            }
        }
    });

    $scope.initConstructorParamsFrom = function(abi) {
        try {
            if (Array.isArray(abi) && abi.length === 0) {
                return abi;
            }

            abi = JSON.parse(abi);
        } catch (e) {
            console.error("error parsing abi", abi);

            return [];
        }

        const constructor = abi.find(i => i.type === "constructor");

        if (!constructor) {
            uiFuncs.notifier.danger("No constructor found in abi");
            return [];
        }

        constructor.inputs.forEach(input => (input.value = ""));

        return constructor;
    };

    $scope.$watch("contract.bytecode", function(newVal, oldVal) {
        $scope.tx.data = _getContractData();
    });
};
module.exports = contractsCtrl;
