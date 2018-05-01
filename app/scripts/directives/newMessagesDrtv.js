var newMessagesDrtv = function (globalService) {


    return {

        //restrict: 'E',
        template: `
                    <!-- NEW MESSAGES MODAL -->
            <article class="modal fade" id="newMessagesModal" tabindex="-1">
                <section class="modal-dialog">
                    <section class="modal-content">
            
                        <div class="modal-body">
            
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
            
                            <h2 class="modal-title">
            
                                You have {{NUMBER_OF_NEW_MESSAGES}} recent messages!
                            </p>
                        </div>
            
                        <div class="modal-footer text-center">
                            <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
                                 No, get me out of here!
                            </button>
                            <a ng-click="handleViewMessages()" class="btn btn-primary">
                                View Messages
                            </a>
                        </div>
            
                    </section>
                </section>
            </article>
            <!-- NEW MESSAGES MODAL -->
            

        `,
        link: function ($scope, element, attr) {


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
