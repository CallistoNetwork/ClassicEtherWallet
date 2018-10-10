"use strict";

const Transport = require("@ledgerhq/hw-transport-u2f").default;

const LedgerEth = require("@ledgerhq/hw-app-eth").default;

const erc20Abi = require("../abiDefinitions/erc20abi.json");

var walletBalanceCtrl = function(
    $scope,
    $sce,
    walletService,
    backgroundNodeService,
    modalService,
    coldStakingService,
    messageService
) {
    $scope.messageService = messageService;

    $scope.tokenVisibility = "shown";

    $scope.modalService = modalService;
    $scope.coldStakingService = coldStakingService;

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
    $scope.customTokenSymbol = "";

    $scope.customTokenField = false;

    $scope.$on("ChangeWallet", () => {
        coldStakingService.contract.initStakerInfo();

        if (coldStakingService.validNetwork()) {
            coldStakingService.staker_info();
        }
    });

    /*


        This function is used to estimate gas of cliam and claim_and_withrdaw from
        cold staking service.
     */

    $scope.refreshBalances = function() {
        walletService.wallet.setBalance();
        coldStakingService.contract.initStakerInfo();
        if (coldStakingService.validNetwork()) {
            coldStakingService.staker_info();
        }
    };

    $scope.estimateGas_ = function(name = "claim_and_withdraw") {
        const tx = {
            from: walletService.wallet.getAddressString()
        };

        ethFuncs
            .estGasContract(name, coldStakingService.contract, tx)
            .then(data => {
                Object.assign(coldStakingService.tx, data);
            })
            .catch(err => {
                uiFuncs.notifier.danger((err && err.msg) || err);
            })
            .finally(() => {
                if (name === "claim_and_withdraw") {
                    modalService.openWithdrawModal.open();
                } else if (name === "claim") {
                    modalService.openClaimRewardModal.open();
                }
            });
    };

    $scope.handleOpenWithdraw = function() {
        $scope.estimateGas_("claim_and_withdraw");
    };

    $scope.handleOpenClaim = function() {
        $scope.estimateGas_("claim");
    };

    $scope.resetTokenField = function() {
        $scope.customTokenField = false;
        $scope.customTokenDexNSField = false;
        $scope.customTokenSymbol = "";
    };

    $scope.saveTokenToLocal = function() {
        globalFuncs.saveTokenToLocal($scope.localToken, function(data) {
            if (!data.error) {
                $scope.resetLocalToken();
                walletService.wallet.setTokens();
                $scope.validateLocalToken = $sce.trustAsHtml("");

                $scope.resetTokenField();

                $scope.resetLocalToken();
            } else {
                $scope.notifier.danger(data.msg);
            }
        });
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

    $scope.$on("ChangeNode", function() {
        $scope.resetLocalToken();
        $scope.resetTokenField();
    });
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

        const request_ = {
            to: address,
            data: $scope.getTxData($scope.erc20Indexes.DECIMALS)
        };

        // call decimals

        Promise.all([
            ajaxReq.getEthCall(request_, function(data) {
                if (data.error || data.data === "0x") {
                    $scope.localToken.decimals = "";
                    $scope.localToken.network = "";
                    $scope.notifier.danger("Error fetching decimals");
                    return;
                }

                $scope.localToken.decimals = $scope.readData(
                    $scope.erc20Indexes.DECIMALS,
                    data
                ).outputs[0].value;
            }),
            () => {
                if (symbol) {
                    $scope.localToken.symbol = symbol;
                    return;
                }
                const request_symbol = Object.assign({}, request_, {
                    data: $scope.getTxData($scope.erc20Indexes.SYMBOL)
                });

                // call for symbol
                ajaxReq.getEthCall(request_symbol, function(data) {
                    if (!data.error && data.data !== "0x") {
                        $scope.localToken.symbol = $scope.readData(
                            $scope.erc20Indexes.SYMBOL,
                            data
                        ).outputs[0].value;
                    } else {
                        $scope.localToken.symbol = "";
                        $scope.localToken.network = "";
                        $scope.notifier.danger("Error fetching symbol");
                    }
                });
            }
        ]);
    };
};
module.exports = walletBalanceCtrl;
