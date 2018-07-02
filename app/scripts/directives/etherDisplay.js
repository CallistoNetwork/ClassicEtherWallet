var etherDisplay = function () {

    return {

        template: require('./etherDisplay.html'),
        link: function ($scope, element, {unit, value}) {

            $scope.DISPLAY_TEXT = etherUnits.toEther(value, unit);


            //console.log('etherDisplay', value, unit, $scope.DISPLAY_TEXT);

            // $scope.$watch(function () {
            //
            //     return value;
            // }, function (val) {
            //
            //     $scope.DISPLAY_TEXT = etherUnits.toEther(val, unit);
            //
            // })
        }
    }
};

module.exports = etherDisplay;
