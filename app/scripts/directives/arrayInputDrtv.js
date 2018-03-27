'use strict';


var arrayInputDrtv = function () {


    return {
        restrict: "E",

        // link is not working???? must use template
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

        link: function ($scope) {

            // TODO: validate fields

            // TODO: filter invalid fields?????


            $scope.inputs = [
                {
                    text: '',
                }
            ];

            $scope.activeInput = 0;

            $scope.updateInputs = function updateInputs(value) {


                while ($scope.inputs.length <= value) {

                    $scope.inputs.push({text: ''});

                    value--;


                }
            };

            $scope.deleteInput = function deleteInput(number) {

                $scope.inputs = $scope.inputs.filter((input, idx) => idx !== number);

                if ($scope.activeInput >= $scope.inputs.length) {

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


                $scope.$parent.input.value = $scope.inputs.map(item => item.text).join(',');
            });


        }
    }


}


module.exports = arrayInputDrtv;
