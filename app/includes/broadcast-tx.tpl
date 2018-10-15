<main class="tab-pane active broadcast-tx-tab"
      ng-if="globalService.currentTab === globalService.tabs.broadcastTx.id"
      ng-controller='broadcastTxCtrl'
      ng-cloak>

    <article class="block">
        <h2 class="text-center">Broadcast Signed Transaction</h2>

        <p class="text-center">
            Paste a signed transaction and click 'send transaction'
        </p>


        <section>
            <div class="block">
                <form ng-submit="handleSubmit()">
                    <label for="signedTx">Signed Transaction</label>
                    <input ng-model="input.signedTx"
                           ng-change="handleDecodeTx()"
                           name="signedTx"
                           required
                           id="signedTx"
                           type="text"
                           autocomplete="false"
                           spellcheck="false"
                           ng-model-options="{debounce: 300}"
                           class="form-control"
                           ng-class="isValidHex(input.signedTx) ? 'is-valid' : 'is-invalid'"
                    >

                    <div ng-show="input.signedTx" class="row">
                        <div class="col-xs-6">
                            <h3>Raw Transaction</h3>

                            <pre>{{input.rawTx | json: 4}}</pre>

                        </div>
                        <div class="col-sm-6">
                            <h3>Decoded Transaction</h3>

                            <pre class="pre-tx">{{input.decodedInput | json: 4}}</pre>
                        </div>
                    </div>


                    <div class="row row-justify">
                        <button
                            ng-show="input.signedTx"
                            style="max-width: 272px;"
                            translate="SEND_trans" class="btn btn-primary btn-block text-center">Send Transaction
                        </button>
                    </div>
                </form>

                <br/>

                <div class="row">
                    <div class="qr-code" qr-code="{{input.signedTx}}" watch-var="input.signedTx" width="100%"></div>
                </div>
            </div>
        </section>
    </article>
</main>
