'use strict';

const services = {
    ens: {
        network: 'ETH',

    },
    dexns: {

        network: 'ETC',
    },
    ecns: {

        network: 'ETC'
    },
    none: {
        network: 'none',
    }
}

const _ens = require('../abiDefinitions/ethAbi').find(i => i.address === '0x314159265dD8dbb310642f98f50C066173C1259b');

if (!_ens) {

    throw new Error('Unable to load ens contract');
}

const _ecns = require('../abiDefinitions/etcAbi').find(i => i.address === '0xb96836a066ef81ea038280c733f833f69c23efde');

if (!_ecns) {

    throw new Error('Unable to load ecns contract');

}

const encsResolver = require('../abiDefinitions/etcAbi').find(i => i.address === '0x4fa1fc37a083abe4c53b6304f389042bc0566855');

if (!encsResolver) {


    throw new Error('Unable to locate ecns resolver');
}


const lookupService = function (dexnsService, walletService) {

    this.network = 'ETC';
    this.service = 'dexns';

    this.services = services;

    this.ens = new ens();

    this.ecns = parseJsonContract(_ecns, 'ETC', false);

    this.resolverContract = parseJsonContract(encsResolver, 'ETC', false);

    /*

        Lookup name based on current service

        @param: name = string
        @returns Promise<addr|error>

     */

    this.lookup = function (_name) {

        const tx = {inputs: [_name]};


        if (this.service === 'dexns') {

            return dexnsService.storageContract.call('ownerOf', tx).then(result => {

                return result[0].value;


            });
        } else if (this.service === 'ens') {

            return new Promise((resolve, reject) => {


                this.ens.getOwner(_name + '.eth', function (data) {
                    if (data.error) {

                        uiFuncs.notifier.danger(data.msg);

                        reject(data);
                    } else if (data.data === '0x0000000000000000000000000000000000000000' || data.data === '0x') {
                        resolve('0x0000000000000000000000000000000000000000');
                    } else {
                        resolve(ethUtil.toChecksumAddress(data.data));
                    }
                });
            })

        } else if (this.service === 'ecns') {


            return this.getEcnsAddr(_name).then(result => {

                return result[0].value;
            })

        } else if (this.service === 'none') {

            return Promise.resolve('0x0000000000000000000000000000000000000000');

        } else {

            return Promise.reject(new Error(`Unknown lookup service ${this.service}`));
        }
    };


    this.getEcnsAddr = function (name) {
        const node = namehash(name);


        return this.ecns.call('resolver', {inputs: [node]}).then(resolverAddress => {

            if (resolverAddress === ' 0x0000000000000000000000000000000000000000') {
                return resolverAddress;
            }
            return this.resolverContract.call('addr', {inputs: [node]})
        })
    }

    function namehash(name) {
        var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
        if (name !== '') {
            var labels = name.split(".");
            for (var i = labels.length - 1; i >= 0; i--) {
                node = ethUtil.sha3(node + ethUtil.sha3(labels[i]).toString('hex').slice(2));
            }
        }
        return node.toString();
    }

    this.testLookup = function () {


        this.lookup('dexaran').then((r) => {

            this.service = 'ens';


            this.lookup('myetherwallet').then((r1) => {


                this.service = 'ecns';
                this.lookup('myaddress').then(r2 => {


                })
            })

        })
    };


    this.mapServiceToNetwork = function mapServiceToNetwork(_service) {


        return this.services[_service].network;
    };

    this.setNetwork = function (_service = 'dexns') {

        _service = _service.toLowerCase();

        if (_service === 'none') {

            return this.service = this.network = 'none';

        } else if (!Object.keys(this.services).includes(_service)) {

            throw new Error('Invalid Request');
        }

        this.service = _service;
        this.network = this.mapServiceToNetwork(_service);
    };


    return this;
}

module.exports = lookupService;
