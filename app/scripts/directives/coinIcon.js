const colors = require("crypto-icons/colors.json");

module.exports = function coinIcon() {
    return {
        restrict: "E",
        template: require("./coinIcon.html"),
        scope: {
            icon: "@"
        },
        link: function(scope) {
            scope.colors = colors;
        }
    };
};
