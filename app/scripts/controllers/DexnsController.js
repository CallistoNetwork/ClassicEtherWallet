"use strict";
const statusCodes = {
    nothing: 0,
    user: 1,
    token: 2,
    contract: 3,
    "update Name": 4,
    "access Name content": 5,
    "step 2 register Name": 6,
    confirmation: 7
};

// visible function list

const feContracts = [
    // 'registerName',
    "endtimeOf",
    "extend_Name_Binding_Time",
    "unassignName",
    "updateName",
    "appendNameMetadata",
    "hideNameOwner",
    "assignName",
    "changeNameOwner"
];

const storageContracts = [
    "metadataOf",
    "ownerOf",
    "getName",
    "name_assignation",
    "assignation"
];

const AVAILABLE_RESPONSE_TEXT = "This name is available for registration.";
const UNAVAILABLE_RESPONSE_TEXT =
    "This name is already registered! You should try to register another name.";

const DexnsController = function DexnsController(
    $scope,
    $sce,
    $rootScope,
    walletService,
    backgroundNodeService,
    dexnsService
) {
    walletService.wallet = null;
    if (ajaxReq.type !== nodes.nodeTypes.ETC) {
        $rootScope.$broadcast("ChangeNode", globalFuncs.networks.ETC || 0);
    }
    Object.assign($scope, {
        AVAILABLE_RESPONSE_TEXT,
        UNAVAILABLE_RESPONSE_TEXT,
        dexnsService,
        walletService,
        networks: globalFuncs.networks,
        contract: dexnsService.feContract,
        etherUnits,
        dexnsConfirmModalModal: new Modal(
            document.getElementById("dexnsConfirmModal")
        ),
        sendTxModal: new Modal(document.getElementById("dexnsSendTxModal"))
    });

    $scope.handleRegisterAndUpdateName = function(_form) {
        if (!_form.$valid) {
            return uiFuncs.notifier.danger("Invalid Request");
        }

        if (!walletUnlocked()) return false;

        const {
            tokenName,
            destination,
            abi,
            link,
            sourceCode,
            info,
            tokenNetwork,
            hideOwner
        } = $scope.input;

        const _metadata = dexnsService.stringifyMetadata($scope.input);

        const _owner = walletService.wallet.getAddressString();

        $scope.tx = {
            inputs: [tokenName, _owner, destination, _metadata, hideOwner],
            value: dexnsService.feContract.namePrice[0].value,
            unit: "wei",
            from: _owner
        };

        return dexnsService.feContract
            .genTxContract(
                "registerAndUpdateName",
                walletService.wallet,
                $scope.tx
            )
            .then(result => openModal(result))
            .catch(err => {
                throw err;
            });
    };
    $scope.getOwningTime = function() {
        dexnsService.feContract.call("owningTime");
    };

    $scope.call = async function(_function) {
        const tx = { inputs: _function.inputs.map(i => i.value) };

        if (_function.contract === "storageContract") {
            if (_function.name === "metadataOf") {
                $scope.raw = "";
            }

            const result = await dexnsService.storageContract.call(
                _function,
                tx
            );

            $scope.$apply(function() {
                if (_function.name === "metadataOf") {
                    const { value } = result[0];

                    $scope.outputs[_function.name] = dexnsService.parseMetadata(
                        value
                    );
                    $scope.raw = value;
                } else {
                    $scope.outputs[_function.name] = result;
                }
            });
        } else {
            const result = await dexnsService.feContract.call(_function, tx);

            $scope.$apply(function() {
                $scope.outputs[_function.name] = result;
            });
        }

        // });
    };

    $scope.handleSubmit = function(_function) {
        if (_function.stateMutability === "view") {
            $scope.call(_function);
        } else {
            $scope.genTxOpenModal(_function);
        }
    };

    /*


          generate tx to contract

          open modal to confirm
       */

    $scope.genTxOpenModal = function(_function) {
        if (!walletUnlocked()) {
            return false;
        }

        let value = 0;

        if (
            ["registerName", "registerAndUpDateName"].includes(_function.name)
        ) {
            value = dexnsService.feContract.namePrice[0].value;
        }

        $scope._function = _function;
        return dexnsService.feContract
            .genTxContract(_function, walletService.wallet, {
                inputs: _function.inputs.map(i => i.value),
                from: walletService.wallet.getAddressString(),
                value,
                unit: "wei"
            })
            .then(signedTx => ($scope.tx = signedTx))
            .then(openModal)
            .catch(err => {
                uiFuncs.notifier.danger(err);
            });
    };

    function openModal(signedTx) {
        $scope.$apply(function() {
            $scope.tx = signedTx;
        });
        $scope.sendTxModal.open();
    }

    /*

          send the tx to contract after user confirms
       */

    $scope.sendTxContract = function() {
        dexnsService.feContract.sendTx($scope.tx).finally(result => {
            $scope.sendTxModal.close();

            // todo: save result and display
        });
    };

    $scope.openRegisterName = function() {
        $scope.dexns_status = statusCodes.user; // 1 -> user
    };

    $scope.openRegisterToken = function() {
        $scope.dexns_status = statusCodes.token;
    };

    $scope.handleCheckName = function() {
        return $scope
            .checkDexNSName($scope.DexNSName)
            .then(({ time, available }) => {
                if (available) {
                    $scope.dexns_status = statusCodes["step 2 register Name"];
                    $scope.notifier.info(AVAILABLE_RESPONSE_TEXT);
                } else {
                    uiFuncs.notifier.danger(UNAVAILABLE_RESPONSE_TEXT);
                }
            });
    };

    $scope.checkDexNSName = function(_name) {
        return dexnsService.feContract
            .call("endtimeOf", { inputs: [_name] })
            .then(data => {
                const { value } = data[0];

                const time = new BigNumber(new Date().getTime());

                return {
                    time,
                    available: time.gt(new BigNumber(value).mul(1000))
                };
            });
    };

    function walletUnlocked() {
        if (!walletService.wallet) {
            uiFuncs.notifier.danger("Unlock your wallet first!");
            return false;
        }

        return true;
    }

    $scope.registerDexNSName = function() {
        if (walletUnlocked()) {
            $scope.dexns_status = statusCodes.confirmation;

            Object.assign($scope.tx, {
                value: dexnsService.feContract.namePrice[0].value,
                unit: "wei",
                to: dexnsService.feContract.address
            });

            $scope.dexnsConfirmModalModal.open();
        }
    };

    $scope.visibleFuncList = []
        .concat(
            dexnsService.storageContract.abi
                .filter(i => storageContracts.includes(i.name))
                .map(i => Object.assign(i, { contract: "storageContract" })),
            dexnsService.feContract.abi
                .filter(i => feContracts.includes(i.name))
                .map(i => Object.assign(i, { contract: "feContract" }))
        )
        .map(i => Object.assign(i, { sortBy: i.type === "view" ? 10 : 1 }))
        .sort((a, b) => b.sortBy - a.sortBy);

    $scope._registerName = function() {
        const tx = {
            value: dexnsService.feContract.namePrice[0].value,
            unit: "wei",
            from: walletService.wallet.getAddressString(),
            inputs: [$scope.DexNSName]
        };

        return uiFuncs
            .genTxContract(
                "registerName",
                dexnsService.feContract,
                walletService.wallet,
                tx
            )
            .then(_tx => {
                $scope.tx = _tx;
                return uiFuncs.sendTxContract(
                    dexnsService.feContract,
                    $scope.tx
                );
            })
            .finally(() => {
                $scope.dexnsConfirmModalModal.close();
            });
    };

    function main() {
        init();

        Promise.all([
            dexnsService.feContract.call("namePrice"),
            dexnsService.feContract.call("owningTime")
        ]);
    }

    $scope.selectFunc = function(_func) {
        $scope.dropdownContracts = !$scope.dropdownContracts;

        $scope.selectedFunc = _func;

        if (_func.inputs.length === 0) {
            $scope.call(_func);
        }
    };

    function init() {
        Object.assign($scope, {
            nodeList: Object.values(nodes.nodeTypes),
            raw: "",
            outputs: [],
            dexns_status: statusCodes.nothing, //0,
            // user input of name to register
            DexNSName: "",
            input: {
                abi: "",
                link: "",
                sourceCode: "",
                info: "",
                tokenName: "",
                tokenNetwork: ajaxReq.type,
                owner: "",
                destination: "",
                hideOwner: false,
                assign: false
            },
            hideEnsInfoPanel: false,
            tx: {
                gasLimit: "200000",
                data: "",
                to: "",
                unit: "ether",
                value: 0,
                gasPrice: ""
            },
            sendTxStatus: "",
            _function: null,
            dropdownContracts: false,
            selectedFunc: null
        });
    }

    $scope.init = init;

    main();
};

module.exports = DexnsController;
