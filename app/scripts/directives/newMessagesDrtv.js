var newMessagesDrtv = function (globalService) {


    return {

        //restrict: 'E',
        template: require('./newMessages.html'),
        link: function ($scope) {


            const newMessagesModal = new Modal(document.getElementById('newMessagesModal'));

            $scope.handleViewMessages = function () {

                const {tabs: {messages: {id, url}}} = globalService;

                newMessagesModal.close();


                Object.assign(globalService, {
                    currentTab: id,
                });


                location.hash = url;

            }


        }

    }


}

module.exports = newMessagesDrtv;
