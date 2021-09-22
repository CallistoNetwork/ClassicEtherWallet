<article class="modal fade" id="openWithdrawModalV2" tabindex="-1"
>
    <section class="modal-dialog">
        <form ng-submit="withdraw_stakeV2()">
            <section class="modal-content"
                     ng-if="coldStakingV2Service.validNetwork()"
            >
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>


                    <div class="alert alert-danger"
                         ng-if="!coldStakingV2Service.userCanWithdraw();">
                        <h1>WARNING!
                        </h1>
                        Withdraw is impossible
                        stake time < round interval
                        ({{coldStakingV2Service.stakingInfo.time | number}} <
                        {{coldStakingV2Service.contract.round_interval | number}})
                    </div>

                    <div class="alert alert-danger"
                         ng-if="coldStakingV2Service.userCanWithdraw() && coldStakingV2Service.stakingInfo.amount === 0"
                    >
                        <h1>WARNING!
                        </h1>
                        You do not have any deposit to withdraw.
                    </div>


                    <h2 class="modal-title">You are about to <b>withdraw

                        <coin-icon icon="{{ajaxReq.icon}}" hidetext="{{true}}">

                        </coin-icon>
                        {{coldStakingV2Service.stakingInfo.amount || 0 | number}}
                        {{ajaxReq.type}}

                        from Cold Staking:</b></h2>

                    <h5>You will withdraw from the staking contract:
                        <a
                            target="_blank"
                            href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', coldStakingV2Service.contract.address)}}"
                        >
                            {{coldStakingV2Service.contract.address}}
                        </a>

                    </h5>


                    <div class="row justify_row">


                        <div class="col-xs-4">
                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{coldStakingV2Service.contract.address}}"
                                 watch-var="staking_address"></div>
                        </div>

                        <div class="col-xs-4 text-center">
                            - >
                            <br/>
                            {{tx.value || 0}}
                            <coin-icon icon="{{ajaxReq.icon}}" hidetext="{{true}}">

                            </coin-icon>
                            {{ajaxReq.type}}
                        </div>


                        <div class="col-xs-4">

                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{walletService.wallet.getChecksumAddressString()}}"
                                 watch-var="walletService.wallet.getAddressString()">

                            </div>
                        </div>


                    </div>
                    <h4 translate="SENDModal_Content_3">Are you sure you want to do this?</h4>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
                        No, get me out of here!
                    </button>
                    <button

                        ng-disabled="!coldStakingV2Service.userCanWithdraw();"
                        type="submit"
                        class="btn btn-primary" translate="SENDModal_Yes">
                        Yes, I am sure! Make transaction.
                    </button>
                </div>


            </section>
        </form>
    </section>
</article>
