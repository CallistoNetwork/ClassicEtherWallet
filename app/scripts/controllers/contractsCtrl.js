"use strict";

const contractsCtrl = function($scope, $sce, $rootScope, walletService) {
    walletService.wallet = null;

    $scope.visibility = "interactView";
    $scope.sendTxModal = new Modal(document.getElementById("deployContract"));
    $scope.sendContractModal = new Modal(
        document.getElementById("sendContract")
    );
    $scope.showReadWrite = false;
    $scope.showRaw = false;

    const initTrans = {
        gasLimit: "",
        data: "",
        to: "",
        unit: "ether",
        value: 0,
        nonce: null,
        gasPrice: null
    };

    const initContract = {
        address: Validator.isValidAddress(globalFuncs.urlGet("address"))
            ? globalFuncs.urlGet("address")
            : "",
        abi: [],
        functions: [],
        selectedFunc: null,
        applyConstructorParams: false,
        constructorParams: [],
        bytecode: ""
    };

    var node = globalFuncs.getCurNode();
    $scope.selectedAbi = nodes.nodeList[node].abiList[0] || "";

    $scope.tx = initTrans;

    $scope.abiList = function() {
        return ajaxReq.abiList;
    };

    $scope.rawTx = null;

    $scope.signedTx = null;

    $scope.contract = initContract;

    $scope.$on("ChangeWallet", () => {
        $scope.tx.nonce = 0;
    });

    $scope.$watch("contract.address", function(newValue, oldValue) {
        if (Validator.isValidAddress($scope.contract.address)) {
            for (var i in ajaxReq.abiList) {
                if (
                    ajaxReq.abiList[i].address.toLowerCase() ===
                    $scope.contract.address.toLowerCase()
                ) {
                    $scope.contract.abi = ajaxReq.abiList[i].abi;
                    break;
                }
            }
        }
    });
    $scope.selectExistingAbi = function(index) {
        $scope.selectedAbi = ajaxReq.abiList[index];
        $scope.contract.address = $scope.selectedAbi.address;
        $scope.addressDrtv.ensAddressField = $scope.selectedAbi.address;
        $scope.addressDrtv.showDerivedAddress = false;
        $scope.dropdownExistingContracts = false;
        $scope.contract.selectedFunc = null;
        $scope.dropdownContracts = false;

        if ($scope.initContractTimer) clearTimeout($scope.initContractTimer);
        $scope.initContractTimer = setTimeout(function() {
            $scope.initContract();
        }, 50);
    };

    $scope.$watch("contract.bytecode", function(newVal, oldVal) {
        $scope.tx.data = handleContractData();
    });

    /*


        if adding params to constructor, append params to bytecode
     */

    function handleContractData() {
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

    $scope.estimateGasLimit = function() {
        const { value = 0, unit = "ether", to, data } = $scope.tx;

        if (!data) {
            $scope.tx.gasLimit = -1;
            return false;
        }

        const estObj = {
            from:
                walletService.wallet && walletService.wallet.getAddressString()
                    ? walletService.wallet.getAddressString()
                    : globalFuncs.donateAddress,
            data: handleContractData(),
            value: etherUnits.toWei(value, unit)
        };

        if (to && to !== "0xCONTRACT") {
            estObj.to = to;
        }
        // $scope.tx.gasLimit = "loading...";

        return ethFuncs
            .estimateGas(estObj)
            .then(function(gasLimit) {
                $scope.$apply(() => {
                    $scope.tx.gasLimit = Number(gasLimit);
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

    $scope.generateTx = function(deployingContract = false) {
        const walletString = walletService.wallet.getAddressString();

        const to = $scope.tx.to || "0xCONTRACT";

        ajaxReq.getTransactionData(walletString, function(data) {
            if (data.error) {
                uiFuncs.notifier.danger(data.error);
                return false;
            }

            const contractAddr =
                to === "0xCONTRACT"
                    ? ethFuncs.getDeteministicContractAddress(
                          walletString,
                          data.data.nonce
                      )
                    : "";

            Object.assign($scope.tx, {
                //gasLimit: //0 <= $scope.tx.gasLimit ? $scope.tx.gasLimit : 0,
                data: handleContractData(),
                to,
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
                })
                .finally(() => {
                    if (deployingContract) {
                        $scope.sendTxModal.open();
                    } else {
                        $scope.sendContractModal.open();
                    }
                });
        });
    };

    $scope.sendTx = function() {
        $scope.sendTxModal.close();
        $scope.sendContractModal.close();
        uiFuncs.sendTx($scope.signedTx, false).then(function(resp) {
            var bExStr =
                ajaxReq.type !== nodes.nodeTypes.Custom
                    ? "<a href='" +
                      ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) +
                      "' target='_blank' rel='noopener'> View your transaction </a>"
                    : "";
            var contractAddr = $scope.tx.contractAddr
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

    $scope.setVisibility = function(str) {
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

        var curFunc = functions[selectedFunc.index];
        var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
        var typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
        var types = typeName.split(",");
        types = types[0] === "" ? [] : types;
        var values = [];
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
        if (!$scope.wd) {
            uiFuncs.notifier.danger(globalFuncs.errorMsgs[3]);
            return;
        }

        const { functions, selectedFunc, address } = $scope.contract;

        $scope.tx.to = address;
        $scope.tx.data = $scope.getContractData();

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

                $scope.generateTx(false);
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
        try {
            if (!Validator.isValidAddress($scope.contract.address))
                throw globalFuncs.errorMsgs[5];
            else if (!Validator.isJSON($scope.contract.abi))
                throw globalFuncs.errorMsgs[26];
            $scope.contract.functions = [];
            var tAbi = JSON.parse($scope.contract.abi);
            for (var i in tAbi)
                if (tAbi[i].type == "function") {
                    tAbi[i].inputs.map(function(i) {
                        i.value = "";
                    });
                    $scope.contract.functions.push(tAbi[i]);
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
};
module.exports = contractsCtrl;
