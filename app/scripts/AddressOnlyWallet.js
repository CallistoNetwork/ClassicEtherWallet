"use strict";

class AddressOnlyWallet extends Wallet {
    constructor(_addr) {
        super();

        this.type = "addressOnly";
        this.hwType = undefined;
        this.hwTransport = undefined;
        this.path = undefined;
        this.pubKey = undefined;
        this.address = _addr;
    }

    getAddressString() {
        return this.address;
    }

    getChecksumAddressString() {
        return ethUtil.toChecksumAddress(this.getAddressString());
    }
}

module.exports = AddressOnlyWallet;
