<main class="tab-pane active"
      ng-if="[globalService.tabs.messages.id].includes(globalService.currentTab)"
      ng-controller='messagesCtrl'
      ng-cloak
>


    @@if (site === 'cew' ) { @@include( '../includes/sendMessageModal.tpl', { "site": "cew" } ) }
    @@if (site === 'cx' ) { @@include( '../includes/sendMessageModal.tpl', { "site": "cx" } ) }


    <div ng-if="globalService.tabs.messages.id === globalService.currentTab">


        <!-- Unlock Wallet -->
        <article class="collapse-container">
            <div ng-click="unlockWallet = !unlockWallet">
                <a class="collapse-button"><span ng-show="unlockWallet" class="ng-hide">+</span><span
                        ng-show="!unlockWallet" class="">-</span></a>

                <h1 translate="NAV_Messages" class="ng-scope">Messages</h1>
            </div>
            <div ng-show="!unlockWallet">
                @@if (site === 'cx' ) {
                <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
                }
                @@if (site === 'cew' ) {
                <wallet-decrypt-drtv></wallet-decrypt-drtv>
                }
            </div>

        </article>


        <!-- Title -->
        <div class="block text-center">
            <h1>
                <a translate="NAV_LIST" ng-class="{'isActive': visibility === VISIBILITY.LIST}"
                   ng-click="setVisibility(VISIBILITY.LIST)"> List </a>
                <span ng-if="wallet.type !== 'addressOnly'">
                or
                <a
                        translate=" NAV_NEW_MESSAGE"
                        ng-class="{'isActive': visibility === VISIBILITY.NEW, 'disabled': wallet.type === 'addressOnly'}"
                        ng-click="wallet.type !== 'addressOnly' && setVisibility(VISIBILITY.NEW)"> New Message </a>

                </span>
            </h1>
        </div>
        <!-- / Title -->


        <!-- Message List-->
        <article class="row block" ng-if="visibility === VISIBILITY.LIST">

            @@if (site === 'cew' ) { @@include( '../includes/messages-list.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/messages-list.tpl', { "site": "cx" } ) }

        </article>


        <!-- Conversation w/ 1 addr -->
        <article class="row block" ng-if="visibility === VISIBILITY.CONVERSATION">

            @@if (site === 'cew' ) { @@include( '../includes/messages-conversation.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/messages-conversation.tpl', { "site": "cx" } ) }

        </article>


        <!--New Message-->
        <article class="row block"
                 ng-if="[VISIBILITY.NEW, VISIBILITY.CONVERSATION].includes(visibility) && wallet.type !== 'addressOnly'">

            @@if (site === 'cew' ) { @@include( '../includes/messages-new.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/messages-new.tpl', { "site": "cx" } ) }

        </article>


    </div>
</main>
