<article class="modal fade" id="startStakingModalV2" tabindex="-1"

>
    <section class="modal-dialog">
        <form ng-submit="startStakingV2();">
            <section class="modal-content"
                     ng-if="coldStakingV2Service.validNetwork()"

            >

                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>


                    <div ng-if="coldStakingV2Service.stakingInfo.amount > 0" class="alert alert-danger">
                        <h2> WARNING!</h2>
                        <p translate="COLD_STAKING_START_STAKING_WARNING">
                            You already have funds in staking contract.
                            You will lose your staking reward if you make a new deposit into the contract.
                            You should withdraw your staking reward first or use a another account for a new staking
                            deposit.
                        </p>

                        <div class="checkbox">
                            <label>


                                <input name="understand" id="understand" type="checkbox"
                                       ng-model="input.understand"/>

                                <span translate="COLD_STAKING_UNDERSTAND">
                                I understand, proceed anyways
                                </span>
                            </label>
                        </div>


                    </div>


                    <h2 class="modal-title">You are about to <b>freeze your {{ajaxReq.type}} for Cold Staking:</b></h2>

                    <h5>

                        <span translate="SENDModal_Content_1">You are about to send</span>

                        {{tx.value || 0}} {{ajaxReq.type}} to the staking contract:
                        <a
                            target="_blank"
                            href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', coldStakingV2Service.contract.address)}}"
                        >
                            {{coldStakingV2Service.contract.address}}
                        </a>

                    </h5>

                    <div class="form-group">
                        <label translate="SEND_amount_short">
                            Amount
                        </label>
                        <input name="value"
                               ng-model="tx.value"
                               class="form-control"
                               required
                               autocomplete="off"
                               placeholder="{{ajaxReq.type}}"
                               ng-class="coldStakingV2Service.validStakingTx(tx.value) ? 'is-valid' : 'is-invalid'"
                        >

                    </div>
                    <br/>

                    <div class="form-group">
                        <label>
                            Staking Period
                        </label>
                        <select ng-model="input.stakingPeriod"
                                class="form-control"
                                required="true">
                            <option value="1" selected="selected">1 Round (27 days)</option>
                            <option value="2">2 Rounds (54 days)</option>
                            <option value="3">3 Rounds (81 days)</option>
                            <option value="4">4 Rounds (108 days)</option>
                            <option value="5">5 Rounds (135 days)</option>
                            <option value="6">6 Rounds (162 days)</option>
                            <option value="7">7 Rounds (189 days)</option>
                            <option value="8">8 Rounds (216 days)</option>
                            <option value="9">9 Rounds (243 days)</option>
                            <option value="10">10 Rounds (270 days)</option>
                            <option value="11">11 Rounds (297 days)</option>
                            <option value="12">12 Rounds (324 days)</option>
                        </select>

                    </div>
                    <br/>

                    <div class="row justify_row">
                        <div class="col-xs-4">

                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{walletService.wallet.getAddressString()}}"
                                 watch-var="walletService.wallet.getAddressString()"></div>
                        </div>


                        <div class="col-xs-4 text-center">

                            - >
                            <br/>
                            <span class="mono"> {{tx.value || 0}} {{ajaxReq.type}}</span>
                        </div>
                        <div class="col-xs-4">
                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{coldStakingV2Service.contract.address}}"
                                 watch-var="staking_address"></div>
                        </div>
                    </div>

                    <p translate="COLD_STAKING_LOCKED_WARNING">

                        Your funds will be locked and you will be unable
                        to withdraw within the locking period (staking rounds).

                    </p>

                    <p translate="COLD_STAKING_PAY_TX_FEE_WARNING">

                    </p>

                    <p translate="COLD_STAKING_UNPRED_WARNING">
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
                        ng-disabled="coldStakingV2Service.stakingInfo.amount > 0 && !input.understand"
                        type="submit"
                        class="btn btn-primary" translate="SENDModal_Yes">
                        Yes, I am sure! Make transaction.
                    </button>
                </div>

            </section>

        </form>
    </section>
</article>
