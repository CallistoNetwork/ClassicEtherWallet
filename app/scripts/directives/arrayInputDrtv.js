"use strict";

var arrayInputDrtv = function() {
    function defaultVal(type = "string") {
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

        return "";
    }

    return {
        restrict: "E",

        template: require("./arrayInputDrtv.html"),

        link: function($scope, element, attr) {
            const { type, name } = attr;

            const type_ = type.replace("[]", "");

            $scope.inputs = [
                {
                    text: defaultVal(type_)
                }
            ];

            $scope.input = {
                displayInput: $scope.inputs[0].text,
                minimum: 0,
                activeInput: 0,
                name,
                type,
                type_
            };

            $scope.deleteInput = function deleteInput(number) {
                $scope.inputs = $scope.inputs.filter(
                    (input, idx) => idx !== number
                );

                if ($scope.inputs.length <= $scope.input.activeInput) {
                    $scope.input.activeInput = $scope.inputs.length - 1;
                }

                $scope.input.activeInput = Math.max(
                    $scope.inputs.length - 1,
                    0
                );

                if (!$scope.inputs.length) {
                    $scope.inputs = [
                        {
                            text: defaultVal(type_)
                        }
                    ];

                    $scope.input.displayInput = $scope.inputs[0].text;
                }
            };

            $scope.$watch("input.activeInput", function(value) {
                let value_ = Number(value);

                while ($scope.inputs.length <= value_) {
                    $scope.inputs.push({ text: defaultVal(type_) });

                    value_--;
                }

                $scope.input.displayInput =
                    $scope.inputs[$scope.input.activeInput].text;
            });

            $scope.$watch("input.displayInput", function(newVal) {
                $scope.inputs[$scope.input.activeInput].text = newVal;

                // I am filtering values in contractsCtrl when gathering Data

                $scope.$parent.input.value = $scope.inputs.map(
                    item => item.text
                );
            });
        }
    };
};

module.exports = arrayInputDrtv;
