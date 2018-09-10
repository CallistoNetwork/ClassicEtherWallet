<main class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.viewWalletInfo.id"
      ng-controller='viewWalletCtrl' ng-cloak>

    <article class="collapse-container">

        <div ng-click="wd = !wd">


            <h1>
                <span
                    style="margin: 0; padding: 0 2px;"
                    class="collapse-button glyphicon"
                    ng-class="wd ? 'glyphicon-plus' : 'glyphicon-minus'"
                >

                </span>
                <span translate="NAV_ViewWallet">View Wallet Details</span>
            </h1>
        </div>

        <div ng-show="!wd">
            <p translate="VIEWWALLET_Subtitle">
                This page allows you to download different versions of private keys and re-print your paper wallet. You
                may want to do this in order to [import your account into
                Geth/Mist](http://ethereum.stackexchange.com/questions/465/how-to-import-a-plain-private-key-into-geth/).
                If you want to check your balance, we recommend using a blockchain explorer like <a
                href="http://etherscan.io/" target="_blank" rel="noopener">etherscan.io</a>.
            </p>
            <div ng-show="!wd">
                @@if (site === 'cx' ) {
                <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
                }
                @@if (site === 'cew' ) {
                <wallet-decrypt-drtv></wallet-decrypt-drtv>
                }
            </div>
        </div>

    </article>

    <article class="row" ng-show="wallet!=null">


        @@if (site === 'cx' ) { @@include( './viewWalletInfo-content.tpl', { "site": "cx" } ) }
        @@if (site === 'cew') { @@include( './viewWalletInfo-content.tpl', { "site": "cew" } ) }

    </article>

</main>
