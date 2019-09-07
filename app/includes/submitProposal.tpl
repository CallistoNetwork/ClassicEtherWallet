<div
  ng-if="globalService.currentTab === globalService.tabs.submitProposal.id"
  ng-controller=''
>
  <h1>
      <span translate="NAV_Submit_Proposal">Submit Proposal</span>
  </h1>
  <div class="">
    <article class="form-group" ng-show="!wd">
        @@if (site === 'cx' ) {
        <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
        }
        @@if (site === 'cew' ) {
        <wallet-decrypt-drtv></wallet-decrypt-drtv>
        }
    </article>
    <!-- Interact Contracts -->
    <div ng-show="visibility === 'interactView'">
      <article class="row block">
        @@if (site === 'cew' ) { @@include( '../includes/contracts-interact-1.tpl', { "site": "cew" } ) }
        @@if (site === 'cx' ) { @@include( '../includes/contracts-interact-1.tpl', { "site": "cx" } ) }
      </article>
      <article class="row block" ng-show="showReadWrite">
        @@if (site === 'cew' ) { @@include( '../includes/contracts-interact-2.tpl', { "site": "cew" } ) }
        @@if (site === 'cx' ) { @@include( '../includes/contracts-interact-2.tpl', { "site": "cx" } ) }
      </article>
    <!-- / Interact Contracts -->
    </div>
  </div>
</div>
