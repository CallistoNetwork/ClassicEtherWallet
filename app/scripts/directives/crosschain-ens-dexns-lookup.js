'use strict';


/*

    Lookup name based on service
 */
const lookup = function (lookupService) {


    return {

        template: require('./crosschain-ens-dexns-lookup.html'),
        link: function ($scope) {


            $scope.services = lookupService.services;

            $scope.input = {
                currentService: lookupService.service,
                currentNetwork: ajaxReq.type,
            };

            $scope.handleChange = function (_service) {


                lookupService.setNetwork(_service);

                $scope.input = {
                    currentService: lookupService.service,
                    currentNetwork: lookupService.network,
                }

            }
        }
    }
}

module.exports = lookup;
