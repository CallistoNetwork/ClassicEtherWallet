"use strict";

const Transport = require("@ledgerhq/hw-transport-u2f").default;

const LedgerEth = require("@ledgerhq/hw-app-eth").default;

const erc20Abi = require("../abiDefinitions/erc20abi.json");

const DEXNS = require("../abiDefinitions/etcAbi.json").find(
    contract =>
        contract.address === "0x28fc417c046d409c14456cec0fc6f9cde46cc9f3"
);

if (!DEXNS) {
    throw new Error("Unable to find DEXNS abi");
}

var walletBalanceCtrl = function(
    $rootScope,
    $scope,
    $sce,
    walletService,
    backgroundNodeService,
    modalService,
    coldStakingService,
    coldStakingV2Service,
    messageService,
    $interval,
    $timeout
) {
    $scope.messageService = messageService;

    $scope.tokenVisibility = "shown";

    $scope.modalService = modalService;

    $scope.coldStakingService = coldStakingService;

    $scope.coldStakingV2Service = coldStakingV2Service;

    $scope.erc20Indexes = {
        DECIMALS: 2,
        SYMBOL: 3,
        DEXNSFunction: 5
    };

    $scope.tokensLoaded = false;
    $scope.localToken = {
        contractAdd: "",
        symbol: "",
        decimals: "",
        type: "custom",
        network: ""
    };
    $scope.contract = {
        functions: []
    };
    $scope.input = {
        customTokenSymbol: ""
    };
    $scope.customTokenInterval = null;

    $scope.nodeList = nodes.nodeList;
    $scope.alternativeBalance = nodes.alternativeBalance;

    $scope.customTokenField = false;

    $scope.stakerInfo = {
        amount: 0,
        time: 0,
        reward: 0
    };

    $scope.stakerInfoV2 = {
        amount: 0,
        time: 0,
        reward: 0,
        multiplier: 0,
        end_time: 0
    };

    /*


        This function is used to estimate gas of cliam and claim_and_withrdaw from
        cold staking service.
     */

    $scope.refreshBalances = function() {
        walletService.wallet.setBalance();
        $scope.stakerInfo = { amount: 0, time: 0, reward: 0 };
        $scope.stakerInfoV2 = { amount: 0, time: 0, reward: 0, multiplier:0, end_time:0 };
        $scope.handleStake();
    };

    $scope.$on("ChangeWallet", () => {
        coldStakingService.initStakerInfo();
        coldStakingV2Service.initStakerInfo();
        $scope.stakerInfo = { amount: 0, time: 0, reward: 0 };
        $scope.stakerInfoV2 = { amount: 0, time: 0, reward: 0, multiplier:0, end_time:0 };
        $scope.handleStake();
        // walletService.wallet.setTokens();
        console.log(walletService.wallet.balances);
    });

    $scope.handleStake = () => {
        $scope.interval_ = $interval(async () => {
            if (!$scope.stakerInfo.amount) {
                await $scope._handleStake();
            }
            if (!$scope.stakerInfoV2.amount) {
                await $scope._handleStakeV2();
            }
        }, 1000);

        $timeout(() => $interval.cancel($scope.interval_), 1000 * 10);
    };

    $scope.$on("$destroy", () => {
        if ($scope.interval_) {
            $interval.cancel($scope.interval_);
        }
    });

    $scope._handleStake = () => {
        if (!coldStakingService.validNetwork()) {
            return;
        }
        return coldStakingService
            .staker()
            .then(result => {
                $scope.$apply(function() {
                    $scope.stakerInfo = Object.assign({}, result);
                });
                return result;
            })
            .catch(err => {
                $scope.stakerInfo = { amount: 0, time: 0, reward: 0 };

                return $scope.stakerInfo;
            });
    };

    $scope._handleStakeV2 = () => {
        if (!coldStakingV2Service.validNetwork()) {
            return;
        }
        return coldStakingV2Service
            .staker()
            .then(result => {
                $scope.$apply(function() {
                    $scope.stakerInfoV2 = Object.assign({}, result);
                });
                return result;
            })
            .catch(err => {
                $scope.stakerInfoV2 = { amount: 0, time: 0, reward: 0, multiplier:0, end_time:0 };

                return $scope.stakerInfoV2;
            });
    };

    $scope.estimateGas_ = function(name = "withdraw_stake", CSService, v1) {
        const tx = {
            from: walletService.wallet.getAddressString()
        };

        uiFuncs
            .estGasContract(name, CSService.contract, tx)
            .then(data => {
                Object.assign(CSService.tx, data);
            })
            .catch(err => {
                console.log(err);
                uiFuncs.notifier.danger((err && err.msg) || err);
            })
            .finally(() => {
                if (name === "withdraw_stake" && v1) {
                    modalService.openWithdrawModal.open();
                } else if (name === "withdraw_stake" && !v1) {
                    modalService.openWithdrawModalV2.open();
                } else if (name === "claim" && v1) {
                    modalService.openClaimRewardModal.open();
                } else if (name === "claim" && !v1) {
                    modalService.openClaimRewardModalV2.open();
                }
            });
    };

    $scope.handleOpenWithdraw = function() {
        $scope.estimateGas_("withdraw_stake", coldStakingService, true);
    };

    $scope.handleOpenWithdrawV2 = function() {
        $scope.estimateGas_("withdraw_stake", coldStakingV2Service, false);
    };

    $scope.handleOpenClaim = function() {
        $scope.estimateGas_("claim", coldStakingService, true);
    };

    $scope.handleOpenClaimV2 = function() {
        $scope.estimateGas_("claim", coldStakingV2Service, false);
    };

    $scope.resetTokenField = function() {
        $scope.customTokenField = false;
        $scope.customTokenDexNSField = false;
        $scope.input.customTokenSymbol = "";
    };

    $scope.saveTokenToLocal = function() {
        globalFuncs.saveTokenToLocal(
            Object.assign({}, $scope.localToken, {
                type: ajaxReq.type,
                local: true
            }),
            function(data) {
                if (!data.error) {
                    $scope.resetLocalToken();
                    walletService.wallet.setTokens();
                    $scope.validateLocalToken = $sce.trustAsHtml("");

                    $scope.resetTokenField();

                    $scope.resetLocalToken();
                } else {
                    uiFuncs.notifier.danger(data.msg);
                }
            }
        );
    };

    $scope.resetLocalToken = function() {
        $scope.localToken = {
            contractAdd: "",
            symbol: "",
            decimals: "",
            type: ajaxReq.type
        };
    };

    $scope.initContract = function() {
        $scope.contract.functions = [];
        for (const i in erc20Abi) {
            if (erc20Abi[i].type === "function") {
                erc20Abi[i].inputs.map(function(i) {
                    i.value = "";
                });
                $scope.contract.functions.push(erc20Abi[i]);
            }
        }
    };

    /*

        @param: indexFunc int: the index of the contract method
        @returns: encoded params
     */

    $scope.getTxData = function(indexFunc) {
        var curFunc = $scope.contract.functions[indexFunc];
        var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
        var typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
        var types = typeName.split(",");
        types = types[0] == "" ? [] : types;
        var values = [];
        for (var i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
                if (
                    curFunc.inputs[i].type.indexOf("[") !== -1 &&
                    curFunc.inputs[i].type.indexOf("]") !== -1
                )
                    values.push(curFunc.inputs[i].value.split(","));
                else values.push(curFunc.inputs[i].value);
            } else values.push("");
        }
        return ethFuncs.sanitizeHex(
            funcSig + ethUtil.solidityCoder.encodeParams(types, values)
        );
    };

    $scope.readData = function(indexFunc, data) {
        if (!data.error) {
            var curFunc = $scope.contract.functions[indexFunc];
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
        return curFunc;
    };

    $scope.$on("ChangeNode", () => {
        $scope.resetLocalToken();
        $scope.resetTokenField();
        coldStakingService.handleInit();
        $scope.handleStake();
    });

    $scope.getCustomTokenSymbol = function(newSymbol) {
        if (!newSymbol) return;
        if (newSymbol.length < 3) return;

        let getNameFunction =
            $scope.contract.functions[$scope.erc20Indexes.DEXNSFunction];

        getNameFunction.inputs[0].value = newSymbol;

        $scope.getTokenInfo(contractAddress, newSymbol);

        // $scope.nodeList[backgroundNodeService.backgroundNode].lib.getEthCall(
        //     {
        //         to: DEXNS.address,
        //         data: $scope.getTxData($scope.erc20Indexes.DEXNSFunction)
        //     },
        //     function(data) {
        //         if (data.error) {
        //             uiFuncs.notifier.danger(
        //                 "Ops, we'd had an error communicating with DexNS."
        //             );
        //             return;
        //         }
        //
        //         var outputs = $scope.readData(
        //             $scope.erc20Indexes.DEXNSFunction,
        //             data
        //         ).outputs;
        //         var contractAddress = outputs[1].value;
        //
        //         if (
        //             contractAddress ===
        //             "0x0000000000000000000000000000000000000000"
        //         ) {
        //             $scope.resetLocalToken();
        //             uiFuncs.notifier.danger("Symbol not found.");
        //             return;
        //         }
        //
        //         // FIXME: if not connected to correct network, info not loaded and correct network not saved
        //
        //         $scope.getTokenInfo(contractAddress, newSymbol);
        //     }
        // );
    };
    $scope.removeTokenFromLocal = function(tokensymbol) {
        globalFuncs.removeTokenFromLocal(
            tokensymbol,
            walletService.wallet.tokenObjs
        );
    };

    $scope.showDisplayOnTrezor = function() {
        return (
            walletService.wallet != null &&
            walletService.wallet.hwType === "trezor"
        );
    };

    $scope.displayOnTrezor = function() {
        TrezorConnect.ethereumGetAddress({
            path: walletService.wallet.path,
            showOnTrezor: true
        });
    };

    $scope.showDisplayOnLedger = function() {
        return (
            walletService.wallet != null &&
            walletService.wallet.hwType === "ledger"
        );
    };

    $scope.displayOnLedger = function() {
        Transport.create()
            .then(transport => {
                const app = new LedgerEth(transport);
                const display = true;

                app.getAddress(walletService.wallet.path, display);
            })
            .catch(console.error);
    };

    /*


    getTokenInfo calls requests for decimals and symbol


    @param: String address. address of contract

    @param: String? symbol. symbol of token



    @returns: void
     */

    $scope.getTokenInfo = function(address, symbol = null) {
        $scope.localToken.contractAdd = address;
        $scope.localToken.type = ajaxReq.type;

        return Promise.all([
            $scope._getTokenDecimals(address),
            $scope._getTokenSymbol(symbol, address)
        ]);
    };
    // call decimals
    $scope._getTokenDecimals = function(address) {
        const request_ = {
            to: address,
            data: $scope.getTxData($scope.erc20Indexes.DECIMALS)
        };

        ajaxReq.getEthCall(request_, function(data) {
            if (data.error || data.data === "0x") {
                $scope.localToken.decimals = "";
                $scope.localToken.network = "";
                uiFuncs.notifier.danger("Error fetching decimals");
                return;
            }

            $scope.localToken.decimals = $scope.readData(
                $scope.erc20Indexes.DECIMALS,
                data
            ).outputs[0].value;
        });
    };
    $scope._getTokenSymbol = function(symbol, address) {
        if (symbol) {
            $scope.localToken.symbol = symbol;
            return;
        }

        const options = {
            to: address,
            data: $scope.getTxData($scope.erc20Indexes.SYMBOL)
        };
        // call for symbol
        ajaxReq.getEthCall(options, function(data) {
            if (!data.error && data.data !== "0x") {
                $scope.localToken.symbol = $scope.readData(
                    $scope.erc20Indexes.SYMBOL,
                    data
                ).outputs[0].value;
            } else {
                $scope.localToken.symbol = "";
                $scope.localToken.network = "";
                uiFuncs.notifier.danger("Error fetching symbol");
            }
        });
    };
};
module.exports = walletBalanceCtrl;
