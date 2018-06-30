var etherDisplay = function () {

    return {

        template: require('./etherDisplay.html'),
        link: function ($scope, element, {unit, value}) {

            $scope.DISPLAY_TEXT = etherUnits.toEther(value, unit);
        }
    }
};

module.exports = etherDisplay;
