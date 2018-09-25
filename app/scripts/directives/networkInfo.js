"use strict";

const uniq = require("lodash/uniq");

module.exports = function networkInfo() {
    return {
        template: require("./networkInfo.html"),
        link: function(scope) {
            // todo: unique
            scope.explorers = uniq(
                Object.values(nodes.nodeList)
                    .filter(node => node.type === ajaxReq.type)
                    .map(node => node.blockExplorerTX)
            );

            scope.explorerOrigin = () => {
                const explorerURL = new URL(ajaxReq.blockExplorerTX);
                return explorerURL.origin;
            };

            scope.coinPriceService = window.coinPriceService;
        }
    };
};
