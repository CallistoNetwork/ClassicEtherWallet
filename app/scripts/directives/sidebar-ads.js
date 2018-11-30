"use strict";

module.exports = function sidebarAds($interval) {
    return {
        restrict: "E",
        template: require("./sidebar-ads.html"),
        link: function($scope) {
            $scope.slide = 1;

            $scope.$on("$destroy", () => {
                $scope.stopSlide();
            });

            $scope.stopSlide = function() {
                if ($scope.interval) {
                    $interval.cancel($scope.interval);

                    $scope.interval = null;
                }
            };

            function updateSlide() {
                if (3 <= $scope.slide) {
                    $scope.slide = 1;
                } else {
                    $scope.slide += 1;
                }
            }

            $scope.interval = $interval(updateSlide, 1000 * 8);
        }
    };
};
