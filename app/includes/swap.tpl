<!-- Swap Page -->
<main class="tab-pane swap-tab active" ng-if="globalService.currentTab === globalService.tabs.swap.id"
      ng-controller='swapCtrl' ng-cloak>
    <div ng-switch="stage">

        <div ng-switch-default>

            @@if (site === 'cew' ) { @@include( '../includes/swap-stage-1.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/swap-stage-1.tpl', { "site": "cx" } ) }
        </div>

        <div ng-switch-when="2">
            @@if (site === 'cew' ) { @@include( '../includes/swap-stage-2.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/swap-stage-2.tpl', { "site": "cx" } ) }

        </div>
        <div ng-switch-when="3">
            @@if (site === 'cew' ) { @@include( '../includes/swap-stage-3.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/swap-stage-3.tpl', { "site": "cx" } ) }
        </div>
    </div>


    <section class="changenow-contact text-center">




        <div ng-show="orderResult && orderResult.id" ng-init="showDetails = false;" class="marg-v-md">

            <div class="d-flex align-items-center justify-content-center">
                <button class="btn" ng-click="showDetails = !showDetails;">
                    Swap Details
                </button>
            </div>
            <div ng-show="showDetails">
                <label for="orderResult">
                    Order
                    <a href="{{'https://changenow.io/exchange/txs/' + orderResult.id}}" target="_blank" rel="noopener">
                        {{orderResult.id}}
                    </a>
                </label>
                <textarea readonly class="form-control" name="orderResult" id="orderResult" rows="8">
                {{orderResult | json}}
            </textarea>
            </div>
        </div>
        <p><a class="btn-warning btn-sm"
              href={{mailHref()}}
              target="_blank" rel="noopener"> Issue with your Swap? Contact support</a></p>
        <p ng-click="swapIssue = !swapIssue" style="cursor: pointer; ">
            <small>Click here if link doesn't work</small>
        </p>
        <textarea class="form-control input-sm" rows="9" ng-show="swapIssue" style="max-width: 35rem;margin: auto;">
            {{TEXT()}}

        </textarea>

    </section>

</main>
<!-- / Swap Page -->




