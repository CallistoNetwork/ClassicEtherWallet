"use strict";

const _uniqBy = require("lodash/uniqBy");

module.exports = function networkSelector() {
    return {
        template: require("./networkSelector.html"),
        link: function(scope) {
            const nodeList = Object.values(nodes.nodeList).map((node, i) =>
                Object.assign(node, { key: Object.keys(nodes.nodeList)[i] })
            );

            scope.networkList = _uniqBy(nodeList, "type");

            scope.getAllNodesInNetwork = function(network = "ETC") {
                return nodeList.filter(node => node.type === network);
            };

            scope.changeNetwork = function(networkType = "ETC") {
                if (!globalFuncs.networks.hasOwnProperty(networkType)) {
                    throw new Error(
                        "Invalid Request tabsCtrl.changeNetwork(" +
                            networkType +
                            ")"
                    );
                }
                const key = globalFuncs.networks[networkType];

                scope.changeNode(key);
            };

            /*

                determines whether to apply grey border to bottom of list

                @param _node nodes.nodeList[key]
                @param index number index of the node in nodeList
                @returns 'grey-bottom-border' if n + 1 node type differs than current node else null

             */
            scope.getBottomBorder = function(_node, index) {
                const _nodeList = Object.values(nodes.nodeList);
                if (_nodeList.length <= index + 1) {
                    return null;
                } else if (_nodeList[index + 1].type !== _node.type) {
                    return "grey-bottom-border";
                } else {
                    return null;
                }
            };
        }
    };
};
