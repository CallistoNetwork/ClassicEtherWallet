'use strict';

const cssThemeDrtv = function () {


    const localStorageKey = '@css-theme@';

    return {
        restrict: "E",
        template: require('./cssThemeDrtv.html'),
        link: function ($scope) {


            const theme = globalFuncs.localStorage.getItem(localStorageKey, 'day');

            if (_validTheme(theme)) {

                $scope.currentTheme = theme;

            } else {

                $scope.currentTheme = 'day';
            }


            function _validTheme(theme) {

                return ['night', 'day'].includes(theme);
            }

            $scope.handleChangeTheme = function handleChangeTheme(currentTheme) {

                if (_validTheme(currentTheme)) {

                    globalFuncs.localStorage.setItem(localStorageKey, currentTheme);

                }

            }

        }
    };
};
module.exports = cssThemeDrtv;
