"use strict";

const _get = require("lodash/get");

const initTx = {
    gasLimit: 300000,
    data: "",
    to: "",
    unit: "ether",
    value: 0,
    contractAddr: null
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
        tx: initTx,
        signedTx: null,
        contract: initContract,
        ajaxReq,
        Validator,
        visibility: "interactView",
        deployContractModal: new Modal(
            document.getElementById("deployContract")
        ),
        interactWithContractModal: new Modal(
            document.getElementById("interactWithContractModal")
        ),
        showReadWrite: false,
        showRaw: false,
        selectedAbi: _get(ajaxReq, "abiList[0]", "")
    });

    $scope.selectExistingAbi = function(index) {
        const selectedAbi = ajaxReq.abiList[index];
        Object.assign($scope, {
            selectedAbi,
            addressDrtv: {
                ensAddressField: selectedAbi.address,
                showDerivedAddress: false
            },
            dropdownExistingContracts: false,
            dropdownContracts: false,
            contract: Object.assign($scope.contract, {
                selectedFunc: null,
                address: $scope.selectedAbi.address,
                abi: selectedAbi.abi
            })
        });
        $scope.initContract();
    };

    $scope.estimateGasLimit = async function() {
        if (!$scope.walletUnlocked()) {
            return;
        }

        var estObj = {
            from:
                $scope.wallet != null
                    ? $scope.wallet.getAddressString()
                    : globalFuncs.donateAddress,
            value: ethFuncs.sanitizeHex(
                ethFuncs.decimalToHex(
                    etherUnits.toWei($scope.tx.value, $scope.tx.unit)
                )
            ),
            data: ethFuncs.sanitizeHex($scope.tx.data)
        };

        if ($scope.tx.to != "") estObj.to = $scope.tx.to;

        return uiFuncs
            .estimateGas(estObj)
            .then(function(gasLimit) {
                $scope.$apply(() => {
                    Object.assign($scope.tx, {
                        data: estObj.data,
                        from: estObj.from,
                        to: estObj.to,
                        gasLimit: new BigNumber(gasLimit).toNumber()
                    });
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

    $scope.generateTx = async function() {
        if (!$scope.walletUnlocked()) {
            return;
        }
        const tx = {
            data: $scope.getContractData(),
            to:
                $scope.visibility === "deployView"
                    ? "0xCONTRACT"
                    : $scope.contract.address
        };

        Object.assign($scope.tx, tx);

        const txData = uiFuncs.getTxData({
            tx: $scope.tx,
            wallet: walletService.wallet
        });

        return uiFuncs
            .generateTx(txData)
            .then(function(result) {
                $scope.$apply(() => {
                    const contractAddr = ethFuncs.getDeteministicContractAddress(
                        txData.from,
                        result.nonce
                    );
                    Object.assign($scope, {
                        rawTx: result.rawTx,
                        showRaw: true,
                        signedTx: result.signedTx
                    });
                    Object.assign($scope.tx, {
                        nonce: result.nonce,
                        contractAddr
                    });
                });

                return result;
            })
            .catch(err => {
                uiFuncs.notifier.danger(err);
                return Object.assign($scope, {
                    showRaw: false,
                    rawTx: null,
                    signedTx: null
                });
            });
    };

    $scope.sendTx = function() {
        return uiFuncs
            .sendTx($scope.signedTx, false)
            .then(function(resp) {
                const bExStr =
                    ajaxReq.type !== nodes.nodeTypes.Custom
                        ? "<a href='" +
                          ajaxReq.blockExplorerTX.replace(
                              "[[txHash]]",
                              resp.data
                          ) +
                          "' target='_blank' rel='noopener' class='btn btn-xs btn-info strong'> View your transaction </a>"
                        : "";

                let contractAddr = "";
                if ($scope.visibility === "deployView") {
                    contractAddr = $scope.tx.contractAddr
                        ? " & Contract Address <a href='" +
                          ajaxReq.blockExplorerAddr.replace(
                              "[[address]]",
                              $scope.tx.contractAddr
                          ) +
                          "' target='_blank' rel='noopener'>" +
                          $scope.tx.contractAddr +
                          "</a>"
                        : "";
                }

                uiFuncs.notifier.success(
                    globalFuncs.successMsgs[2] +
                        "<br />" +
                        resp.data +
                        "<br />" +
                        bExStr +
                        contractAddr,
                    0
                );
            })
            .finally(() => {
                if ($scope.visibility === "deployView") {
                    $scope.deployContractModal.close();
                } else {
                    $scope.interactWithContractModal.close();
                }
            });
    };

    $scope.setVisibility = function(str = "interactView") {
        Object.assign($scope, {
            visibility: str,
            tx: Object.assign({}, initTx),
            contract: Object.assign({}, initContract),
            rawTx: null,
            signedTx: null,
            showRaw: false
        });
    };

    $scope.selectFunc = function(index) {
        const selectedFunc = $scope.contract.functions[index];

        Object.assign($scope.contract, {
            selectedFunc: Object.assign({}, selectedFunc, { index })
        });

        if (!$scope.contract.functions[index].inputs.length) {
            $scope.readFromContract();
            $scope.showRead = false;
        } else $scope.showRead = true;
        $scope.dropdownContracts = !$scope.dropdownContracts;
    };

    $scope.getContractData = function() {
        const {
            applyConstructorParams,
            abi,
            constructorParams,
            bytecode,
            selectedFunc,
            functions
        } = $scope.contract;

        if ($scope.visibility === "deployView") {
            return _dataWithConstructor();
        } else if ($scope.visibility === "interactView") {
            const curFunc = functions[selectedFunc.index];
            const fullFuncName = ethUtil.solidityUtils.transformToFullName(
                curFunc
            );
            const funcSig = ethFuncs.getFunctionSignature(fullFuncName);
            const typeName = ethUtil.solidityUtils.extractTypeName(
                fullFuncName
            );
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
        } else {
            throw new Error("Invalid Request");
        }

        function _dataWithConstructor() {
            if (applyConstructorParams && abi) {
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
    };

    /*

      Write to a contract
    */

    $scope.walletUnlocked = function() {
        const isUnlocked = walletService.unlocked();
        if (!isUnlocked) {
            uiFuncs.notifier.danger(globalFuncs.errorMsgs[3]);
        }
        return isUnlocked;
    };

    $scope.writeToContract = function() {
        const { functions, selectedFunc, address } = $scope.contract;
        if (!($scope.walletUnlocked() && validData())) {
            return;
        }

        Object.assign($scope.tx, {
            to: address
        });

        // open modal even if tx is failing
        // let user edit send value and re-check gas
        $scope.estimateGasLimit().finally(() => {
            $scope.generateTx().finally(() => {
                $scope.interactWithContractModal.open();
            });
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
                const curFunc =
                    $scope.contract.functions[
                        $scope.contract.selectedFunc.index
                    ];
                const outTypes = curFunc.outputs.map(function(i) {
                    return i.type;
                });
                const decoded = ethUtil.solidityCoder.decodeParams(
                    outTypes,
                    data.data.replace("0x", "")
                );
                for (const i in decoded) {
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
        if ($scope.visibility === "deployView") {
            if (Validator.isValidHex(newVal)) {
                $scope.tx.data = $scope.getContractData();
            }
        }
    });

    $scope.$watch("contract.abi", function handleAbiUpdate(newVal) {
        if ($scope.visibility === "deployView") {
            const constructor = $scope.initConstructorParamsFrom(newVal);

            if (
                constructor &&
                constructor.hasOwnProperty("inputs") &&
                Array.isArray(constructor.inputs) &&
                0 < constructor.inputs.length
            ) {
                $scope.contract.abi = newVal;

                $scope.contract.constructorParams = constructor;
            }
        }
    });
};
module.exports = contractsCtrl;
