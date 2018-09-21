<!-- Swap Rates Panel -->
<article class="swap-rates">

    <!-- Title -->
    <section class="row">
        <h5 class="col-xs-6 col-xs-offset-3" translate="SWAP_rates"> Current Rates </h5>
    </section>
    <!-- Title -->

    <!-- Colored Columns -->
    <section class="row order-panel">
        <div class="col-sm-4 order-info">
            <p class="mono">
                <input class="form-control input-sm" ng-value="priceTicker.ETCBTC | number: 6"
                       style="min-width: 100px; padding: 0;"/>
                <span>ETC = 1 BTC</span>
            </p>
        </div>
        <div class="col-sm-4 order-info">
            <a class="link"
               href="{{changeNow.exchangeLink(swapOrder.fromCoin, swapOrder.toCoin, swapOrder.fromVal)}}"
               target="_blank"
               rel="noopener">
                <img src="https://changenow.io/images/embeds/button.svg" alt="ChangeNOW button">
            </a>
        </div>
        <div class="col-sm-4 order-info">
            <p class="mono">
                <input class="form-control input-sm" ng-value="priceTicker.BTCETC | number:6"
                       style="min-width: 100px; padding: 0;"/>
                <span>BTC = 1 ETC</span>
            </p>
        </div>


    </section>
    <!-- / Colored Columns -->

</article>
<!-- / Swap Rates Panel -->


<form ng-submit="setFinalPrices()" name="swapInitForm" swap-init-form novalidate>
</form>
