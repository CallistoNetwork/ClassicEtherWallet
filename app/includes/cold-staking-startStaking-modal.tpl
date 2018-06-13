<article class="modal fade" id="startStakingModal" tabindex="-1">
    <section class="modal-dialog">
        <form ng-submit="startStaking()">
            <section class="modal-content">

                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>


                    <h2 class="modal-title">You are about to <b>freeze your {{ajaxReq.type}} for Cold Staking:</b></h2>

                    <h5>You will send {{tx.value || 0}} {{ajaxReq.type}} to the staking contract:
                        <a
                                target="_blank"
                                href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', coldStakingService.contract.address)}}"
                        >
                            {{coldStakingService.contract.address}}
                        </a>

                    </h5>

                    <label>
                        Amount
                    </label>
                    <input name="value"
                           ng-model="tx.value"
                           class="form-control"
                           required
                           placeholder="{{ajaxReq.type}}"
                           ng-class="coldStakingService.valid_staking_tx(tx.value) ? 'is-valid' : 'is-invalid'"
                    >

                    <br/>

                    <div class="row justify_row">
                        <div class="col-xs-4">

                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{walletService.wallet.getAddressString()}}"
                                 watch-var="walletService.wallet.getAddressString()"></div>
                            </td>


                        </div>

                        <div class="col-xs-4 text-center">
                            - >
                            <br/>
                            {{tx.value || 0}} {{ajaxReq.type}}
                        </div>
                        <div class="col-xs-4">
                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{coldStakingService.contract.address}}"
                                 watch-var="staking_address"></div>
                        </div>
                    </div>


                    <p>
                        Your funds will be locked for 172,800 blocks (approximately 1 month)
                        and you will be unable to withdraw within the locking period


                    </p>

                    <p>
                        You need to pay transaction fees to start staking,
                        withdraw your stake, or claim staking rewards! Make sure that you have enough
                        funds left on your balance to perform these transactions.
                    </p>

                    <p>
                        Staking rewards are very unpredictable and the amount of reward
                        depends on the time when you are claiming it.
                    </p>

                    <h4 translate="SENDModal_Content_3">Are you sure you want to do this?</h4>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
                        No, get me out of here!
                    </button>
                    <button
                            type="submit"
                            class="btn btn-primary" translate="SENDModal_Yes">
                        Yes, I am sure! Make transaction.
                    </button>
                </div>


            </section>
        </form>
    </section>
</article>
