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

            function lookupName(_val) {


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
            }


            scope.$watch('addressDrtv.ensAddressField', lookupName);

            scope.$on('lookupName', (event, val) => lookupName(val));


            $compile(element.contents())(scope);
        }
    };
};
module.exports = addressFieldDrtv;
