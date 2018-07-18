'use strict';
var addressFieldDrtv = function ($compile, backgroundNodeService, lookupService) {
    return {
        restrict: "E",
        template: require('./addressFieldDrtv.html'),
        link: function (scope, element, attrs) {
            var varName = attrs.varName;


            var varArr = varName.split('.');
            var placeholder = attrs.placeholder || 'mewtopia.eth or 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8';
            var labelTranslated = attrs.labeltranslated || 'SEND_addr';

            scope.varName = varName;
            scope.placeholder = placeholder;
            scope.labelTranslated = labelTranslated;


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
                ensAddressField: globalFuncs.urlGet('to', ''),
                derivedAddress: '',
                readOnly: false,
                NAME: '',
            };


            scope.$watch('addressDrtv.ensAddressField', function (_val) {


                if (lookupService.service !== 'none' && _val && !Validator.isValidAddress(_val)) {


                    lookupService.lookup(_val).then(result => {


                        scope.$apply(function () {

                            if (!(['0x0000000000000000000000000000000000000000', '0x'].includes(result))) {


                                setValue(result);

                                // scope.addressDrtv.ensAddressField = result;

                                scope.addressDrtv.NAME = _val;

                                scope.addressDrtv.ensAddressField = ethUtil.toChecksumAddress(result);

                                scope.addressDrtv.derivedAddress = result;
                                scope.addressDrtv.showDerivedAddress = true;
                            } else {

                                scope.addressDrtv.derivedAddress = `    ⊘ ERROR: ${lookupService.service} name is not found!`;
                                scope.addressDrtv.showDerivedAddress = true;
                            }
                        })
                    })
                }
                // var _ens = new ens();
                // if (scope.DexNSInterval) {
                //     clearTimeout(scope.DexNSInterval);
                // }
                // scope.addressDrtv.showDerivedAddress = false;
                // if (scope.addressDrtv.ensAddressField === "") {
                //
                //     setValue("");
                // } else if (scope.addressDrtv.ensAddressField.length == 42 && scope.addressDrtv.ensAddressField[0] == "0" && scope.addressDrtv.ensAddressField[1] == "x") {
                //     console.log("GRC!");
                //     if (Validator.isValidAddress(scope.addressDrtv.ensAddressField)) {
                //         setValue(scope.addressDrtv.ensAddressField);
                //         if (!Validator.isChecksumAddress(scope.addressDrtv.ensAddressField)) {
                //             scope.notifier.info(globalFuncs.errorMsgs[35]);
                //         }
                //     }
                // } else if (Validator.isValidENSAddress(scope.addressDrtv.ensAddressField)) {
                //     _ens.getAddress(scope.addressDrtv.ensAddressField, function (data) {
                //         if (data.error) uiFuncs.notifier.danger(data.msg);
                //         else if (data.data == '0x0000000000000000000000000000000000000000' || data.data == '0x') {
                //             setValue('0x0000000000000000000000000000000000000000');
                //             scope.addressDrtv.derivedAddress = '0x0000000000000000000000000000000000000000';
                //             scope.addressDrtv.showDerivedAddress = true;
                //         } else {
                //             setValue(data.data);
                //             scope.addressDrtv.derivedAddress = ethUtil.toChecksumAddress(data.data);
                //             scope.addressDrtv.showDerivedAddress = true;
                //         }
                //     });
                // } else if (scope.addressDrtv.ensAddressField != "" && !(scope.addressDrtv.ensAddressField == 42 && scope.addressDrtv.ensAddressField[0] == "0" && scope.addressDrtv.ensAddressField[1] == "x")) {
                //     //setValue('');
                //     //scope.addressDrtv.showDerivedAddress = false;
                //
                //     // Consider it's DEXNS name.
                //     if (scope.DexNSInterval) {
                //         clearTimeout(scope.DexNSInterval);
                //     }
                //
                //     scope.DexNSInterval = setTimeout(function () {
                //         scope.addressDrtv.derivedAddress = "DexNS is looking for " + scope.addressDrtv.ensAddressField + " Name ...";
                //         scope.addressDrtv.showDerivedAddress = true;
                //
                //
                //         var DexNSABI = require('../abiDefinitions/etcAbi.json')[5];
                //         var DEXNSAddress = DexNSABI.address;
                //         DexNSABI = JSON.parse(DexNSABI.abi);
                //
                //
                //         var DexNSContract = {
                //             functions: [],
                //         };
                //         for (var i in DexNSABI) {
                //             if (DexNSABI[i].type == "function") {
                //                 DexNSABI[i].inputs.map(function (i) {
                //                     i.value = '';
                //                 });
                //                 DexNSContract.functions.push(DexNSABI[i]);
                //             }
                //         }
                //         var curFunc = DexNSContract.functions[19];
                //         var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
                //         var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
                //         var typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
                //         var types = typeName.split(',');
                //         types = types[0] == "" ? [] : types;
                //         var values = [];
                //         curFunc.inputs[0].value = scope.addressDrtv.ensAddressField;
                //         for (var i in curFunc.inputs) {
                //             if (curFunc.inputs[i].value) {
                //                 if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));
                //                 else values.push(curFunc.inputs[i].value);
                //             } else values.push('');
                //         }
                //         var DexNSData = '0x' + funcSig + ethUtil.solidityCoder.encodeParams(types, values);
                //
                //
                //         nodes.nodeList[backgroundNodeService.backgroundNode].lib.getEthCall({
                //             to: DEXNSAddress,
                //             data: DexNSData
                //         }, function (data) {
                //             var outTypes = curFunc.outputs.map(function (i) {
                //                 return i.type;
                //             });
                //             data.data = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''))[0];
                //             if (data.error) uiFuncs.notifier.danger(data.msg);
                //                 else if (data.data === '0x0000000000000000000000000000000000000000' || data.data === '0x') {
                //                 setValue('null');
                //                 scope.addressDrtv.derivedAddress = '    ⊘ ERROR: DexNS Name is not found!';
                //                 scope.addressDrtv.showDerivedAddress = true;
                //             } else {
                //                 setValue(data.data);
                //                 // found dexns registed name, set address, and symbol and decimals will be called.
                //                 scope.addressDrtv.ensAddressField = ethUtil.toChecksumAddress(data.data);
                //
                //                 scope.addressDrtv.derivedAddress = ethUtil.toChecksumAddress(data.data);
                //                 scope.addressDrtv.showDerivedAddress = true;
                //             }
                //         });
                //     }, 1200);
                // }
            });
            $compile(element.contents())(scope);
        }
    };
};
module.exports = addressFieldDrtv;
