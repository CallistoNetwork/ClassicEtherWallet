'use strict';


var arrayInputDrtv = function () {


    function defaultVal(type = 'string') {


        // if (type.includes('string')) {
        //
        //     return '';
        // } else if (type.includes('uint')) {
        //
        //     return 0;
        // } else if (type.includes('bool')) {
        //
        //     return false;
        // }

        return '';
    }


    return {
        restrict: "E",


        template: `<div>
                    
                    
                    <div class="row">
                     <label> {{input.name}} <small> {{input.type}} </small> </label>
                    </div>
                        <div class="row">
                            <div class="col-xs-10">
                            
                                <div ng-switch on="input.type_">
                                    <div class="item write-address" ng-switch-when="address">
                                    <div class="row">
                                      <div class="col-xs-11"><input class="form-control" type="text" placeholder="0x314156..."
                                                                    ng-model="input.displayInput"
                                                                    ng-class="Validator.isValidAddress(input.displayInput) ? 'is-valid' : 'is-invalid'"/></div>
                                      <div class="col-xs-1"><div class="addressIdenticon med" title="Address Indenticon"
                                                                 blockie-address="{{input.displayInput}}" watch-var="input.displayInput"></div></div>
                                    </div>
                                    </div>
                                    <p class="item write-unit256" ng-switch-when="uint256">
                                      <input class="form-control" type="text" placeholder="151" ng-model="input.displayInput"
                                             ng-class="Validator.isPositiveNumber(input.displayInput) ? 'is-valid' : 'is-invalid'"/>
                                    </p>
                                    <p class="item write-string" ng-switch-when="string">
                                      <input class="form-control" type="text" placeholder="Ohh! Shiny!" ng-model="input.displayInput"
                                             ng-class="input.displayInput!='' ? 'is-valid' : 'is-invalid'"/>
                                    </p>
                                    <p class="item write-bytes" ng-switch-when="bytes">
                                      <input class="form-control" type="text" placeholder="0x151bc..." ng-model="input.displayInput"
                                             ng-class="Validator.isValidHex(input.displayInput) ? 'is-valid' : 'is-invalid'"/>
                                    </p>
                                    <p class="item write-boolean" ng-switch-when="bool">
                                      <span class="radio"><label><input ng-model="input.displayInput" type="radio" name="optradio-{{input.name}}"
                                                                        ng-value="true">True</label></span>
                                      <span class="radio"><label><input ng-model="input.displayInput" type="radio" name="optradio-{{input.name}}"
                                                                        ng-value="false">False</label></span>
                                    </p>
                                    <p class="item" ng-switch-default>
                                      <input class="form-control" type="text" placeholder="" ng-model="input.displayInput"
                                             ng-class="input.displayInput!='' ? 'is-valid' : 'is-invalid'"/>
                                    </p>
                                </div>
                                                    
                            </div>
                            <div class="col-xs-2 text-center">
                                <input type="number" class="form-control" min="{{input.minimum}}" step="1" ng-model="input.activeInput"/>
                            </div>
                        </div>
                          <div class="row">
                              <div ng-repeat="(idx, input_) in inputs track by $index">
                    
                                  <div class="row">
                                      <div class="col-xs-2">
                                         ↳ [ {{idx}} ]
                                      </div>
                                      <div class="col-xs-8">
                                      
                                        
                                          <input type="text" class="form-control" ng-model="input_.text" readonly tabindex="-1" />
                                      </div>
                                      <div class="col-xs-2" >
                                        <button class="btn btn-danger" ng-click="deleteInput(idx)" translate="DELETE">
                                     
                                        </button>
                                  </div>
                              </div>
                          </div>
                </div>`,


        link: function ($scope, element, attr) {


            const {type, name} = attr;

            const type_ = type.replace('[]', '');

            $scope.inputs = [
                {
                    text: defaultVal(type_),
                }
            ];

            $scope.input = {
                displayInput: $scope.inputs[0].text,
                minimum: 0,
                activeInput: 0,
                name,
                type,
                type_,
            };


            $scope.deleteInput = function deleteInput(number) {

                $scope.inputs = $scope.inputs.filter((input, idx) => idx !== number);

                if ($scope.inputs.length <= $scope.input.activeInput) {

                    $scope.input.activeInput = $scope.inputs.length - 1;
                }

                $scope.input.activeInput = Math.max($scope.inputs.length - 1, 0);


                if (!$scope.inputs.length) {

                    $scope.inputs = [
                        {
                            text: defaultVal(type_),
                        }
                    ];

                    $scope.input.displayInput = $scope.inputs[0].text;

                }

            };


            $scope.$watch('input.activeInput', function (value) {


                let value_ = Number(value);

                while ($scope.inputs.length <= value_) {

                    $scope.inputs.push({text: defaultVal(type_)});

                    value_--;

                }

                $scope.input.displayInput = $scope.inputs[$scope.input.activeInput].text;
            });

            $scope.$watch('input.displayInput', function (newVal) {


                $scope.inputs[$scope.input.activeInput].text = newVal;

                // I am filtering values in contractsCtrl when gathering Data


                $scope.$parent.input.value = $scope.inputs.map(item => item.text);
            });


        }
    }


}


module.exports = arrayInputDrtv;
