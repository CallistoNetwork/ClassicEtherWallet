<article class="modal fade" id="openClaimRewardModalV2" tabindex="-1"
>
    <section class="modal-dialog">
        <form ng-submit="claimV2()">
            <section class="modal-content"
                     ng-if="coldStakingV2Service.validNetwork()"

            >

                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>

                    <div class="alert alert-danger" ng-if="coldStakingV2Service.stakingInfo.amount === 0">
                        <h1>WARNING!</h1>
                        <p translate="COLD_STAKING_NO_WITHDRAW">
                            You do not have any deposit to withdraw.
                        </p>
                    </div>


                    <h2 class="modal-title">You are about to claim <b> Reward
                        {{coldStakingV2Service.stakingInfo.reward || 0 | number}}
                        {{ajaxReq.type}}</b>
                    </h2>

                    <h5>
                        You will claim reward from the cold staking contract:
                        <a
                                target="_blank"
                                href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', coldStakingV2Service.contract.address)}}"
                        >
                            {{coldStakingV2Service.contract.address}}
                        </a>

                    </h5>


                    <p>
                        <b translate="TRANS_gas"></b>

                        {{coldStakingV2Service.tx.gasLimit | number}}
                    </p>
                    
                    <p>
                        <b>Minimum balance in your address to claim this reward: 0.1 CLO</b> 
                    </p>

                    <p>
                        <b>Warning:</b> After claiming the reward, your funds will be frozen for the next 27 days

                        and you will be unable to claim new reward OR withdraw your funds during this period.
                    </p>
                    
                    <p>
                        <b>Warning:</b>

                        Claiming your reward do not give you back your initial investment and it will re stake automatically your funds. To withdraw all, press withdraw
                    </p>

                    <b>Warning:</b> Staking reward can vary over time. Your staking reward depend on:
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
                            ng-disabled="!coldStakingV2Service.stakingInfo.amount"

                            type="submit"
                            class="btn btn-primary" translate="SENDModal_Yes">
                        Yes, I am sure! Make transaction.
                    </button>
                </div>
            </section>
        </form>
    </section>
</article>
