<div>
    <h2>{{messagesConversation[0].from}}</h2>
    <div class="addressIdenticon med float" title="Address Indenticon"
         blockie-address="{{messagesConversation[0].from}}"></div>


    <ul class="list-group">
        <li
                class="list-group-item"
                ng-repeat="message in messagesConversation track by $index">
            <div class="row">
                {{message.time | date: 'yyyy-MM-dd HH:mm:ss Z'}}
            </div>
            <p class="message_text">{{message.text}}</p>
            <hr/>
        </li>
    </ul>
</div>
