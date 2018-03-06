<section class="messagesList">
    <h2>Inbox</h2>
    <ul class="list-group">
        <li

                class="list-group-item pointer"
                ng-repeat="message in messagesList"
                ng-click="viewMessagesConversation(message[0].from)"

        >
            <div class="row">
                <div class="col-sm-9 row justify_row">
                    <div class="addressIdenticon med float" title="Address Indenticon"
                         blockie-address="{{message[0].from}}"></div>
                    <span class="from">{{message[0].from}}</span>


                    </span>
                </div>
                <div class="col-sm-3">
            <span


            >{{message[0].time | date: 'yyyy-MM-dd HH:mm:ss Z'}}</span>
                    <span
                            ng-class="message[0].time >= messageDateThreshold ? 'dot dot-success' : 'dot dot-info'"
                    ></span>
                </div>

            </div>
            <p class="message_text">{{message[0].text}}</p>
            <hr/>
        </li>
    </ul>
</section>



