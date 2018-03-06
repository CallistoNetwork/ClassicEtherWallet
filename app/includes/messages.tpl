
<main class="tab-pane active"
      ng-if="globalService.currentTab == globalService.tabs.messages.id"
      ng-controller='messagesCtrl'
      ng-cloak
>




    <!-- Title -->
    <div class="block text-center">
        <h1>
            <a translate="NAV_LIST" ng-class="{'isActive': visibility == 'list'}" ng-click="setVisibility('list')"> List </a>
            or
            <a translate="NAV_NEW_MESSAGE"  ng-class="{'isActive': visibility == 'new'}" ng-click="setVisibility('new')"> New Message </a>
        </h1>
    </div>
    <!-- / Title -->


    <!-- Interact Contracts -->
    <article class="row block" ng-if="visibility === 'list'">

        @@if (site === 'cew' ) { @@include( '../includes/messages-list.tpl', { "site": "cew" } ) }
        @@if (site === 'cx'  ) { @@include( '../includes/messages-list.tpl', { "site": "cx"  } ) }

    </article>


    <!-- Interact Contracts -->
    <article class="row block" ng-if="visibility === 'conversation'">

        @@if (site === 'cew' ) { @@include( '../includes/messages-conversation.tpl', { "site": "cew" } ) }
        @@if (site === 'cx'  ) { @@include( '../includes/messages-conversation.tpl', { "site": "cx"  } ) }

    </article>





    <!--<article class="row block" ng-show="visibility=='details'">-->

    <!--@@if (site === 'cew' ) { @@include( '../includes/messages-details.tpl', { "site": "cew" } ) }-->
    <!--@@if (site === 'cx'  ) { @@include( '../includes/messages-details.tpl', { "site": "cx"  } ) }-->

    <!--</article>-->


     <!--New Message-->
    <article class="row block" ng-if="['new', 'conversation'].includes(visibility)">

    @@if (site === 'cew' ) { @@include( '../includes/messages-new.tpl', { "site": "cew" } ) }
    @@if (site === 'cx'  ) { @@include( '../includes/messages-new.tpl', { "site": "cx"  } ) }

    </article>


</main>
