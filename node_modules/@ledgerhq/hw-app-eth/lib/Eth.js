"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Ethereum API
 *
 * @example
 * import Eth from "@ledgerhq/hw-app-eth";
 * const eth = new Eth(transport)
 */
var Eth = function () {
  function Eth(transport) {
    var scrambleKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "w0w";
    (0, _classCallCheck3.default)(this, Eth);

    this.transport = transport;
    transport.decorateAppAPIMethods(this, ["getAddress", "signTransaction", "signPersonalMessage", "getAppConfiguration"], scrambleKey);
  }

  /**
   * get Ethereum address for a given BIP 32 path.
   * @param path a path in BIP 32 format
   * @option boolDisplay optionally enable or not the display
   * @option boolChaincode optionally enable or not the chaincode request
   * @return an object with a publicKey, address and (optionally) chainCode
   * @example
   * eth.getAddress("44'/60'/0'/0/0").then(o => o.address)
   */


  (0, _createClass3.default)(Eth, [{
    key: "getAddress",
    value: function getAddress(path, boolDisplay, boolChaincode) {
      var paths = (0, _utils.splitPath)(path);
      var buffer = new Buffer(1 + paths.length * 4);
      buffer[0] = paths.length;
      paths.forEach(function (element, index) {
        buffer.writeUInt32BE(element, 1 + 4 * index);
      });
      return this.transport.send(0xe0, 0x02, boolDisplay ? 0x01 : 0x00, boolChaincode ? 0x01 : 0x00, buffer).then(function (response) {
        var result = {};
        var publicKeyLength = response[0];
        var addressLength = response[1 + publicKeyLength];
        result.publicKey = response.slice(1, 1 + publicKeyLength).toString("hex");
        result.address = "0x" + response.slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength).toString("ascii");
        if (boolChaincode) {
          result.chainCode = response.slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32).toString("hex");
        }
        return result;
      });
    }

    /**
     * You can sign a transaction and retrieve v, r, s given the raw transaction and the BIP 32 path of the account to sign
     * @example
     eth.signTransaction("44'/60'/0'/0/0", "e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080").then(result => ...)
     */

  }, {
    key: "signTransaction",
    value: function signTransaction(path, rawTxHex) {
      var _this = this;

      var paths = (0, _utils.splitPath)(path);
      var offset = 0;
      var rawTx = new Buffer(rawTxHex, "hex");
      var toSend = [];
      var response = void 0;

      var _loop = function _loop() {
        var maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 : 150;
        var chunkSize = offset + maxChunkSize > rawTx.length ? rawTx.length - offset : maxChunkSize;
        var buffer = new Buffer(offset === 0 ? 1 + paths.length * 4 + chunkSize : chunkSize);
        if (offset === 0) {
          buffer[0] = paths.length;
          paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 1 + 4 * index);
          });
          rawTx.copy(buffer, 1 + 4 * paths.length, offset, offset + chunkSize);
        } else {
          rawTx.copy(buffer, 0, offset, offset + chunkSize);
        }
        toSend.push(buffer);
        offset += chunkSize;
      };

      while (offset !== rawTx.length) {
        _loop();
      }
      return (0, _utils.foreach)(toSend, function (data, i) {
        return _this.transport.send(0xe0, 0x04, i === 0 ? 0x00 : 0x80, 0x00, data).then(function (apduResponse) {
          response = apduResponse;
        });
      }).then(function () {
        var v = response.slice(0, 1).toString("hex");
        var r = response.slice(1, 1 + 32).toString("hex");
        var s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
        return { v: v, r: r, s: s };
      });
    }

    /**
     */

  }, {
    key: "getAppConfiguration",
    value: function getAppConfiguration() {
      return this.transport.send(0xe0, 0x06, 0x00, 0x00).then(function (response) {
        var result = {};
        result.arbitraryDataEnabled = response[0] & 0x01;
        result.version = "" + response[1] + "." + response[2] + "." + response[3];
        return result;
      });
    }

    /**
    * You can sign a message according to eth_sign RPC call and retrieve v, r, s given the message and the BIP 32 path of the account to sign.
    * @example
    eth.signPersonalMessage("44'/60'/0'/0/0", Buffer.from("test").toString("hex")).then(result => {
    var v = result['v'] - 27;
    v = v.toString(16);
    if (v.length < 2) {
      v = "0" + v;
    }
    console.log("Signature 0x" + result['r'] + result['s'] + v);
    })
     */

  }, {
    key: "signPersonalMessage",
    value: function signPersonalMessage(path, messageHex) {
      var _this2 = this;

      var paths = (0, _utils.splitPath)(path);
      var offset = 0;
      var message = new Buffer(messageHex, "hex");
      var toSend = [];
      var response = void 0;

      var _loop2 = function _loop2() {
        var maxChunkSize = offset === 0 ? 150 - 1 - paths.length * 4 - 4 : 150;
        var chunkSize = offset + maxChunkSize > message.length ? message.length - offset : maxChunkSize;
        var buffer = new Buffer(offset === 0 ? 1 + paths.length * 4 + 4 + chunkSize : chunkSize);
        if (offset === 0) {
          buffer[0] = paths.length;
          paths.forEach(function (element, index) {
            buffer.writeUInt32BE(element, 1 + 4 * index);
          });
          buffer.writeUInt32BE(message.length, 1 + 4 * paths.length);
          message.copy(buffer, 1 + 4 * paths.length + 4, offset, offset + chunkSize);
        } else {
          message.copy(buffer, 0, offset, offset + chunkSize);
        }
        toSend.push(buffer);
        offset += chunkSize;
      };

      while (offset !== message.length) {
        _loop2();
      }
      return (0, _utils.foreach)(toSend, function (data, i) {
        return _this2.transport.send(0xe0, 0x08, i === 0 ? 0x00 : 0x80, 0x00, data).then(function (apduResponse) {
          response = apduResponse;
        });
      }).then(function () {
        var v = response[0];
        var r = response.slice(1, 1 + 32).toString("hex");
        var s = response.slice(1 + 32, 1 + 32 + 32).toString("hex");
        return { v: v, r: r, s: s };
      });
    }
  }]);
  return Eth;
}(); /********************************************************************************
      *   Ledger Node JS API
      *   (c) 2016-2017 Ledger
      *
      *  Licensed under the Apache License, Version 2.0 (the "License");
      *  you may not use this file except in compliance with the License.
      *  You may obtain a copy of the License at
      *
      *      http://www.apache.org/licenses/LICENSE-2.0
      *
      *  Unless required by applicable law or agreed to in writing, software
      *  distributed under the License is distributed on an "AS IS" BASIS,
      *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      *  See the License for the specific language governing permissions and
      *  limitations under the License.
      ********************************************************************************/


// FIXME drop:


exports.default = Eth;
//# sourceMappingURL=Eth.js.map