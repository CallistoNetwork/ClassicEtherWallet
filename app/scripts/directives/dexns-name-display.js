'use strict';

const dexnsNameDisplay = function (dexnsService, walletService) {

    return {

        template: require('./dexns-name-display.html'),
        link: function ($scope, e, attrs) {

            $scope.dexnsName = null;

            function getAssignation(addr) {

                dexnsService.storageContract.call('assignation', {
                    inputs: [addr]
                }).then(result => {

                    if (!(result === '0x0000000000000000000000000000000000000000' || result === '0x0')) {

                        $scope.dexnsName = result;

                    }
                });
            }

            $scope.$watch(function () {

                return walletService.wallet.getAddressString();

            }, function (val, _val) {


                getAssignation(val);


            });

            getAssignation(walletService.wallet.getAddressString());


        }
    }
};

module.exports = dexnsNameDisplay;
