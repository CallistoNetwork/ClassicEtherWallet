const colors = require("crypto-icons/colors.json");

module.exports = function coinIcon() {
    return {
        restrict: "E",
        template: require("./coinIcon.html"),
        scope: {
            icon: "@",
            hidetext: "@?"
        },
        link: function(scope, e, attrs) {
            scope.colors = colors;
            if (!attrs.hidetext) {
                attrs.hidetext = false;
            }
        }
    };
};
