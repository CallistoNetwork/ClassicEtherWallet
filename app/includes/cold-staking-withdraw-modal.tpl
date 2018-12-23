<article class="modal fade" id="openWithdrawModal" tabindex="-1"
>
    <section class="modal-dialog">
        <form ng-submit="withdraw_stake()">
            <section class="modal-content"
                     ng-if="coldStakingService.validNetwork()"
            >
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>


                    <div class="alert alert-danger"
                         ng-if="!coldStakingService.userCanWithdraw();">
                        <h1>WARNING!
                        </h1>
                        Withdraw is impossible
                        stake time < round interval
                        ({{coldStakingService.stakingInfo.time | number}} <
                        {{coldStakingService.contract.round_interval | number}})
                    </div>

                    <div class="alert alert-danger"
                         ng-if="coldStakingService.userCanWithdraw() && coldStakingService.stakingInfo.amount === 0"
                    >
                        <h1>WARNING!
                        </h1>
                        You do not have any deposit to withdraw.
                    </div>


                    <h2 class="modal-title">You are about to <b>withdraw

                        <coin-icon icon="{{ajaxReq.type.toLowerCase()}}" hidetext="{{true}}">

                        </coin-icon>
                        {{coldStakingService.stakingInfo.amount || 0 | number}}
                        {{ajaxReq.type}}

                        from Cold Staking:</b></h2>

                    <h5>You will withdraw from the staking contract:
                        <a
                            target="_blank"
                            href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', coldStakingService.contract.address)}}"
                        >
                            {{coldStakingService.contract.address}}
                        </a>

                    </h5>


                    <div class="row justify_row">


                        <div class="col-xs-4">
                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{coldStakingService.contract.address}}"
                                 watch-var="staking_address"></div>
                        </div>

                        <div class="col-xs-4 text-center">
                            - >
                            <br/>
                            {{tx.value || 0}}
                            <coin-icon icon="{{ajaxReq.type.toLowerCase()}}" hidetext="{{true}}">

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

                        ng-disabled="!coldStakingService.userCanWithdraw();"
                        type="submit"
                        class="btn btn-primary" translate="SENDModal_Yes">
                        Yes, I am sure! Make transaction.
                    </button>
                </div>


            </section>
        </form>
    </section>
</article>
