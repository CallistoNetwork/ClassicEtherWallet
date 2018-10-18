/*

    If app has a different version than user saved one, clear localStorage on load


 */
const { version } = require("../../package.json");

const appVersionKey = "appVersion";

function appNewVersion(version = "3.12.1") {
    const userAppVersion = globalFuncs.localStorage.getItem(
        appVersionKey,
        null
    );
    if (userAppVersion !== version) {
        globalFuncs.localStorage.clear();
        globalFuncs.localStorage.setItem(appVersionKey, version);
    }
}

function updateAppVersion() {
    appNewVersion(version);
}

module.exports = {
    updateAppVersion,
    appNewVersion
};
