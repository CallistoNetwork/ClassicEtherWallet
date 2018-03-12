<article class="modal fade" id="sendMessageModal" tabindex="-1">
    <section class="modal-dialog">
        <section class="modal-content">

            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal">&times;</button>

                <div ng-show="unlockWallet">

                    <h2 class="modal-title text-danger" translate="SENDModal_Title">Warning!</h2>

                    <p>You are about to <strong>send a message </strong>
                    </p>

                    <!-- Data -->
                    <section class="row">
                        <!-- Raw TX -->
                        <div class="form-group col-sm-6">
                            <h4 translate="SEND_raw"> Raw Transaction </h4>
                            <textarea class="form-control" rows="3" readonly>{{rawTx}}</textarea>
                        </div>
                        <!-- Singed TX -->
                        <div class="form-group col-sm-6">
                            <h4 translate="SEND_signed"> Signed Transaction </h4>
                            <textarea class="form-control" rows="3" readonly>{{signedTx}}</textarea>
                        </div>
                    </section>

                </div>
            </div>


            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
                    No, get me out of here!
                </button>
                <button class="btn btn-primary" ng-click="confirmSendMessage()" translate="SENDModal_Yes">
                    Yes, I am sure! Make transaction.
                </button>
            </div>

        </section>
    </section>
</article>

