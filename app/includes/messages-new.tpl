<form ng-submit="handleSubmitNewMessage($event)">

    <div ng-if="[VISIBILITY.NEW].includes(visibility)">

        <div class="row">


            <div class="col-xs-11">
                <div class="account-help-icon">
                    <img src="images/icon-help.svg" class="help-icon"/>
                    <p class="account-help-text" translate="x_AddessDesc">You may know this as your "Account #" or
                        your "Public Key". It's what you send people so they can send you ETH. That icon is an easy
                        way to recognize your address.</p>
                    <h5 translate="SEND_addr">To Address:</h5>
                </div>
                <div class="col-xs-11">
                    <input ng-class="validateAddress() ? 'form-control is-valid' : 'form-control is-invalid'"
                           placeholder="0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8"
                           name="to"
                           ng-model="newMessage.to"
                    />
                </div>
            </div>

            <div class="col-xs-1 address-identicon-container">

                <div
                        class="addressIdenticon med"
                        title="Address Indenticon"
                        blockie-address="{{newMessage.to}}"
                        watch-var="newMessage.to"

                ></div>
            </div>


        </div>


    </div>

    <div ng-if="[VISIBILITY.CONVERSATION].includes(visibility)" class="row">
        <div class="row">

            <div class="col-xs-2" style="max-width: 70px;">
                <div class="addressIdenticon med float" title="Address Indenticon"
                     blockie-address="{{messagesConversation[0].from}}"></div>
            </div>
            <div class="col-sm-10">
                <input

                        class="form-control" readonly name="to" value="{{messagesConversation[0].from}}"/>
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
