'use strict';

const cssThemeDrtv = function () {


    const localStorageKey = '@css-theme@';

    const themeLink = document.getElementById('cssTheme');

    return {
        restrict: "E",
        template: require('./cssThemeDrtv.html'),
        link: function ($scope, element, attrs) {


            $scope.applyDarkTheme = globalFuncs.localStorage.getItem(localStorageKey, false);


            function applyTheme() {

                const style = $scope.applyDarkTheme ?
                    'https://bootswatch.com/3/darkly/bootstrap.min' :
                    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min';


                themeLink.href = `${style}.css`;


                globalFuncs.localStorage.setItem(localStorageKey, $scope.applyDarkTheme);

            }

            $scope.handleSubmit = function () {

                $scope.applyDarkTheme = !$scope.applyDarkTheme;


                applyTheme();


            };

            applyTheme();


        }
    };
};
module.exports = cssThemeDrtv;
