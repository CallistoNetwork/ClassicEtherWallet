<div class="messagesConversation">
    <h2>{{messageService.messagesConversation[0].from}}
        <span class="addressIdenticon med float" title="Address Indenticon"
              blockie-address="{{messageService.messagesConversation[0].from}}"></span>
    </h2>
    <hr/>
    <ol class="list-group">
        <li
                class="list-group-item"
                ng-repeat="message in messageService.messagesConversation | orderBy: '+time' track by $index">
            <div class="row">
                {{message.time | date: 'yyyy-MM-dd HH:mm:ss'}}
            </div>
            <p class="message_text">{{message.text}}</p>
            <hr/>
        </li>
    </ol>
</div>
