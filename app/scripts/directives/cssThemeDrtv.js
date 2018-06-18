'use strict';

const cssThemeDrtv = function () {


    const localStorageKey = '@css-theme@';

    return {
        restrict: "E",
        template: require('./cssThemeDrtv.html'),
        link: function ($scope, element, attrs) {


            $scope.applyDarkTheme = globalFuncs.localStorage.getItem(localStorageKey, 'light');

            // console.log('applyDarktheme', $scope.applyDarkTheme);

            angular.element(window).bind('beforeunload', function () {

                globalFuncs.localStorage.setItem(localStorageKey, $scope.applyDarkTheme);
            });


        }
    };
};
module.exports = cssThemeDrtv;
