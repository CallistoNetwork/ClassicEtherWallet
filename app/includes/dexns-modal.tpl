<!-- ALL: ENS MODAL -->
<article ng-show="(dexns_status==7)" class="modal fade" id="dexnsConfirmModal" tabindex="-1">
    <section class="modal-dialog">
        <section class="modal-content">

            <div class="modal-body">

                <button type="button" class="close" data-dismiss="modal">&times;</button>

                <h2 class="modal-title">
                    You are about to
                    <span ng-show="(dexns_status==7)"> register a name:</span>
                </h2>

                <div>
                    <h4>{{ DexNSName }}</h4>
                    <small>You will pay
                        <ether-display
                                unit="wei"
                                value="{{tx.value}}"
                        >
                        </ether-display>
                        ETC for this name.
                    </small>
                    <small>You will own this name for 1 year.</small>
                </div>

                <table class="table">
                    <tbody>
                    <tr class="text-center">
                        <td>
                            <div class="addressIdenticon med" title="Address Indenticon"
                                 blockie-address="{{walletService.wallet.getAddressString()}}"
                                 watch-var="wallet.getAddressString()"></div>
                        </td>
                        <td class="mono">-><br/>

                            <ether-display
                                    unit="wei"
                                    value="{{tx.value}}"
                            >
                            </ether-display>

                            {{ajaxReq.type}}
                        </td>
                        <td>
                            <div class="addressIdenticon med" title="Address Indenticon" blockie-address="{{tx.to}}"
                                 watch-var="tx.to"></div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <p> The <strong>{{ajaxReq.type}}</strong> node you are sending through is provided by <strong>{{ajaxReq.service}}</strong>.
                </p>

                <h4 translate="SENDModal_Content_3"> Are you sure you want to do this? </h4>

            </div>

            <div class="modal-footer">
                <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
                    No, get me out of here!
                </button>
                <button class="btn btn-primary" ng-click="sendTx()" translate="SENDModal_Yes">
                    Yes, I am sure! Make transaction.
                </button>
            </div>

        </section>
    </section>
</article>
<!-- ALL: ENS MODAL -->

