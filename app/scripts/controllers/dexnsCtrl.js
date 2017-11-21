'use strict';
var dexnsCtrl = function($scope, $sce, $rootScope, walletService) {
    $scope.ajaxReq = ajaxReq;
    $scope.hideEnsInfoPanel = false;
    $scope.networks = {
         ETH: "eth_ethscan",
         ETC: "etc_epool",
         UBQ: "ubq",
         EXP: "exp",
    }

    $scope.tx = {
        gasLimit: '200000',
        data: '',
        to: '',
        unit: "ether",
        value: 0,
        gasPrice: null
    };

    walletService.wallet = null;

    var network = globalFuncs.urlGet('network') == null ? "" : globalFuncs.urlGet('network');
    if (network) {
       $rootScope.$broadcast('ChangeNode', $scope.networks[network.toUpperCase()] || 0);
    }

    $scope.priceDEXNS = "LOADING...";
    $scope.DexNSName;
    $scope.dexnsConfirmModalModal = new Modal(document.getElementById('dexnsConfirmModal'));

    $scope.dexns_status = 0;

    // TODO replace with enum
    /* 0 -> nothing
    *  1 -> user
    *  2 -> token
    *  3 -> contract
    *  4 -> update Name
    *  5 -> access Name content
    *  6 -> step 2 register Name
    *  7 -> confirmation
    */


    var DEXNSnetwork = 'ETC'; // DexNS network is always ETC!
    var DexNSFrontendABI = require('../abiDefinitions/etcAbi.json')[4];
    var DexNSABI = require('../abiDefinitions/etcAbi.json')[5];
    var DEXNSFrontendAddress = DexNSFrontendABI.address;
    var DEXNSAddress = DexNSABI.address;
    var namePrice;

    DexNSABI = JSON.parse(DexNSABI.abi);
    DexNSFrontendABI = JSON.parse(DexNSFrontendABI.abi);
                    //console.log(DexNSABI);
    var DexNSNode = new nodes.customNode('https://mewapi.epool.io', '');

                    // TODO
    $scope.$watch(function() {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function() {
        if (walletService.wallet == null) return;
        $scope.wallet = walletService.wallet;
        $scope.wd = true;
        $scope.wallet.setBalance();
        $scope.wallet.setTokens();
    });

    var DexNSContract = {
            functions: [],
        };

    var DexNSFrontendContract = {
            functions: [],
        };
    for (var i in DexNSABI) {
        if (DexNSFrontendABI[i].type == "function") {
            DexNSFrontendABI[i].inputs.map(function(i) { i.value = ''; });
            DexNSFrontendContract.functions.push(DexNSFrontendABI[i]);
            }
        }
    for (var i in DexNSABI) {
        if (DexNSFrontendABI[i].type == "function") {
            DexNSFrontendABI[i].inputs.map(function(i) { i.value = ''; });
            DexNSFrontendContract.functions.push(DexNSFrontendABI[i]);
            }
        }

    //    console.log(DexNSABI[18]); << endtimeOf

    var namePriceFunc = DexNSFrontendContract.functions[22];
    var fullPriceFuncName = ethUtil.solidityUtils.transformToFullName(namePriceFunc);
    var priceSig = ethFuncs.getFunctionSignature(fullPriceFuncName);

    $scope.getDexNSPrice = function() {
        DexNSNode.getEthCall({ to: DEXNSAddress, data: '0x' + priceSig }, function(data) {
            var outTypes = namePriceFunc.outputs.map(function(i) {
                 return i.type;
            });
            data.data = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''))[0];
            if (data.error) uiFuncs.notifier.danger(data.msg);
            else {
                namePrice = data.data;
                $scope.priceDEXNS = (etherUnits.toEther(data.data, 'wei')) + " ETC";
            }
        });
    }

    $scope.openRegisterName = function() {
        $scope.dexns_status = 1; // 1 -> user
    }

    $scope.checkDexNSName = function() {

        var checkFunc = DexNSFrontendContract.functions[18];
        var fullcheckFunc = ethUtil.solidityUtils.transformToFullName(checkFunc);
        var checkSig = ethFuncs.getFunctionSignature(fullcheckFunc);
        var _typeName = ethUtil.solidityUtils.extractTypeName(fullcheckFunc);

                    var types = _typeName.split(',');
                    types = types[0] == "" ? [] : types;
                    var values = [];
                    checkFunc.inputs[0].value = $scope.DexNSName;
                    for (var i in checkFunc.inputs) {
                        if (checkFunc.inputs[i].value) {
                            if (checkFunc.inputs[i].type.indexOf('[') !== -1 && checkFunc.inputs[i].type.indexOf(']') !== -1) values.push(checkFunc.inputs[i].value.split(','));
                            else values.push(checkFunc.inputs[i].value);
                        } else values.push('');
                    }

        var _DexNSData = '0x' + checkSig + ethUtil.solidityCoder.encodeParams(types, values);

        DexNSNode.getEthCall({ to: DEXNSFrontendAddress, data: _DexNSData }, function(data) {
        var outTypes = checkFunc.outputs.map(function(i) {
                return i.type;
            });
                
                data.data = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''))[0];
                if (data.error) uiFuncs.notifier.danger(data.msg);
                else {
                    var _time = new Date().getTime();
                    //console.log("NOW: " + _time);

                    //console.log(data.data);
                    //console.log(data.data.toString());
                    var _renderedTime = new BigNumber(_time);
                    //console.log(_renderedTime);
                    //console.log(data.data);

                    if(ajaxReq.type!="ETC") {
                        $scope.notifier.danger("DexNS accepts only $ETC as gas payments! You should switch to ETC node first to register your name.");
                    }
                    else if(_renderedTime > data.data) {
                        //console.log("SUCCESS");
                        $scope.dexns_status = 6;
                        //console.log($scope.dexns_status);
                        $scope.notifier.info("This name is available for registration.");
                    }
                    else {
                        $scope.notifier.danger("This name is already registered! You should try to register another name.");
                    }
            }
        });
    }

    $scope.registerDexNSName = function() {

        if($scope.wallet==undefined) {
            $scope.notifier.danger("Unlock your wallet first!");
        } else {
            ajaxReq.getTransactionData($scope.wallet.getAddressString(), function(data) {
                if (data.error) $scope.notifier.danger(data.msg);
                data = data.data;

                var func = DexNSFrontendContract.functions[1];
                var fullFunc = ethUtil.solidityUtils.transformToFullName(func);
                var funcSig = ethFuncs.getFunctionSignature(fullFunc);
                var _typeName = ethUtil.solidityUtils.extractTypeName(fullFunc);

                $scope.tx.gasLimit = 200000;
                $scope.tx.gasPrice = data.gasprice;
                $scope.tx.to = DEXNSFrontendAddress;
                $scope.tx.value = namePrice;
                $scope.tx.nonce = data.nonce;

                var types = _typeName.split(',');
                types = types[0] == "" ? [] : types;
                var values = [];
                func.inputs[0].value = $scope.DexNSName;
                values.push(func.inputs[0].value);

                $scope.tx.data = '0x' + funcSig + ethUtil.solidityCoder.encodeParams(types, values);
                console.log($scope.tx.data);

                var txData = uiFuncs.getTxData($scope);
                txData.gasPrice = data.gasprice;
                txData.nonce = data.nonce;
                console.log(txData.nonce);
                console.log(txData.gasPrice);
                console.log(txData.to);
                console.log(txData.value);
                console.log(txData.data);

                uiFuncs.generateTx(txData, function(rawTx) {
                   if (!rawTx.isError) {
                        $scope.generatedDexNSTxs = [];
                        $scope.generatedDexNSTxs.push(rawTx.signedTx);
                        $scope.dexns_status = 7;
                        $scope.dexnsConfirmModalModal.open();
                    } else {
                        $scope.notifier.danger(rawTx.error);
                    }
                });
            });
        }
        //$scope.dexns_status = 7;
        //$scope.dexnsConfirmModalModal.open();
    }

    $scope.sendTxStatus = "";
    $scope.sendTx = function() {
        $scope.dexnsConfirmModalModal.close();
        var signedTx = $scope.generatedDexNSTxs.shift();
        console.log("SIGNED " + signedTx);
        uiFuncs.sendTx(signedTx, function(resp) {
            if (!resp.isError) {
                var linkStatus = "http://gastracker.io/tx/" + resp.data;
                console.log(linkStatus);
                $scope.sendTxStatus = globalFuncs.successMsgs[2] + '<a target="_self" href="{{linkStatus}}" target="_blank"> ' + resp.data + ' </a>';
                console.log("http://gastracker.io/tx/" + resp.data + "#");
                $scope.notifier.info($scope.sendTxStatus, 0);
                if ($scope.generatedDexNSTxs.length) $scope.sendTx();
                else $scope.sendTxStatus = ''
            } else {
                $scope.notifier.danger(resp.error);
            }
        });
    }

    $scope.getDexNSPrice();

    $scope.toTimestamp = function(date) {
        var dateSplitted = date.split('-'); // date must be in DD-MM-YYYY format
        var formattedDate = dateSplitted[1]+'/'+dateSplitted[0]+'/'+dateSplitted[2];
        return new Date(formattedDate).getTime();
  }
}

module.exports = dexnsCtrl;