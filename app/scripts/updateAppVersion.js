/*

    If app has a different version than user saved one, clear localStorage on load


 */
const appVersionKey = "appVersion";

function appNewVersion(version = "3.12.1") {
    if (!versionsEqual(version)) {
        globalFuncs.localStorage.clear();
        globalFuncs.localStorage.setItem(appVersionKey, version);
    }
}

function versionsEqual(version = "3.12.1") {
    const userAppVersion = globalFuncs.localStorage.getItem(
        appVersionKey,
        null
    );
    const _appVersion = mapToVersion(version);
    const _userAppVersion = mapToVersion(userAppVersion);
    return _appVersion === _userAppVersion;
}

function mapToVersion(version = "3.12.1") {
    try {
        return version.split(".").join("");
    } catch (e) {
        return "000";
    }
}

module.exports = {
    appNewVersion
};
