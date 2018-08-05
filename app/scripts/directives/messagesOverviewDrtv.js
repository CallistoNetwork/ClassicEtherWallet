"use strict";

var messagesOverviewDrtv = function(
    globalService,
    walletService,
    messageService
) {
    return {
        restrict: "E",
        template: require("./messagesOverviewDrtv.html"),
        link: function($scope) {
            $scope.walletService = walletService;
            $scope.messageService = messageService;

            $scope.viewMessageList = function viewMessageList() {
                globalService.currentTab = globalService.tabs.messages.id;
                location.hash = globalService.tabs.messages.url;
            };
        }
    };
};
module.exports = messagesOverviewDrtv;
