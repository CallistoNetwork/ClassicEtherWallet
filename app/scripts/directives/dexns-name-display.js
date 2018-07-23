'use strict';

const dexnsNameDisplay = function (dexnsService, walletService, globalService) {

    return {

        template: require('./dexns-name-display.html'),
        link: function ($scope) {

            $scope.dexnsName = '';

            $scope.endTime = 0;

            $scope.timeRemaining = '';

            function getAssignation(addr) {

                dexnsService.storageContract.call('assignation', {
                    inputs: [addr]
                }).then(result => {

                    const addr = result[0].value;

                    if (!(addr === '0x0000000000000000000000000000000000000000' || addr === '0x0')) {

                        $scope.dexnsName = addr;


                    }
                });
            }


            function endTimeOf(_name = 'dexaran') {

                dexnsService.feContract.call('endtimeOf', {inputs: [_name]})
                    .then(result => {

                        $scope.endTime = result[0].value * 1000;

                        return $scope.endTime;
                    })
                    .then(endTime => timeRem(endTime))
            }

            function timeRem(timeUntil) {
                var rem = timeUntil - new Date();

                var _second = 1000;
                var _minute = _second * 60;
                var _hour = _minute * 60;
                var _day = _hour * 24;
                var days = Math.floor(rem / _day);
                var hours = Math.floor((rem % _day) / _hour);
                var minutes = Math.floor((rem % _hour) / _minute);
                var seconds = Math.floor((rem % _minute) / _second);
                days = days < 10 ? '0' + days : days;
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                $scope.timeRemaining = days + ' days ' + hours + ' hours ' + minutes + ' minutes ' + seconds + ' seconds ';
            }


            $scope.goToDexns = function () {

                globalService.currentTab = globalService.tabs.dexns.id;
                location.hash = globalService.tabs.dexns.url;
            };

            $scope.$watch('dexnsName', function (val) {

                if (val) {

                    endTimeOf(val);
                }
            })

            $scope.$watch(function () {

                return walletService.wallet.getAddressString();

            }, function (val) {


                // getAssignation(val);

            });

            // getAssignation(walletService.wallet.getAddressString());

            $scope.dexnsName = 'dexaran';


        }
    }
};

module.exports = dexnsNameDisplay;
