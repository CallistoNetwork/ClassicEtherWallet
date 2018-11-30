<main class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.offlineTransaction.id" ng-controller='offlineTxCtrl' ng-cloak style="max-width:1000px; margin: auto">

  <h1 translate="OFFLINE_Title"> Generate & Send Offline Transaction </h1>

  @@if (site === 'cew' ) { @@include( './offlineTx-1.tpl',     { "site": "cew" } ) }
  @@if (site === 'cx'  ) { @@include( './offlineTx-1.tpl',     { "site": "cx"  } ) }

  @@if (site === 'cew' ) { @@include( './offlineTx-2.tpl',     { "site": "cew" } ) }
  @@if (site === 'cx'  ) { @@include( './offlineTx-2.tpl',     { "site": "cx"  } ) }

  @@if (site === 'cew' ) { @@include( './offlineTx-3.tpl',     { "site": "cew" } ) }
  @@if (site === 'cx'  ) { @@include( './offlineTx-3.tpl',     { "site": "cx"  } ) }

  @@if (site === 'cew' ) { @@include( './offlineTx-modal.tpl', { "site": "cew" } ) }
  @@if (site === 'cx'  ) { @@include( './offlineTx-modal.tpl', { "site": "cx"  } ) }

</main>
