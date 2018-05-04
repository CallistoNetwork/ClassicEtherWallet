'use strict';

var messagesOverviewDrtv = function (globalService) {
    return {
        restrict: "E",
        template: require('./messagesOverviewDrtv.html'),
        link: function ($scope, element, attrs) {


            $scope.viewMessageList = function viewMessageList() {

                globalService.currentTab = globalService.tabs.messages.id;
                location.hash = globalService.tabs.messages.url;
            }
        }
    };
};
module.exports = messagesOverviewDrtv;
