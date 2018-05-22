<!-- Swap Start 2 -->
<article class="swap-start">


    <!-- Title -->
    <section class="row">
        <h5 class="col-sm-6 col-sm-offset-3" translate="SWAP_information">Your Information</h5>
        <div class="col-sm-3">

            <a href="{{changeNow.exchangeLink(swapOrder.fromCoin, swapOrder.toCoin, swapOrder.fromVal)}}"
               rel="noopener"
               target="_blank">
                <img src="https://changenow.io/images/embeds/button.svg" alt="ChangeNOW button">
            </a>
        </div>
    </section>
    <!-- Title -->


    <!-- Info Row -->
    <section class="order-info-wrap row">
        <div class="col-sm-4 order-info">
            <h4> {{swapOrder.fromVal}} {{swapOrder.fromCoin.toUpperCase()}} </h4>
            <p translate="SWAP_send_amt"> Amount to send </p>
        </div>
        <div class="col-sm-4 order-info">
            <h4> {{swapOrder.toVal}} {{swapOrder.toCoin.toUpperCase()}} </h4>
            <p translate="SWAP_rec_amt"> Amount to receive </p>
        </div>
        <div class="col-sm-4 order-info">
            <h4> {{swapOrder.fromVal / swapOrder.toVal | number: 6}} {{swapOrder.fromCoin.toUpperCase() + ' / ' +
                swapOrder.toCoin.toUpperCase()}} </h4>
            <p translate="SWAP_your_rate"> Your rate </p>
        </div>
    </section>
    <!-- / Info Row -->


    <!-- Your Address -->
    <section class='swap-address block'>
        <form ng-submit="openOrder();">

            <div class="row">
                <div class="col-sm-8 col-sm-offset-2">


                    <label>
                        <span translate="SWAP_rec_add">Your Receiving Address</span>
                        <strong>
                            (<span class="{{'icon icon-' + swapOrder.toCoin.toLowerCase()}}"></span>
                            {{swapOrder.toCoin.toUpperCase()}})
                        </strong>
                    </label>


                    <div ng-switch="ethCoins.includes(swapOrder.toCoin.toUpperCase())">

                        <div class="form-group" ng-switch-when="true">
                            <address-field placeholder="0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8"
                                           var-name="swapOrder.toAddress"></address-field>
                        </div>


                        <div ng-switch-default>


                            <div ng-switch="swapOrder.toCoin.toUpperCase() === 'BTC'">

                                <input class="form-control"
                                       ng-switch-when="true"
                                       type="text"
                                       placeholder="1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6"
                                       ng-model="swapOrder.toAddress"
                                       ng-class="Validator.isValidBTCAddress(swapOrder.toAddress) ? 'is-valid' : 'is-invalid'"
                                />


                                <input class="form-control"
                                       type="text"
                                       required
                                       ng-switch-default
                                       placeholder="{{'type ' + swapOrder.toCoin + ' address'}}"
                                       ng-model="swapOrder.toAddress"
                                />

                            </div>
                        </div>


                    </div>
                </div>
            </div>
            <!-- /Your Address -->
            <!-- CTA -->
            <div class="row text-center">
                <button type="submit" class="btn btn-primary btn-lg"><span
                        translate="SWAP_start_CTA"> Start Swap </span></button>
            </div>
        </form>
        <!-- / CTA -->
    </section>


</article>
<!-- / Swap Start 2 -->
