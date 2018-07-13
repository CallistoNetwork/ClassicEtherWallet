'use strict';

const services = ['ens', 'dexns', 'ecns', 'none'];
const lookupService = function (dexnsService, walletService) {

    this.network = 'ETC';
    this.service = 'dexns';


    this.lookup = function () {


        if (this.service === 'dexns') {

            return dexnsService.feContract.call('assignment', {inputs: [walletService.wallet.getAddressString()]}).then(result => {

                const _name = result.data[0];

                return _name;

            });
        } else if (this.service === 'ens') {

            //todo: ens

        } else if (this.service === 'ecns') {

            //todo: ecns
        }
    }

    function mapServiceToNetwork(_service) {

        _service = _service.toLowerCase();
        if (_service === 'ens') {

            return 'ETH';
        } else if (['dexns', 'ecns'].includes(_service)) {

            return 'ETC';
        } else {

            return '';
        }
    }

    this.setNetwork = function (_service = 'dexns') {


        if (!services.includes(_service)) {

            throw new Error('Invalid Request');
        }

        const _network = mapServiceToNetwork(_service);
        this.network = _network;
        this.service = _service;
    };


    return this;
}
