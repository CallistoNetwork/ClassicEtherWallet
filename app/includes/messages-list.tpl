<section class="messagesList">
    <h2>Inbox</h2>
    <ul class="list-group">

        <li ng-if="!loadingMessages && empty()">No messages found for {{wallet.getAddressString()}}</li>

        <p ng-if="loadingMessages">
            LOADING...
        </p>
        <p ng-if="!loadingMessages && msgCheckTime">
            last checked: {{msgCheckTime}}
        </p>


        <li

                class="list-group-item pointer"
                ng-repeat="message in messagesList"
                ng-click="viewMessagesConversation(message[0].from)"

        >
            <div class="row">
                <div class="col-sm-9 row justify_row">
                    <div class="address-identicon-container">

                        <div class="addressIdenticon med float" title="Address Indenticon"
                             blockie-address="{{message[0].from}}"></div>
                    </div>
                    <span class="from">{{message[0].from}}</span>


                    </span>
                </div>
                <div class="col-sm-3">
                    <div class="row">
                        <span


                        >{{message[0].time | date: 'yyyy-MM-dd HH:mm:ss'}}</span>
                    </div>
                    <div class="row">
                        <b>New Messages: </b>
                        <b
                                ng-class="numberOfNewMessagesFrom(message[0].from, message[0].to) > 0 ? 'text-success' : 'text-gray'"
                        >

                            {{numberOfNewMessagesFrom(message[0].from, message[0].to)}}
                        </b>
                    </div>
                    <div>
                    </div>
                </div>

            </div>
            <p class="message_text">{{message[0].text}}</p>
            <hr/>
        </li>
    </ul>
</section>



