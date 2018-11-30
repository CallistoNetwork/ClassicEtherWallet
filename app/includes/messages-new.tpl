<form ng-submit="handleSubmitNewMessage($event)">

    <div ng-if="[VISIBILITY.NEW].includes(visibility)" class="row">


        <address-field
            var-name="newMessage.to"
        ></address-field>

    </div>

    <div ng-if="[VISIBILITY.CONVERSATION].includes(visibility)" class="row">
        <div class="row">

            <div class="col-xs-2" style="max-width: 70px;">
                <div class="addressIdenticon med float" title="Address Indenticon"
                     blockie-address="{{messageService.messagesConversation[0].from}}"></div>
            </div>
            <div class="col-sm-10">

                <input

                    title="to"
                    class="form-control" readonly name="to" value="{{messageService.messagesConversation[0].from}}"/>
            </div>

        </div>
    </div>

    <textarea rows="5"
              class="form-control"
              name="message"
              ng-class="newMessage.text ? 'is-valid' : 'is-invalid'"
              ng-model="newMessage.text"
              placeholder="message"
    >

        </textarea>


    <button
        class="btn btn-primary"
        type="submit"
    >
        Send
    </button>

</form>
