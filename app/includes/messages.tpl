<new-messages-drtv></new-messages-drtv>


@@include( '../includes/sendMessageModal.tpl', { "site": "cew" } )


<main class="tab-pane active"

      ng-if="globalService.tabs.messages.id === globalService.currentTab"
>


    <!-- Unlock Wallet -->
    <article class="collapse-container">
        <div ng-click="unlockWallet = !unlockWallet">


            <h1>

                 <span
                     style="margin: 0; padding: 0 2px;"
                     class="collapse-button glyphicon"
                     ng-class="wd ? 'glyphicon-plus' : 'glyphicon-minus'"
                 ></span>
                <span translate="NAV_Messages">
                    Messages
                </span>
            </h1>
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
            <span>
                or
                <a

                        translate="NAV_NEW_MESSAGE"
                        ng-class="{'isActive': visibility === VISIBILITY.NEW}"
                        ng-click="setVisibility(VISIBILITY.NEW)"> New Message </a>

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
             ng-if="[VISIBILITY.NEW, VISIBILITY.CONVERSATION].includes(visibility)">

        @@if (site === 'cew' ) { @@include( '../includes/messages-new.tpl', { "site": "cew" } ) }
        @@if (site === 'cx' ) { @@include( '../includes/messages-new.tpl', { "site": "cx" } ) }

    </article>


</main>

