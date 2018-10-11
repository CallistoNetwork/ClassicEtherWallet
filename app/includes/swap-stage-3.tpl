
<article class="swap-order">


    <!-- Title -->
    <section class="row text-center">
        <div class="col-xs-3 text-left"><a class="btn btn-danger btn-xs" ng-click="newSwap()"> Start New Swap </a></div>
        <h5 class="col-xs-6" translate="SWAP_information">Your Information</h5>
        <div class="col-xs-3">

            <a href="{{'https://changenow.io/exchange/txs/' + orderResult.id}}" target="_blank">
                <img src="https://changenow.io/images/embeds/button.svg" alt="ChangeNOW button">
            </a>
        </div>
    </section>


    <!-- Order Info -->
    <section class="row order-info-wrap">
        <div class="col-sm-4 order-info">
            <h4>
                <a
                    target="_blank"
                    rel="noopener"
                    href="{{'https://changenow.io/exchange/txs/' + orderResult.id}}">

                    {{orderResult.id}}
                </a>
            </h4>
            <p translate="SWAP_ref_num">

            </p>
        </div>

        <div class="col-sm-4 order-info">
            <h4>
                {{orderResult.expectedReceiveAmount}}
                <coin-icon icon="{{orderResult.toCurrency.toLowerCase()}}"></coin-icon>
            </h4>
            <p translate="SWAP_rec_amt">Amount to receive</p>
        </div>
        <div class="col-sm-4 order-info">
            <h4>{{(orderResult.expectedSendAmount / orderResult.expectedReceiveAmount) | number: 6}}
                <coin-icon icon="{{orderResult.fromCurrency.toLowerCase()}}"></coin-icon>
                {{' / '}}
                <coin-icon icon="{{orderResult.toCurrency.toLowerCase()}}"></coin-icon>
            </h4>

            <h4>{{(orderResult.expectedReceiveAmount / orderResult.expectedSendAmount) | number: 6}}
                <coin-icon icon="{{orderResult.toCurrency.toLowerCase()}}"></coin-icon>
                {{' / '}}
                <coin-icon icon="{{orderResult.fromCurrency.toLowerCase()}}"></coin-icon>
            </h4>
            <p translate="SWAP_your_rate">Your rate</p>
        </div>


    </section>


    <!-- Swap Progress -->
    <section class="row swap-progress">
        <div class="sep"></div>
        <div class="progress-item {{orderResult.progress.bar[0]}}">
            <div class="progress-circle"><i>1</i></div>
            <p translate="SWAP_progress_1">Order Initiated</p>
        </div>
        <div class="progress-item {{orderResult.progress.bar[1]}}">
            <div class="progress-circle"><i>2</i></div>
            <p><span translate="SWAP_progress_2">Waiting for your </span> {{orderResult.fromCurrency}}...</p>
        </div>
        <div class="progress-item {{orderResult.progress.bar[2]}}">
            <div class="progress-circle"><i>3</i></div>
            <p>{{orderResult.fromCurrency}} <span translate="SWAP_progress_3">Received!</span></p>
        </div>
        <div class="progress-item {{orderResult.progress.bar[3]}}">
            <div class="progress-circle"><i>4</i></div>
            <p>
                <span translate="SWAP_progress_4">Sending your </span> {{orderResult.toCurrency}} <br/>
            </p>
        </div>
        <div class="progress-item {{orderResult.progress.bar[4]}}">
            <div class="progress-circle"><i>5</i></div>
            <p translate="SWAP_progress_5">Order Complete</p>
        </div>
    </section>


    <!-- Swap CTA -->
    <section class="row text-center"
             ng-show="['new', 'waiting'].includes(orderResult.status.toLowerCase())">
        <h1>
            <span translate="SWAP_order_CTA">Please send</span>
            <strong> {{orderResult.expectedSendAmount}}
                <coin-icon icon="{{orderResult.fromCurrency.toLowerCase()}}"></coin-icon>
            </strong>
            <span
                translate="SENDModal_Content_2">to address</span><br/>
            <strong class="mono text-primary">{{orderResult.payinAddress}}
            </strong>
        </h1>
    </section>

    <div ng-controller='sendTxCtrl'>

        <send-tx-modal></send-tx-modal>
        <!-- Swap CTA ETH -->
        <article class="row"
                 ng-show="['new', 'waiting'].includes(orderResult.status.toLowerCase())">
            <section class="clearfix collapse-container">
                <div class="text-center" ng-click="wd = !wd">

                    <h5>

                          <span
                              style="margin: 0; padding: 0 2px;"
                              class="collapse-button glyphicon"
                              ng-class="wd ? 'glyphicon-plus' : 'glyphicon-minus'"
                          ></span>
                        <span
                            traslate="SWAP_unlock">Unlock your wallet to send ETH or Tokens directly from this page.</span>
                    </h5>
                </div>
                <div ng-show="!wd">
                    @@if (site === 'cew' ) {
                    <wallet-decrypt-drtv></wallet-decrypt-drtv>
                    }
                    @@if (site === 'cx' ) {
                    <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
                    }
                </div>
            </section>

            <section ng-show="walletService.wallet" class="row">
                @@if (site === 'cew' ) { @@include( './sendTx-content.tpl', { "site": "cew" } ) }
                @@if (site === 'cx' ) { @@include( './sendTx-content.tpl', { "site": "cx" } ) }



            </section>
        </article>
    </div>
    <!-- / Swap CTA ETH -->


</article>
