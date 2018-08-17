"use strict";

const _sample = require("lodash/sample");

const backgroundNodeService = function() {
    this.availableNodes = Object.keys(nodes.nodeList).filter(
        _node => nodes.nodeList[_node].type.toUpperCase() === "ETC"
    );

    this.changeBackgroundNode = () => {
        const { backgroundNode, availableNodes } = this;

        const availableNodes_ = availableNodes.filter(
            node => node !== backgroundNode
        );

        if (0 < availableNodes_.length) {
            const sampleNode = _sample(availableNodes_);

            Object.assign(this, { backgroundNode: sampleNode });
        }

        return true;
    };

    this.backgroundNode = _sample(this.availableNodes);

    return this;
};

module.exports = backgroundNodeService;
