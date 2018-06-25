const _uniqueBy = require('lodash/uniqBy');

const messageSet = messages => _uniqueBy(messages, message => message.to + message.index);

const MESSAGE_STALING_PERIOD = 2160000; // 25 days



class Message {

    constructor({from, to, text, time, index}) {


        this.from = from;
        this.to = to;

        this.text = text;
        this.time = time;

        this.index = index;
    }
}

var newMessageService = function () {

   this.MESSAGE_STALING_PERIOD = MESSAGE_STALING_PERIOD; // 25 days

    this.message_staling_period = new Date(new Date().getTime() - (MESSAGE_STALING_PERIOD * 1000)).getTime();


    let CONTRACT_ADDRESS = '0x6A77417FFeef35ae6fe2E9d6562992bABA47a676';

    this.CONTRACT = nodes.nodeList.etc_ethereumcommonwealth_geth.abiList.find(contract => contract.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase());

    if (!this.CONTRACT) {

        throw new Error('ERROR FINDING CONTRACT: ' + CONTRACT_ADDRESS);
    }


    Object.assign(this.CONTRACT, {
        abi: JSON.parse(this.CONTRACT.abi)
    });

    this.saveMessages = function saveMessages() {

        let messageSet_ = messageSet(this.messages);

        globalFuncs.localStorage.setItem(KEY, JSON.stringify(messageSet_));

    }


    this.mapMessagesToMessageList = function mapMessagesToMessageList(addr) {


        // console.log(newMessageService.messages);


        const sorted = this.messages.filter(message => message.to === addr).sort((a, b) => b.time - a.time);


        this.messagesList = sorted.reduce((accum_, message) => {

            if (!accum_[message.from]) {

                accum_[message.from] = [message];
            }

            else accum_[message.from].push(message);

            return accum_;

        }, {});


    };


    this.numberOfNewMessages = function numberOfNewMessages(address) {


        //console.log('new messages', new Date($scope.message_staling_period));

        return this.messages.filter(message =>

            message.to === address &&
            this.message_staling_period < message.time
        ).length

    };


    this.validMessage = function validMessage(obj_) {

        return obj_ instanceof Message;
    }


    const KEY = '@messages@';

    this.handleGetLocalMessages = function handleGetLocalMessages() {


        let messages = [];

        try {

            const messages_ = JSON.parse(globalFuncs.localStorage.getItem(KEY));

            messages = messageSet(messages_);

        } catch (e) {

            messages = [];

        } finally {

            if (!(messages && Array.isArray(messages) && messages.every(this.validMessage))) {

                messages = messages.filter(this.validMessage);
            }


        }

        newMessageService.messages = messageSet([].concat(messages));

        return newMessageService.messages;
    }


    this.initMessages = function initMessages(addr) {


        // filter messages by address in wallet


        const messages = newMessageService.messages.filter(message => message.to === addr);


        this.mapMessagesToMessageList();


        function getLastMsgIndex(addr, callback_ = console.log) {


            handleContractCall('last_msg_index', [addr], callback_);
        }

        function getMessageByIndex(addr, index, callback_ = console.log) {

            handleContractCall('getMessageByIndex', [addr, index], callback_);


        }


        getLastMsgIndex(addr, function (result) {

            if (result && result.hasOwnProperty('data')) {

                const lastMsgIndex = parseInt(ethFuncs.hexToDecimal(result.data));


                if (lastMsgIndex > 0) {

                    const queue = [];
                    let curIndex = lastMsgIndex;

                    while (curIndex) {

                        if (!messages.find(message => message.index === curIndex)) {
                            queue.push(curIndex);

                        }

                        curIndex--;

                    }

                    if (queue.length === 0) {

                        this.loadingMessages = false;

                    }

                    queue.forEach(index_ => getMessageByIndex(addr, index_, (result) => {


                        if (!result.error && result.hasOwnProperty('data')) {

                            const outTypes = this.CONTRACT.abi.find(i => i.name === 'getMessageByIndex').outputs.map(i => i.type);

                            const [from, text, time] = ethUtil.solidityCoder.decodeParams(outTypes, result.data.replace('0x', ''));

                            function mapToMessage(from, to, text, time, index) {

                                return Object.assign({}, MESSAGE, {from, to, text, time, index});
                            }


                            const MESSAGE = mapToMessage(from, addr, text, Number(time.toString()) * 1000, index_);


                            this.messages.push(MESSAGE);

                            this.saveMessages();
                            this.mapMessagesToMessageList();


                        }

                        this.loadingMessages = false;

                    }));


                } else {

                    this.loadingMessages = false;

                }


            } else {

                this.loadingMessages = false;

                //$scope.notifier.danger('Error locating lastMsgIndex');
                console.error('Error locating lastMsgIndex');
            }


        });


    };

    // function handleContractCall(functionName, inputs_ = null, callback_) {
    //
    //     const foundFunction = this.CONTRACT.abi.find(function_ => function_.name === functionName);
    //
    //     function encodeInputs(inputs) {
    //
    //
    //         const types = inputs.map(i => i.type);
    //
    //         const values = inputs.map(i => i.value || '');
    //
    //
    //         return ethUtil.solidityCoder.encodeParams(types, values);
    //
    //
    //     }
    //
    //     function encode_(functionName) {
    //
    //
    //         if (foundFunction) {
    //
    //
    //             return ethFuncs.getFunctionSignature(ethUtil.solidityUtils.transformToFullName(foundFunction));
    //
    //
    //         } else {
    //
    //             console.error('error locationg', functionName);
    //         }
    //
    //
    //     }
    //
    //
    //     if (!foundFunction) {
    //
    //         console.error('err');
    //
    //         return null;
    //     }
    //     let data = encode_(foundFunction.name);
    //
    //     if (inputs_) {
    //
    //         foundFunction.inputs.forEach((item, i) => item.value = inputs_[i]);
    //
    //         data += encodeInputs(foundFunction.inputs);
    //     }
    //
    //
    //     data = ethFuncs.sanitizeHex(data);
    //
    //     nodes.nodeList[backgroundNodeService.backgroundNode].lib.getEthCall({
    //         to: messageContract.address,
    //         data
    //     }, function (data) {
    //
    //         if (data.error) {
    //
    //             uiFuncs.notifier.danger(data.msg);
    //
    //         }
    //         callback_(data);
    //
    //     })
    //
    //
    // }


    this.message_staling_period = new Date(new Date().getTime() - (MESSAGE_STALING_PERIOD * 1000)).getTime();
    this.openedModals = [];
    this.messages = [];
    this.messagesList = {};


    return this;

}

module.exports = newMessageService;
