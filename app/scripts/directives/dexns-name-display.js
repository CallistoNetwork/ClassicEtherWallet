"use strict";

const dexnsNameDisplay = function(dexnsService, walletService, globalService) {
    return {
        template: require("./dexns-name-display.html"),
        link: function($scope) {
            $scope.dexnsName = "";

            $scope.endTime = 0;

            $scope.timeRemaining = "";

            function getAssignation(addr) {
                dexnsService.storageContract
                    .call("assignation", {
                        inputs: [addr]
                    })
                    .then(result => {
                        const addr = result[0].value;

                        if (
                            !(
                                addr ===
                                    "0x0000000000000000000000000000000000000000" ||
                                addr === "0x0"
                            )
                        ) {
                            $scope.dexnsName = addr;
                        }
                    });
            }

            function endTimeOf(_name = "dexaran") {
                dexnsService.feContract
                    .call("endtimeOf", { inputs: [_name] })
                    .then(result => {
                        $scope.endTime = result[0].value * 1000;

                        return $scope.endTime;
                    })
                    .then(endTime => timeRem(endTime));
            }

            function timeRem(timeUntil) {
                const { timeRemaining } = globalFuncs.timeRem(timeUntil);

                $scope.timeRemaining = timeRemaining;
            }

            $scope.goToDexns = function() {
                globalService.currentTab = globalService.tabs.dexns.id;
                location.hash = globalService.tabs.dexns.url;
            };

            $scope.$watch("dexnsName", function(val) {
                if (val) {
                    endTimeOf(val);
                }
            });

            $scope.$watch(
                function() {
                    return walletService.wallet.getAddressString();
                },
                function(val) {
                    getAssignation(val);
                }
            );

            getAssignation(walletService.wallet.getAddressString());
        }
    };
};

module.exports = dexnsNameDisplay;
