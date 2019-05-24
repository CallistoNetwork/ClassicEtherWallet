"use strict";

module.exports = function accountBalanceTable(coldStakingService, $interval) {
    return {
        template: require("./accountBalanceTable.html"),
        link: function(scope) {
            scope.progressBar = {
                width: 0,
                klass: "",
                text: ""
            };

            scope.setProgressBar = function() {
                const _date = new Date();
                const { time: _time, amount } = coldStakingService.stakingInfo;

                if (!(0 < _time && 0 < amount)) {
                    return;
                }

                const time = new Date(_time);

                const _thresholdTime = coldStakingService.getThresholdTime();
                const thresholdTime = new Date(_thresholdTime + _time);

                const num = _date - time;
                const denom = thresholdTime - time;
                const progress = num / denom;
                const width = progress * 100;
                Object.assign(scope.progressBar, {
                    klass: 100 <= width ? "progress-bar-success" : "",
                    width: Math.min(100, Math.floor(width)),
                    elapsed: num,
                    threshold: thresholdTime,
                    remaining: thresholdTime - _date
                });
            };

            scope.setProgressBar();

            scope.progressBarInterval = $interval(
                () => scope.setProgressBar(),
                1000
            );

            scope.$on("$destroy", () => {
                $interval.cancel(scope.progressBarInterval);

                scope.progressBarInterval = null;
            });
        }
    };
};
