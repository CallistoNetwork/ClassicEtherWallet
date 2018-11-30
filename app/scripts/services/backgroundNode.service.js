"use strict";

const _sample = require("lodash/sample");
const _throttle = require("lodash/throttle");

const backgroundNodeService = function() {
    /*
        Array<nodeNames> [etc_commonwealth_parity, etc_commonwealth_geth...]
     */

    this.availableNodes = Object.keys(nodes.nodeList).filter(
        _nodeName => nodes.nodeList[_nodeName].type.toUpperCase() === "ETC"
    );

    this.backgroundNode = _sample(this.availableNodes);

    this.changeBackgroundNode = _throttle(
        () => this._changeBackgroundNode(),
        1000
    );

    this._changeBackgroundNode = () => {
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

    return this;
};

module.exports = backgroundNodeService;
