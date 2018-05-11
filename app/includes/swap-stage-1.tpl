<!-- Swap Rates Panel -->
<article class="swap-rates" ng-show="showStage1">

    <!-- Title -->
    <section class="row">
        <h5 class="col-xs-6 col-xs-offset-3" translate="SWAP_rates"> Current Rates </h5>
    </section>
    <!-- Title -->

    <!-- Colored Columns -->
    <section class="row order-panel">
        <div class="col-sm-6 order-info">
            <p class="mono">
                <input class="form-control input-sm" ng-value="priceTicker.ETCBTC | number: 6"/>
                <span>ETC = 1 BTC</span>
            </p>
        </div>
        <div class="col-sm-6 order-info">
            <p class="mono">
                <input class="form-control input-sm" ng-value="priceTicker.BTCETC | number:6"/>
                <span>BTC = 1 ETC</span>
            </p>
        </div>


        <a class="link bity-logo" href={{changeNow.affiliateLink}} target="_blank" rel="noopener">
            <h1>Change Now!</h1>

        </a>
    </section>
    <!-- / Colored Columns -->

</article>
<!-- / Swap Rates Panel -->


<!-- Swap Init Panel -->
<article class="swap-panel block clearfix" ng-show="showStage1">

    <h1 translate="SWAP_init_1"> I want to swap my </h1>

    <br/>

    <input class="form-control"
           type="text"
           placeholder="{{ 'SEND_amount_short' | translate }}"
           ng-change="updateEstimate(true)"
           ng-model="swapOrder.fromVal"
           ng-model-options="{ debounce: 200 }"
           ng-click="showedMinMaxError = false"
           ng-class="Validator.isPositiveNumber(swapOrder.fromVal) ? 'is-valid' : 'is-invalid'"/>


    <span class="dropdown">
    <a class="btn btn-default dropdown-toggle" ng-click="dropdownFrom = !dropdownFrom">{{swapOrder.fromCoin.toUpperCase()}}<i
            class="caret"></i></a>
    <ul class="dropdown-menu dropdown-menu-right list-group" ng-show="dropdownFrom">
      <li class="list-group-item" ng-repeat="coin in availableCoins track by $index">
        <a ng-class="{true:'active'}[coin.ticker.toUpperCase() === swapOrder.fromCoin.toUpperCase()]"
           ng-click="setOrderCoin(true, coin.ticker)">

            <div class="row" style="
    display: flex;
    justify-content: center;
    align-items: center;
">
                <div class="col-xs-4 text-center" style="padding: 5px;">

            <img src="{{coin.image}}" alt="" style="width: 36px; height: 36px;"/>
            </div>
            <div class="col-xs-8">

            {{coin.ticker.toUpperCase()}}
            </div>
            </div>
        </a>
      </li>
    </ul>
  </span>

    <h1 translate="SWAP_init_2"> for </h1>

    <input class="form-control"
           type="text"
           placeholder="{{ 'SEND_amount_short' | translate }}"
           ng-change="updateEstimate(false)"
           ng-model-options="{ debounce: 200 }"
           ng-model="swapOrder.toVal"
           ng-click="showedMinMaxError = false"
           ng-class="Validator.isPositiveNumber(swapOrder.toVal) ? 'is-valid' : 'is-invalid'"/>

    <div class="dropdown">
        <a class="btn btn-default dropdown-toggle" ng-click="dropdownTo = !dropdownTo">{{swapOrder.toCoin.toUpperCase()}}<i
                class="caret"></i></a>
        <ul class="dropdown-menu dropdown-menu-right" ng-show="dropdownTo">
            <li class="list-group-item" ng-repeat="coin in availableCoins track by $index">
                <a ng-class="{true:'active'}[coin.ticker.toUpperCase() === swapOrder.fromCoin.toUpperCase()]"
                   ng-click="setOrderCoin(false, coin.ticker)">

                    <div class="row" style="
    display: flex;
    justify-content: center;
    align-items: center;
">
                        <div class="col-xs-4 text-center" style="padding: 5px;">

                            <img src="{{coin.image}}" alt="" style="width: 36px; height: 36px;"/>
                        </div>
                        <div class="col-xs-8">

                            {{coin.ticker.toUpperCase()}}
                        </div>
                    </div>
                </a>
            </li>
        </ul>
    </div>

    <div class="col-xs-12 clearfix text-center">
        <a ng-click="setFinalPrices()" class="btn btn-info btn-primary">
            <span translate="SWAP_init_CTA"> Let's do this! </span>
        </a>
    </div>

</article>
<!-- / Swap Init Panel -->
