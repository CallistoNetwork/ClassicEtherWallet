<article class="swap-order" ng-show="showStage3Btc || showStage3Eth">


    <!-- Title -->
    <section class="row text-center">
        <div class="col-xs-3 text-left"><a class="btn btn-danger btn-xs" ng-click="newSwap()"> Start New Swap </a></div>
        <h5 class="col-xs-6" translate="SWAP_information">Your Information</h5>
        <div class="col-xs-3"><a class="link" href="https://bity.com/af/jshkb37v" target="_blank" rel="noopener">
            <img class="pull-right" src="images/logo-bity.svg" width="100" height="38"/>
        </a></div>
    </section>


    <!-- Order Info -->
    <section class="row order-info-wrap">
        <div class="col-sm-4 order-info">
            <h4>{{orderResult.id}}</h4>
            <p translate="SWAP_ref_num">Your reference number</p>
        </div>

        <div class="col-sm-4 order-info">
            <h4>{{currentOrder.output.amount}} {{currentOrder.output.currency.toUpperCase()}}</h4>
            <p translate="SWAP_rec_amt">Amount to receive</p>
        </div>
        <div class="col-sm-4 order-info">
            <h4>{{swapOrder.swapRate}} {{swapOrder.swapPair}}</h4>
            <p translate="SWAP_your_rate">Your rate</p>
        </div>
    </section>


    <!-- Swap Progress -->
    <section class="row swap-progress">
        <div class="sep"></div>
        <div class="progress-item {{currentOrder.progress.bar[0]}}">
            <div class="progress-circle"><i>1</i></div>
            <p translate="SWAP_progress_1">Order Initiated</p>
        </div>
        <div class="progress-item {{currentOrder.progress.bar[1]}}">
            <div class="progress-circle"><i>2</i></div>
            <p><span translate="SWAP_progress_2">Waiting for your </span> {{currentOrder.input.currency}}...</p>
        </div>
        <div class="progress-item {{currentOrder.progress.bar[2]}}">
            <div class="progress-circle"><i>3</i></div>
            <p>{{currentOrder.input.currency}} <span translate="SWAP_progress_3">Received!</span></p>
        </div>
        <div class="progress-item {{currentOrder.progress.bar[3]}}">
            <div class="progress-circle"><i>4</i></div>
            <p>
                <span translate="SWAP_progress_4">Sending your </span> {{currentOrder.output.currency}} <br/>
                <small ng-show="currentOrder.input.currency=='ETH'"> Waiting for 10 confirmations...</small>
                <small ng-show="currentOrder.input.currency=='BTC'"> Waiting for 1 confirmation...</small>
            </p>
        </div>
        <div class="progress-item {{currentOrder.progress.bar[4]}}">
            <div class="progress-circle"><i>5</i></div>
            <p translate="SWAP_progress_5">Order Complete</p>
        </div>
    </section>


    <!-- Swap CTA -->
    <section class="row text-center" ng-show="currentOrder.progress.status=='OPEN'">
        <h1>
            <span translate="SWAP_order_CTA">      Please send                                                 </span>
            <strong> {{currentOrder.input.amount}} {{currentOrder.input.currency}} </strong>
            <span translate="SENDModal_Content_2"> to address                                                  </span><br/>
            <strong class="mono text-primary"> {{orderResult.payment_address}} </strong>
        </h1>
    </section>

    <section class="row text-center">
        <textarea rows="5" class="form-control" disabled>{{currentOrder.rawInput}}</textarea>
    </section>


    <!-- Swap CTA ETH -->
    <article class="row" ng-show="currentOrder.progress.status.toUpperCase() === 'OPEN'">
        <section class="clearfix collapse-container">
            <div class="text-center" ng-click="wd = !wd">
                <a class="collapse-button"><span ng-show="wd">+</span><span ng-show="!wd">-</span></a>
                <h5 traslate="SWAP_unlock">Unlock your wallet to send ETH or Tokens directly from this page.</h5>
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

        <!--<div class="alert alert-danger" ng-show="ajaxReq.type!=='ETH'">-->
            <!--<strong>Warning! You are not connected to an ETH node.</strong> <br/>-->
            <!--Please use the node switcher in the top-right corner to switch to an ETH node. We <strong>do not</strong>-->
            <!--support swapping ETC or Testnet ETH.-->
        <!--</div>-->

        <section class="row" ng-show="wallet!=null" ng-controller='sendTxCtrl'>
            @@if (site === 'cew' ) { @@include( './sendTx-content.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( './sendTx-content.tpl', { "site": "cx" } ) }

            @@if (site === 'cew' ) { @@include( './sendTx-modal.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( './sendTx-modal.tpl', { "site": "cx" } ) }
        </section>
    </article>
    <!-- / Swap CTA ETH -->


    <!-- Swap CTA BTC -->
    <section class="row block swap-address text-center" ng-show="showStage3Btc && currentOrder.progress.status=='OPEN'">
        <label translate="x_Address"> Your Address </label>
        <div class="qr-code" qr-code="{{'bitcoin:'+orderResult.payment_address+'?amount='+currentOrder.input.amount}}"
             watch-var="orderResult"></div>
        <br/>
        <p class="text-danger">
            Orders that take too long will have to be processed manually &amp; and may delay the amount of time it takes
            to receive your coins.
            <br/>
            <a href="https://shapeshift.io/#/btcfee" target="_blank" rel="noopener">Please use the recommended TX fees
                seen here.</a>
        </p>

    </section>


</article>
