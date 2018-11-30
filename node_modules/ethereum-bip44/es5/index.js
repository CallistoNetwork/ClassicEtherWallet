'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ethereumjsUtil = require('ethereumjs-util');

var _bitcoreLib = require('bitcore-lib');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var ec = require('elliptic').ec('secp256k1');

function padTo32(msg) {
    while (msg.length < 32) {
        msg = Buffer.concat([new Buffer([0]), msg]);
    }
    if (msg.length !== 32) {
        throw new Error('invalid key length: ' + msg.length);
    }
    return msg;
}

var EthereumBIP44 = (function () {
    _createClass(EthereumBIP44, null, [{
        key: 'fromPublicSeed',
        value: function fromPublicSeed(seed) {
            return new EthereumBIP44(new _bitcoreLib.HDPublicKey(seed));
        }
    }, {
        key: 'fromPrivateSeed',
        value: function fromPrivateSeed(seed) {
            return new EthereumBIP44(new _bitcoreLib.HDPrivateKey(seed));
        }
    }, {
        key: 'bip32PublicToEthereumPublic',
        value: function bip32PublicToEthereumPublic(pubKey) {
            var key = ec.keyFromPublic(pubKey).getPublic().toJSON();
            return Buffer.concat([padTo32(new Buffer(key[0].toArray())), padTo32(new Buffer(key[1].toArray()))]);
        }
    }]);

    function EthereumBIP44(hdKey) {
        _classCallCheck(this, EthereumBIP44);

        this.parts = ['44\'', // bip 44
        '60\'', // coin
        '0\'', // wallet
        '0' // 0 - public, 1 = private
        // index
        ];

        (0, _assert2['default'])(hdKey);

        this.key = hdKey;
    }

    _createClass(EthereumBIP44, [{
        key: 'derive',
        value: function derive(path) {
            return this.key.derive(path);
        }
    }, {
        key: 'getAddress',
        value: function getAddress(index) {

            var path = this.parts.slice(this.key.depth);
            var derived = this.key.derive('m/' + (path.length > 0 ? path.join('/') + '/' : "") + index);
            var address = (0, _ethereumjsUtil.pubToAddress)(EthereumBIP44.bip32PublicToEthereumPublic(derived.publicKey.toBuffer()));
            return '0x' + address.toString('hex');
        }
    }, {
        key: 'getPrivateKey',
        value: function getPrivateKey(index) {
            var path = this.parts.slice(this.key.depth);
            var derived = this.key.derive('m/' + (path.length > 0 ? path.join('/') + '/' : "") + index);
            return padTo32(derived.privateKey.toBuffer());
        }
    }]);

    return EthereumBIP44;
})();

exports['default'] = EthereumBIP44;
module.exports = exports['default'];