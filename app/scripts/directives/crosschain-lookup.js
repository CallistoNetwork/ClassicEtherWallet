'use strict';


/*

    Lookup name based on service
 */
const lookup = function (lookupService) {


    return {

        template: require('./crosschain-lookup.html'),
        link: function ($scope) {

            $scope.lookupService = lookupService;

            $scope.services = Object.keys(lookupService.services);

            $scope.input = {
                currentService: lookupService.service,
            };

            $scope.handleChange = function (_service) {

                lookupService.setNetwork(_service);

                if (lookupService.service === 'none') {

                    $scope.addressDrtv.showDerivedAddress = false;
                }

            }
        }
    }
}

module.exports = lookup;
