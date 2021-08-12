// loads most recent Ledger transport if supported

const u2fTransport = require("@ledgerhq/hw-transport-u2f").default;
const webUsbTransport = require("@ledgerhq/hw-transport-webusb").default;
const platform = require('platform');

const getLedgerTransport = async () => {
    let transport;
    const support = await webUsbTransport.isSupported();

    if (support && !(platform.os.family === 'Windows' && platform.name === 'Opera')) { // known issues with Opera on windows.
        transport = await webUsbTransport.create();
    } else {
        transport = await u2fTransport.create(10000,30000);
    }
    
    return transport;
};

module.exports = getLedgerTransport;