"use strict";

module.exports = function sidebarAds($interval) {
    return {
        restrict: "E",
        template: require("./sidebar-ads.html"),
        link: function($scope) {
            $scope.slide = 1;

            function updateSlide() {
                if (3 <= $scope.slide) {
                    $scope.slide = 1;
                } else {
                    $scope.slide += 1;
                }
            }
            $interval(updateSlide, 1000 * 8);
        }
    };
};
