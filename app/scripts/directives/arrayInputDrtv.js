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
                                <input type="text" class="form-control" ng-model="displayInput" />
                            </div>
                            <div class="col-xs-2 text-center">
                                <input type="number" class="form-control" min="0" step="1" ng-model="activeInput"/>
                            </div>
                        </div>
                          <div class="row">
                              <div ng-repeat="(idx, input) in inputs track by $index">
                    
                                  <div class="row">
                                      <div class="col-xs-2">
                                         ↳ [ {{idx}} ]
                                      </div>
                                      <div class="col-xs-8">
                                          <input type="text" class="form-control" ng-model="input.text" readonly tabindex="-1" />
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

            $scope.inputs = [
                {
                    text: defaultVal(type),
                }
            ];

            $scope.activeInput = 0;


            $scope.updateInputs = function updateInputs(value) {


                while ($scope.inputs.length <= value) {

                    $scope.inputs.push({text: defaultVal(type)});

                    value--;


                }
            };

            $scope.deleteInput = function deleteInput(number) {

                $scope.inputs = $scope.inputs.filter((input, idx) => idx !== number);

                if ($scope.inputs.length <= $scope.activeInput) {

                    $scope.activeInput = $scope.inputs.length - 1;
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
