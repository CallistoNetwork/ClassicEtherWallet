const _uniqueBy = require("lodash/uniqBy");

const messageSet = messages =>
    _uniqueBy(messages, message => message.to + message.index);

const MESSAGE_STALING_PERIOD = 2160000; // 25 days

const LOCAL_STORAGE_KEY = "@messages@";

const CONTRACT_ADDRESS = "0x6A77417FFeef35ae6fe2E9d6562992bABA47a676";

class Message {
    constructor({ from, to, text, time, index }) {
        this.from = from;
        this.to = to;

        this.text = text;
        this.time = time;

        this.index = index;
    }
}

const messageService = function() {
    this.MESSAGE_STALING_PERIOD = MESSAGE_STALING_PERIOD; // 25 days

    this.message_staling_period = new Date(
        new Date().getTime() - MESSAGE_STALING_PERIOD * 1000
    ).getTime();

    var CONTRACT = nodes.nodeList.etc_ethereumcommonwealth_geth.abiList.find(
        contract =>
            contract.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
    );

    if (!CONTRACT) {
        throw new Error("ERROR FINDING CONTRACT: " + CONTRACT_ADDRESS);
    }

    this.CONTRACT = Object.assign({}, CONTRACT, {
        abi: JSON.parse(CONTRACT.abi)
    });

    this.saveMessages = function saveMessages() {
        let messageSet_ = messageSet(this.messages);

        globalFuncs.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(messageSet_)
        );
    };

    this.mapMessagesToMessageList = function mapMessagesToMessageList(addr) {
        // console.log(messageService.messages);

        const sorted = this.messages
            .filter(message => message.to === addr)
            .sort((a, b) => b.time - a.time);

        this.messagesList = sorted.reduce((accum_, message) => {
            if (!accum_[message.from]) {
                accum_[message.from] = [message];
            } else accum_[message.from].push(message);

            return accum_;
        }, {});
    };

    this.numberOfNewMessages = function numberOfNewMessages(to, from = null) {
        //console.log('new messages', new Date($scope.message_staling_period));

        if (from) {
            return this.messages.filter(
                message =>
                    message.to === to &&
                    message.from === from &&
                    this.message_staling_period < message.time
            ).length;
        }

        return this.messages.filter(
            message =>
                message.to === to && this.message_staling_period < message.time
        ).length;
    };

    this.numberOfMessages = function numberOfMessages(address) {
        return this.messages.filter(message => message.to === address).length;
    };

    this.validMessage = function validMessage(obj_) {
        return obj_ instanceof Message;
    };

    this.handleGetLocalMessages = function handleGetLocalMessages() {
        let messages = [];

        try {
            const messages = messageSet(
                JSON.parse(
                    globalFuncs.localStorage.getItem(LOCAL_STORAGE_KEY)
                ).map(obj => new Message(obj))
            );
        } catch (e) {
            messages = [];

            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } finally {
            if (
                !(
                    messages &&
                    Array.isArray(messages) &&
                    messages.every(this.validMessage)
                )
            ) {
                messages = messages.filter(this.validMessage);
            }
        }

        this.messages = messages;

        return this.messages;
    };

    this.message_staling_period = new Date(
        new Date().getTime() - MESSAGE_STALING_PERIOD * 1000
    ).getTime();
    this.openedModals = [];
    this.messages = [];
    this.messagesList = {};

    this.Message = Message;

    return this;
};

module.exports = messageService;
