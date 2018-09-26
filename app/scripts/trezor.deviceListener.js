const trezor = require("trezor-connect");
const TrezorConnect = trezor.default;
const { DEVICE_EVENT, DEVICE } = trezor;

const firmwareThreshold = "1.6.0";

const [majorVersion, minorVersion, patchVersion] = firmwareThreshold
    .split(".")
    .map(i => parseInt(i));

const validFirmwareStatus = "valid";

module.exports = function notifyUserOldFirmware() {
    TrezorConnect.on(DEVICE_EVENT, event => {
        const { type, payload } = event;

        if (type === DEVICE.CONNECT) {
            // console.log('connect', event);

            const {
                firmware,
                label,
                status,
                features: { major_version, minor_version, patch_version }
            } = payload;

            if (
                !(
                    firmware === validFirmwareStatus &&
                    majorVersion <= major_version &&
                    minorVersion <= minor_version
                )
            ) {
                const msg = `<b>Update Trezor firmware to ${firmwareThreshold}</b> Your Trezor (${label}) firmware is ${major_version}.${minor_version}.${patch_version}<br/>
                note: transactions may fail until updated`;
                uiFuncs.notifier.danger(msg, 0);
            }
        } else if (type === DEVICE.DISCONNECT) {
            // console.log('disconnect', event);
        }
    });
};
