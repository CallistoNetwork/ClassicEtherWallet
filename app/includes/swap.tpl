<!-- Swap Page -->
<main class="tab-pane swap-tab active" ng-if="globalService.currentTab ===globalService.tabs.swap.id"
      ng-controller='swapCtrl' ng-cloak>


    <!--<script type="text/javascript" src="https://changenow.io/dist/popup-widget.v1.js"></script>-->
    <!--<iframe width="478" height="280"-->
    <!--src="https://changenow.io/embeds/exchange-widget/v1?amount=1&from=btc&link_id=ace83609250351&to=xmr"-->
    <!--frameborder="0" scrolling="no" style="overflow-y: hidden;">Can't load widget-->
    <!--</iframe>-->


    <!--<a href="https://changenow.io/exchange?amount=1&from=btc&link_id=ace83609250351&to=xmr" target="_blank"><img-->
            <!--src="https://changenow.io/images/embeds/button.svg" alt="ChangeNOW button"></a>-->

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

    <section class="bity-contact text-center">
        <p><a class="btn-warning btn-sm"
              href={{mailHref()}}
              target="_blank" rel="noopener"> Issue with your Swap? Contact support</a></p>
        <p ng-click="swapIssue = !swapIssue">
            <small>Click here if link doesn't work</small>
        </p>
        <!--<textarea class="form-control input-sm" rows="9" ng-show="swapIssue" style="max-width: 35rem;margin: auto;">To: support@bity.com, support@myetherwallet.com-->
        <!--Subject: {{orderResult.reference}} - Issue regarding my Swap via MEW-->
        <!--Message:-->
        <!--REF ID#: {{orderResult.reference}}-->
        <!--Amount to send: {{orderResult.input.amount}} {{orderResult.input.currency}}-->
        <!--Amount to receive: {{orderResult.output.amount}} {{orderResult.output.currency}}-->
        <!--Payment Address: {{orderResult.payment_address}}-->
        <!--Receiving Address: {{swapOrder.toAddress}}-->
        <!--Rate: {{swapOrder.swapRate}} {{swapOrder.swapPair}}</textarea>-->
    </section>

</main>
<!-- / Swap Page -->




