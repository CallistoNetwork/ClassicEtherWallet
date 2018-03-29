'use strict';


var arrayInputDrtv = function () {


    function defaultVal(type = 'string') {


        if (type.includes('string')) {

            return '';
        } else if (type.includes('uint')) {

            return 0;
        } else if (type.includes('bool')) {

            return false;
        }

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
                            
                            <!-- 
                            
                            having trouble updating displayInput 
                                 watch is not firing
                            
                            --> 
                            
                                <!--<div ng-switch on="type_">-->
                                    <!--<div class="item write-address" ng-switch-when="address">-->
                                    <!--<label> {{input.name}} <small> {{type_}} </small> </label>-->
                                    <!--<div class="row">-->
                                      <!--<div class="col-xs-11"><input class="form-control" type="text" placeholder="0x314156..."-->
                                                                    <!--ng-model="displayInput"-->
                                                                    <!--ng-change="show($event)"-->
                                                                    <!--ng-class="Validator.isValidAddress(displayInput) ? 'is-valid' : 'is-invalid'"/></div>-->
                                      <!--<div class="col-xs-1"><div class="addressIdenticon med" title="Address Indenticon"-->
                                                                 <!--blockie-address="{{displayInput}}" watch-var="displayInput"></div></div>-->
                                    <!--</div>-->
                                    <!--</div>-->
                                    <!--<p class="item write-unit256" ng-switch-when="uint256">-->
                                      <!--<label> {{input.name}} <small> {{type_}} </small> </label>-->
                                      <!--<input class="form-control" type="text" placeholder="151" ng-model="displayInput"-->
                                             <!--ng-class="Validator.isPositiveNumber(displayInput) ? 'is-valid' : 'is-invalid'"/>-->
                                    <!--</p>-->
                                    <!--<p class="item write-string" ng-switch-when="string">-->
                                      <!--<label> {{input.name}} <small> {{type_}} </small> </label>-->
                                      <!--<input class="form-control" type="text" placeholder="Ohh! Shiny!" ng-model="displayInput"-->
                                             <!--ng-class="displayInput!='' ? 'is-valid' : 'is-invalid'"/>-->
                                    <!--</p>-->
                                    <!--<p class="item write-bytes" ng-switch-when="bytes">-->
                                      <!--<label> {{input.name}} <small> {{type_}} </small> </label>-->
                                      <!--<input class="form-control" type="text" placeholder="0x151bc..." ng-model="displayInput"-->
                                             <!--ng-class="Validator.isValidHex(displayInput) ? 'is-valid' : 'is-invalid'"/>-->
                                    <!--</p>-->
                                    <!--<p class="item write-boolean" ng-switch-when="bool">-->
                                      <!--<label> {{input.name}} <small> {{type_}} </small> </label>-->
                                      <!--<span class="radio"><label><input ng-model="displayInput" type="radio" name="optradio-{{input.name}}"-->
                                                                        <!--ng-value="true">True</label></span>-->
                                      <!--<span class="radio"><label><input ng-model="displayInput" type="radio" name="optradio-{{input.name}}"-->
                                                                        <!--ng-value="false">False</label></span>-->
                                    <!--</p>-->
                                    <!--<p class="item" ng-switch-default>-->
                                      <!--<label> {{input.name}} <small> {{type_}} </small> </label>-->
                                      <!--<input class="form-control" type="text" placeholder="" ng-model="displayInput"-->
                                             <!--ng-class="displayInput!='' ? 'is-valid' : 'is-invalid'"/>-->
                                    <!--</p>-->
                                <!--</div>-->
                                                    
                                <input type="text" class="form-control" ng-model="displayInput" />
                            </div>
                            <div class="col-xs-2 text-center">
                                <input type="number" class="form-control" min="{{minimum}}" step="1" ng-model="activeInput"/>
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

            // TODO: validate fields

            const {type} = attr;

            const type_ = type.replace('[]', '');

            $scope.type = type;

            $scope.type_ = type_;

            $scope.inputs = [
                {
                    text: defaultVal(type_),
                }
            ];

            $scope.minimum = 0;


            $scope.activeInput = 0;


            $scope.updateInputs = function updateInputs(value) {


                while ($scope.inputs.length <= value) {

                    $scope.inputs.push({text: defaultVal(type_)});

                    value--;


                }
            };

            $scope.deleteInput = function deleteInput(number) {

                $scope.inputs = $scope.inputs.filter((input, idx) => idx !== number);

                if ($scope.inputs.length <= $scope.activeInput) {

                    $scope.activeInput = $scope.inputs.length - 1;
                }

                $scope.activeInput = Math.max($scope.inputs.length - 1, 0);


                if (!$scope.inputs.length) {

                    $scope.inputs = [
                        {
                            text: defaultVal(type_),
                        }
                    ];

                    $scope.displayInput = $scope.inputs[$scope.activeInput].text;


                }

            };


            $scope.displayInput = $scope.inputs[$scope.activeInput].text;

            $scope.$watch('activeInput', function (value) {

                $scope.updateInputs(+value);

                $scope.displayInput = $scope.inputs[$scope.activeInput].text;
            });

            $scope.$watch('displayInput', function (newVal) {


                $scope.inputs[$scope.activeInput].text = newVal;

                //FIXME: blank values appended to input value

                // I am filtering values in contractsCtrl when gathering Data


                $scope.$parent.input.value = $scope.inputs.map(item => item.text).join(',');
            });


        }
    }


}


module.exports = arrayInputDrtv;
