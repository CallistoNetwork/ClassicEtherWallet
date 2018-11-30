"use strict";

module.exports = function contractInteractModal() {
    return {
        require: "form",
        restrict: "A",
        template: require("./contract-interact-modal.html"),
        link: function(scope, e, attrs, form) {
            scope.$watchGroup(["tx.gasLimit", "tx.value"], (_val, _oldVal) => {
                if (!angular.equals(_val, _oldVal)) {
                    reset();
                }
            });
            function reset() {
                scope.rawTx = scope.signedTx = "";
                scope.showRaw = false;
            }
        }
    };
};
