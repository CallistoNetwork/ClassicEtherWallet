'use strict';
var addressFieldDrtv = function($compile) {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            var varName = attrs.varName;
            var varArr = varName.split('.');
            var placeholder = attrs.placeholder == undefined ? 'mewtopia.eth or 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8' : attrs.placeholder ;
            var labelTranslated = attrs.labeltranslated == undefined ? 'SEND_addr' : attrs.labeltranslated;
            var setValue = function(value) {
                var temp = scope;
                for (var i in varArr) {
                    if (i == varArr.length - 1) temp[varArr[i]] = value;
                    else {
                        temp = temp[varArr[i]];
                    }
                }
            }
            scope.addressDrtv = {
                showDerivedAddress: false,
                ensAddressField: globalFuncs.urlGet('to') == null ? "" : globalFuncs.urlGet('to'),
                derivedAddress: '',
                readOnly: false
            }
            scope.DexNSInterval = null;

            element.html('<div class=\"col-xs-11\">\n \
                    <label translate=\"' + labelTranslated + '\"></label>\n \
                    <input class=\"form-control\" type=\"text\" placeholder=\"' + placeholder + '\" ng-model=\"addressDrtv.ensAddressField\" ng-disabled=\"addressDrtv.readOnly\" ng-class=\"Validator.isValidENSorEtherAddress(' + varName + ') ? \'is-valid\' : \'is-invalid\'\"/>\n \
                    <p class="ens-response" ng-show="addressDrtv.showDerivedAddress"> ↳ <span class="mono ng-binding"> {{addressDrtv.derivedAddress}} </span> </p>\n \
                </div>\n \
                <div class=\"col-xs-1 address-identicon-container\">\n \
                   <div class=\"addressIdenticon\" title=\"Address Indenticon\" blockie-address=\"{{' + varName + '}}\" watch-var=\"' + varName + '\"></div>\n \
                </div>');
            scope.$watch('addressDrtv.ensAddressField', function() {
                var _ens = new ens();
                    if (scope.DexNSInterval) {
                        clearTimeout(scope.DexNSInterval);
                    }
                scope.addressDrtv.showDerivedAddress = false;
                if(scope.addressDrtv.ensAddressField.length == 42 && scope.addressDrtv.ensAddressField[0] == "0" && scope.addressDrtv.ensAddressField[1] == "x") {
                    console.log("GRC!");
                	if (Validator.isValidAddress(scope.addressDrtv.ensAddressField)) {
                    	setValue(scope.addressDrtv.ensAddressField);
                    	if (!Validator.isChecksumAddress(scope.addressDrtv.ensAddressField)) {
                        	scope.notifier.info(globalFuncs.errorMsgs[35]);
                    	}
                	}
                } else if (Validator.isValidENSAddress(scope.addressDrtv.ensAddressField)) {
                    _ens.getAddress(scope.addressDrtv.ensAddressField, function(data) {
                        if (data.error) uiFuncs.notifier.danger(data.msg);
                        else if (data.data == '0x0000000000000000000000000000000000000000' || data.data == '0x') {
                            setValue('0x0000000000000000000000000000000000000000');
                            scope.addressDrtv.derivedAddress = '0x0000000000000000000000000000000000000000';
                            scope.addressDrtv.showDerivedAddress = true;
                        } else {
                            setValue(data.data);
                            scope.addressDrtv.derivedAddress = ethUtil.toChecksumAddress(data.data);
                            scope.addressDrtv.showDerivedAddress = true;
                        }
                    });
                } else if (scope.addressDrtv.ensAddressField != "" && !(scope.addressDrtv.ensAddressField == 42 && scope.addressDrtv.ensAddressField[0] == "0" && scope.addressDrtv.ensAddressField[1] == "x")) {
                    //setValue('');
                    //scope.addressDrtv.showDerivedAddress = false;

                    // Consider it's DEXNS name.
                    if (scope.DexNSInterval) {
                        clearTimeout(scope.DexNSInterval);
                    }

                    scope.DexNSInterval = setTimeout(function() {
                        scope.addressDrtv.derivedAddress = "DexNS is looking for " + scope.addressDrtv.ensAddressField + " Name ...";
                        scope.addressDrtv.showDerivedAddress = true;

                        var DEXNSnetwork = 'ETC'; // DexNS network is always ETC!
                        /*var DexNSABI = {
                        "name": "DexNS State storage",
                        "address": "0x28fc417c046d409c14456cec0fc6f9cde46cc9f3",
                        "abi": '[{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"name_assignation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"unassignName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_address","type":"address"}],"name":"updateName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"name_assignation","outputs":[{"name":"_assignee","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_value","type":"string"}],"name":"appendNameMetadata","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"assignName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_value","type":"string"}],"name":"updateName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_addr","type":"address"},{"name":"_value","type":"string"}],"name":"updateName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"change_Owner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_assignee","type":"address"}],"name":"assignation","outputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_name","type":"string"}],"name":"registerName","outputs":[{"name":"_ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_owner","type":"address"},{"name":"_destination","type":"address"},{"name":"_metadata","type":"string"},{"name":"_hideOwner","type":"bool"}],"name":"registerAndUpdateName","outputs":[{"name":"_ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_hide","type":"bool"}],"name":"hideNameOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"name","outputs":[{"name":"_hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"frontend_contract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getName","outputs":[{"name":"_owner","type":"address"},{"name":"_associatedAddress","type":"address"},{"name":"_value","type":"string"},{"name":"_signature","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"ownerOf","outputs":[{"name":"_owner","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_newOwner","type":"address"}],"name":"changeNameOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"signatureOf","outputs":[{"name":"_sig","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"addressOf","outputs":[{"name":"_addr","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"metadataOf","outputs":[{"name":"_value","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"resolution","outputs":[{"name":"owner","type":"address"},{"name":"addr","type":"address"},{"name":"metadata","type":"string"},{"name":"hideOwner","type":"bool"},{"name":"signature","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newFrontEnd","type":"address"}],"name":"change_FrontEnd_Address","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"bytes32"}],"name":"Error","type":"event"}]'
                    };*/

                    var DexNSABI = require('../abiDefinitions/etcAbi.json')[5];
                    var DEXNSAddress = DexNSABI.address;
                    DexNSABI = JSON.parse(DexNSABI.abi);
                    var DexNSNode = new nodes.customNode('https://mewapi.epool.io', '');

                    // TODO

                    var DexNSContract = {
                        functions: [],
                    };
                    for (var i in DexNSABI) {
                        if (DexNSABI[i].type == "function") {
                            DexNSABI[i].inputs.map(function(i) { i.value = ''; });
                            DexNSContract.functions.push(DexNSABI[i]);
                        }
                    }
                    //console.log(DexNSContract.functions[20]);
                    var curFunc = DexNSContract.functions[19];
                    var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
                    var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
                    var typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
                    var types = typeName.split(',');
                    types = types[0] == "" ? [] : types;
                    var values = [];
                    curFunc.inputs[0].value = scope.addressDrtv.ensAddressField;
                    for (var i in curFunc.inputs) {
                        if (curFunc.inputs[i].value) {
                            if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));
                            else values.push(curFunc.inputs[i].value);
                        } else values.push('');
                    }
                    var DexNSData = '0x' + funcSig + ethUtil.solidityCoder.encodeParams(types, values);



                    DexNSNode.getEthCall({ to: DEXNSAddress, data: DexNSData }, function(data) {
                        var outTypes = curFunc.outputs.map(function(i) {
                            return i.type;
                        });
                        data.data = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''))[0];
                        if (data.error) uiFuncs.notifier.danger(data.msg);
                        else if (data.data == '0x0000000000000000000000000000000000000000' || data.data == '0x') {
                            setValue('null');
                            scope.addressDrtv.derivedAddress = '    ⊘ ERROR: DexNS Name is not found!';
                            scope.addressDrtv.showDerivedAddress = true;
                        } else {
                            setValue(data.data);
                            scope.addressDrtv.derivedAddress = ethUtil.toChecksumAddress(data.data);
                            scope.addressDrtv.showDerivedAddress = true;
                        }
                    });
                }, 1200);
                }
            });
            $compile(element.contents())(scope);
        }
    };
};
module.exports = addressFieldDrtv;
