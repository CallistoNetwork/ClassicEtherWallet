'use strict';
var addressFieldDrtv = function ($compile, backgroundNodeService) {
    return {
        restrict: "E",
        link: function (scope, element, attrs) {
            var varName = attrs.varName;
            var varArr = varName.split('.');
            var placeholder = attrs.placeholder == undefined ? 'mewtopia.eth or 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8' : attrs.placeholder;
            var labelTranslated = attrs.labeltranslated == undefined ? 'SEND_addr' : attrs.labeltranslated;
            var setValue = function (value) {
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
            };

            scope.DexNSInterval = null;

            element.html('<div class=\"col-xs-11\">\n \
                    <label translate=\"' + labelTranslated + '\"></label>\n \
                    <input class=\"form-control\" type=\"text\" placeholder=\"' + placeholder + '\" ng-model=\"addressDrtv.ensAddressField\" ng-disabled=\"addressDrtv.readOnly\" ng-class=\"Validator.isValidENSorEtherAddress(' + varName + ') ? \'is-valid\' : \'is-invalid\'\"/>\n \
                    <p class="ens-response" ng-show="addressDrtv.showDerivedAddress"> ↳ <span class="mono ng-binding"> {{addressDrtv.derivedAddress}} </span> </p>\n \
                </div>\n \
                <div class=\"col-xs-1 address-identicon-container\">\n \
                   <div class=\"addressIdenticon\" title=\"Address Indenticon\" blockie-address=\"{{' + varName + '}}\" watch-var=\"' + varName + '\"></div>\n \
                </div>');
            scope.$watch('addressDrtv.ensAddressField', function () {
                var _ens = new ens();
                if (scope.DexNSInterval) {
                    clearTimeout(scope.DexNSInterval);
                }
                scope.addressDrtv.showDerivedAddress = false;
                if (scope.addressDrtv.ensAddressField === "") {

                    setValue("");
                } else if (scope.addressDrtv.ensAddressField.length == 42 && scope.addressDrtv.ensAddressField[0] == "0" && scope.addressDrtv.ensAddressField[1] == "x") {
                    console.log("GRC!");
                    if (Validator.isValidAddress(scope.addressDrtv.ensAddressField)) {
                        setValue(scope.addressDrtv.ensAddressField);
                        if (!Validator.isChecksumAddress(scope.addressDrtv.ensAddressField)) {
                            scope.notifier.info(globalFuncs.errorMsgs[35]);
                        }
                    }
                } else if (Validator.isValidENSAddress(scope.addressDrtv.ensAddressField)) {
                    _ens.getAddress(scope.addressDrtv.ensAddressField, function (data) {
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

                    scope.DexNSInterval = setTimeout(function () {
                        scope.addressDrtv.derivedAddress = "DexNS is looking for " + scope.addressDrtv.ensAddressField + " Name ...";
                        scope.addressDrtv.showDerivedAddress = true;


                        var DexNSABI = require('../abiDefinitions/etcAbi.json')[5];
                        var DEXNSAddress = DexNSABI.address;
                        DexNSABI = JSON.parse(DexNSABI.abi);


                        var DexNSContract = {
                            functions: [],
                        };
                        for (var i in DexNSABI) {
                            if (DexNSABI[i].type == "function") {
                                DexNSABI[i].inputs.map(function (i) {
                                    i.value = '';
                                });
                                DexNSContract.functions.push(DexNSABI[i]);
                            }
                        }
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


                        nodes.nodeList[backgroundNodeService.backgroundNode].lib.getEthCall({
                            to: DEXNSAddress,
                            data: DexNSData
                        }, function (data) {
                            var outTypes = curFunc.outputs.map(function (i) {
                                return i.type;
                            });
                            data.data = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''))[0];
                            if (data.error) uiFuncs.notifier.danger(data.msg);
                                else if (data.data === '0x0000000000000000000000000000000000000000' || data.data === '0x') {
                                setValue('null');
                                scope.addressDrtv.derivedAddress = '    ⊘ ERROR: DexNS Name is not found!';
                                scope.addressDrtv.showDerivedAddress = true;
                            } else {
                                setValue(data.data);
                                // found dexns registed name, set address, and symbol and decimals will be called.
                                scope.addressDrtv.ensAddressField = ethUtil.toChecksumAddress(data.data);

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
