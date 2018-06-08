<article class="modal fade" id="openClaimRewardModal" tabindex="-1">
    <section class="modal-dialog">
        <form ng-submit="claim()">
            <section class="modal-content">

                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>


                    <h2 class="modal-title">You are about to <b>claim Reward {{coldStakingService.stake_balance}}
                        {{ajaxReq.type}} from Cold Staking:</b>
                    </h2>

                    <h5>You will claim reward from the staking contract:
                        <a
                                target="_blank"
                                href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', coldStakingService.contract.address)}}"
                        >
                            {{coldStakingService.contract.address}}
                        </a>

                    </h5>

                    <p>
                        <b translate="TRANS_gas"></b>

                        {{tx.gasLimit}}
                    </p>

                    <h5>Warning: After claiming the reward, your funds will be frozen for the next 172,800 blocks</h5>
                    <p>

                        (approx. 1 month) and you will be unable to claim new reward OR withdraw your funds during this
                        period.
                    </p>


                    <h5>Warning: Staking reward can vary over time. Your staking reward depend on:</h5>
                    <ol>


                        <li>
                            Total amount of staking {{ajaxReq.type}} (network weight)
                        </li>
                        <li>
                            Your staking time
                        </li>
                        <li>
                            Other staker's claims
                        </li>
                        <li>
                            Available staking pool
                        </li>
                    </ol>
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
