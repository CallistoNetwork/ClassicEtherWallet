"use strict";

module.exports = function messagesOverviewDrtv(
    globalService,
    walletService,
    messageService
) {
    return {
        restrict: "E",
        template: require("./messagesOverviewDrtv.html"),
        link: function($scope) {
            $scope.numberOfNewMessages = () =>
                messageService.numberOfNewMessages(
                    walletService.wallet.getAddressString()
                );

            $scope.numberOfMessages = () =>
                messageService.numberOfMessages(
                    walletService.wallet.getAddressString()
                );

            $scope.loadingMessages = () => messageService.loadingMessages;

            $scope.viewMessageList = function viewMessageList() {
                globalService.currentTab = globalService.tabs.messages.id;
                location.hash = globalService.tabs.messages.url;
            };
        }
    };
};
