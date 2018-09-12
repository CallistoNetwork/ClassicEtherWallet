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


<!-- Swap Init Panel -->
<article class="swap-panel block clearfix">

    <h1 translate="SWAP_init_1"> I want to swap my </h1>
    <br/>
    <input class="form-control width_10_rem"
           type="text"
           ng-change="updateEstimate(true)"
           placeholder="{{ 'SEND_amount_short' | translate }}"
           ng-model="swapOrder.fromVal"
           ng-model-options="{ debounce: 750 }"
           ng-class="Validator.isPositiveNumber(swapOrder.fromVal) ? 'is-valid' : 'is-invalid'"
    />
    <div class="dropdown">
        <a class="btn btn-default dropdown-toggle" ng-click="toggleDropdown(true)">
            <coin-icon icon="{{swapOrder.fromCoin.toLowerCase()}}">

            </coin-icon>
            <span>
            <i class="caret"></i>
        </span>
        </a>
        <ul class="dropdown-menu dropdown-menu-right list-group swap_dropdown"
            ng-show="dropdownFrom"
        >
            <li class="list-group-item">
                <form ng-submit="handleSubmit(true); input.fromCoin = '';">
                    <input
                        autofocus
                        autocomplete="off"
                        id="fromCoin"
                        class="form-control form-small-pd"
                        ng-model="input.fromCoin"
                        placeholder="type a currency"
                    />
                    <input hidden type="submit"/>

                </form>

            </li>
            <li class="list-group-item" ng-repeat="coin in filterCoins(input.fromCoin) track by coin.ticker">
                <a
                    ng-click="setOrderCoin(true, coin.ticker)"
                >

                    <div class="row flex-center">
                        <div class="text-lg col-xs-4 text-center"
                             style="padding: 5px;">
                            <coin-icon icon="{{coin.ticker.toLowerCase()}}"/>
                        </div>
                        <div class="col-xs-8 overflow-text">
                            <small>{{coin.name}}</small>
                        </div>
                    </div>
                </a>
            </li>
        </ul>
    </div>

    <h1 translate="SWAP_init_2"> for </h1>
    <input class="form-control width_10_rem"
           placeholder="{{ 'SEND_amount_short' | translate }}"
           ng-change="updateEstimate(false)"
           ng-model-options="{ debounce: 750 }"
           ng-model="swapOrder.toVal"
           ng-class="Validator.isPositiveNumber(swapOrder.toVal) ? 'is-valid' : 'is-invalid'"
    />


    <div class="dropdown">
        <a class="btn btn-default dropdown-toggle" ng-click="toggleDropdown(false)">
            <coin-icon icon="{{swapOrder.toCoin.toLowerCase()}}">
            </coin-icon>
            <span>
            <i class="caret"></i>
        </span>
        </a>
        <ul class="dropdown-menu dropdown-menu-right swap_dropdown" ng-show="dropdownTo">
            <li class="list-group-item pointer">
                <form
                    ng-submit="handleSubmit(false); input.toCoin = '';">
                    <input
                        class="form-control form-small-pd"
                        id="toCoin"
                        autocomplete="off"
                        type="text"
                        min="0"
                        autofocus
                        ng-model="input.toCoin"
                        placeholder="type a currency"
                    />
                    <input type="submit" hidden/>
                </form>
            </li>

            <li class="list-group-item pointer" ng-repeat="coin in filterCoins(input.toCoin) track by coin.ticker">
                <a
                    ng-class="{true:'active'}[coin.ticker.toUpperCase() === swapOrder.toCoin.toUpperCase()]"
                    ng-click="setOrderCoin(false, coin.ticker);"
                >

                    <div class="row flex-center">
                        <div class="text-lg col-xs-4 text-center"
                             style="padding: 5px;">
                            <coin-icon icon="{{coin.ticker.toLowerCase()}}"/>

                        </div>
                        <div class="col-xs-8 overflow-text">
                            <small>{{coin.name}}</small>
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
