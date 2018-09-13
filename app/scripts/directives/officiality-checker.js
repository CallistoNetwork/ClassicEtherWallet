"use strict";

const InitContract = require("../contract").InitContract;

/*

    https://github.com/yuriy77k/Officiality-checker-web3.js-/blob/master/CEW_tab/app/scripts/controllers/officialityCheckerCtrl.js#L41


 */
function mapToURL(_url) {
    try {
        const url = new URL(_url);

        return (
            url.protocol +
            "//" +
            url.host.match(/\w+\.\w+$/)[0] +
            url.pathname.match(/^\/\w*\/?/)[0]
        );
    } catch (e) {
        return null;
    }
}

class OfficialityContract extends InitContract {
    constructor() {
        const oc = require("../abiDefinitions/clo").find(
            i => i.address === "0xf6f29e5ba51171c4ef4997bd0208c7e9bc5d5eda"
        );

        if (!oc) {
            throw new Error("Invalid Request");
        }

        super(oc.abi, oc.address, "CLO");
    }

    /*

          @param path string
          @returns Promise<bool>
       */

    async handle_is_official(path) {
        const URLS = [
            path,
            "http://" + path,
            "http://" + path + "/",
            "https://" + path,
            "https://" + path + "/"
        ]
            .map(mapToURL)
            .filter(i => i);

        // console.log('URLS', URLS);

        return Promise.all(
            URLS.map(_url => this.call("is_official", { inputs: [_url] }))
        ).then(result => {
            return (this.is_official = result.some(item => item[0].value));
        });
    }

    _test() {
        // should parse urls and return true for possible user inputs
        const paths = [
            "callisto.network",
            "https://callisto.network/",
            "https://callisto.network"
        ];

        return Promise.all(
            paths.map(path => this.handle_is_official(path))
        ).then(result => {
            const allOfficial = result.every(i => i);

            if (!allOfficial) {
                console.error(result, paths);
            } else {
                console.log("success", result, allOfficial);
            }

            return { result, allOfficial };
        });
    }
}

module.exports = function officialityChecker() {
    // https://github.com/EthereumCommonwealth/Proposals/issues/10

    return {
        template: require("./officiality-checker.html"),
        require: "form",
        link: function(scope, e, attr, form) {
            const contract = new OfficialityContract();
            form.link.$asyncValidators.isOfficial = async _link =>
                (await contract.handle_is_official(_link))
                    ? Promise.resolve()
                    : Promise.reject();
        }
    };
};
