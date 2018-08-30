const DexNSFrontendABI = require("../abiDefinitions/etcAbi.json")
    // require("../abiDefinitions/rinkebyAbi.json")
    .find(itm => itm.name === "DexNS Frontend contract");

const DexNSStorage = require("../abiDefinitions/etcAbi.json")
    //require("../abiDefinitions/rinkebyAbi")
    .find(i => i.name === "DexNS State storage");

if (!DexNSFrontendABI) {
    throw new Error("Unable to locate DexNSFrontendABI");
}

if (!DexNSStorage) {
    throw new Error("Unable to locate DEXNS storage");
}

function stringifyMetadata({
    tokenNetwork = "ETC",
    link = "",
    sourceCode = "",
    abi = "",
    info = ""
} = {}) {
    let validAbi = false;

    if (abi) {
        try {
            _abi = JSON.parse(abi);
            validAbi = true;
        } catch (e) {
            uiFuncs.notifier.danger(globalFuncs.errorMsgs[26]);
        }
    }

    const abiText = validAbi ? ` -A ${abi}` : "";

    return `-${tokenNetwork}${link && ` -L ${link}`}${sourceCode &&
        ` -S ${sourceCode}`}${abiText}${info && ` -i ${info}`}`;
}

/*

-A for ABI.

-L for attached link.

-S for source code reference.

-i for informational data chunk.
 */
function parseMetadata(_metadata) {
    if (!_metadata) {
        return "";
    }

    const _arr = _metadata.split("-");

    const network = _arr[1];

    const rest = _arr.slice(2);

    const params = rest.map(i => {
        const param = i[0].toLowerCase();

        let key = "data";

        if (param === "l") {
            key = "link";
        } else if (param === "s") {
            key = "source";
        } else if (param === "i") {
            key = "info";
        }

        return {
            key,
            value: i.slice(2)
        };
    });

    return [].concat([{ key: "network", value: network }], params);
}

const dexnsService = function() {
    this.parseMetadata = parseMetadata;

    const network = nodes.nodeTypes.ETC; // nodes.nodeTypes.Rinkeby;

    this.feContract = new InitContract(
        DexNSFrontendABI.abi,
        DexNSFrontendABI.address,
        network,
        false
    );

    this.storageContract = new InitContract(
        DexNSStorage.abi,
        DexNSStorage.address,
        network,
        false
    );

    this.feContract.namePrice = [
        { value: 100000000000000000, type: "uint256", name: "namePrice" }
    ];
    this.feContract.owningTime = [
        { value: 31536000, type: "uint256", name: "owningTime" }
    ]; // 1 year

    this.stringifyMetadata = stringifyMetadata;

    return this;
};

module.exports = dexnsService;
