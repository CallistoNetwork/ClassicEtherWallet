<section class="messagesList">
    <h2>
        Inbox

        <small>
            <span class="label label-default"
            >
            {{messageService.numberOfMessages(walletService.wallet.getAddressString())}}
            <span translate="total">
                total
            </span>
        </span>
            <span
                ng-class="0 < messageService.numberOfNewMessages() ? 'label label-success' : 'label label-default'"
            >
            {{messageService.numberOfNewMessages(walletService.wallet.getAddressString())}}
            <span translate="total">
                total
            </span>
        </span>
        </small>

    </h2>

    <ul class="list-group">

        <li ng-if="!messageService.loadingMessages && empty()">
            No messages found for
            <a href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', walletService.wallet.getChecksumAddressString())}}"
               target="_blank"
               rel="noopener">
                {{walletService.wallet.getChecksumAddressString()}}
            </a>
        </li>

        <li ng-if="messageService.loadingMessages">
            <div class="bouncing-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <small class="pull-right" ng-if="!messageService.loadingMessages && messageService.msgCheckTime">
                last checked: {{messageService.msgCheckTime}}
            </small>
        </li>


        <li

            class="list-group-item pointer"
            ng-repeat="message in messageService.messagesList"
            ng-click="viewMessagesConversation(message[0].from)"

        >
            <div class="row">
                <div class="col-sm-12 row d-flex" style="justify-content: flex-start">
                    <h5 style="padding-right: 1rem;">From</h5>
                    <div class="address-identicon-container" style="padding-right: 1rem;">

                        <div class="addressIdenticon med float" title="Address Indenticon"
                             blockie-address="{{message[0].from}}"></div>
                    </div>
                    <span class="from" style="padding-right: 1rem;">
                            {{ethUtil.toChecksumAddress(message[0].from)}}
                    </span>


                </div>

            </div>
            <div class="row">


                  <span
                      class="label label-default"
                  >

                            {{messageService.numberOfMessages(message[0].to, message[0].from)}}
                            total
                        </span>
                <span
                    ng-class="0 < messageService.numberOfNewMessages(message[0].to, message[0].from) ? 'label label-success' : 'label label-default'"
                >

                            {{messageService.numberOfNewMessages(message[0].to, message[0].from)}}
                            new
                        </span>
            </div>
            <p class="message_text">
                {{message[0].text}}
                <span class="pull-right">
                     {{message[0].time | date}}
                </span>
            </p>
            <hr/>
        </li>
    </ul>
</section>



