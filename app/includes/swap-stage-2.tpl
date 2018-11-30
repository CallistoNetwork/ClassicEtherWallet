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
            <h4> {{swapOrder.fromVal}}
                <coin-icon icon="{{swapOrder.fromCoin.toLowerCase()}}"/>
            </h4>
            <p translate="SWAP_send_amt"> Amount to send </p>
        </div>
        <div class="col-sm-4 order-info">
            <h4>
                {{swapOrder.toVal}}
                <coin-icon icon="{{swapOrder.toCoin.toLowerCase()}}"/>
            </h4>
            <p translate="SWAP_rec_amt"> Amount to receive </p>
        </div>
        <div class="col-sm-4 order-info">
            <h4>
                {{swapOrder.fromVal / swapOrder.toVal | number: 6}}
                <coin-icon icon="{{swapOrder.fromCoin.toLowerCase()}}">
                </coin-icon>
                {{' / '}}
                <coin-icon icon="{{swapOrder.toCoin.toLowerCase()}}">
                </coin-icon>
            </h4>

            <h4>
                {{swapOrder.toVal / swapOrder.fromVal | number: 6}}
                <coin-icon icon="{{swapOrder.toCoin.toLowerCase()}}">
                </coin-icon>
                {{' / '}}
                <coin-icon icon="{{swapOrder.fromCoin.toLowerCase()}}">
                </coin-icon>
            </h4>
            <p translate="SWAP_your_rate"> Your rate </p>
        </div>
    </section>
    <!-- / Info Row -->


    <!-- Your Address -->
    <section class='swap-address block'>


        <div ng-show="initilizingOrder">
            <h3>Processing Order</h3>
            <div class="bouncing-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>


        <form name="swapOpenOrderForm" novalidate swap-open-order-form ng-submit="openOrder();">
        </form>
        <!-- / CTA -->
    </section>


</article>
<!-- / Swap Start 2 -->
