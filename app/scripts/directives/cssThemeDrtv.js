'use strict';

const cssThemeDrtv = function () {


    const localStorageKey = '@css-theme@';

    return {
        restrict: "E",
        template: require('./cssThemeDrtv.html'),
        link: function ($scope) {


            $scope.currentTheme = globalFuncs.localStorage.getItem(localStorageKey, 'day');

            angular.element(window).bind('beforeunload', function () {

                globalFuncs.localStorage.setItem(localStorageKey, $scope.currentTheme);
            });


        }
    };
};
module.exports = cssThemeDrtv;
