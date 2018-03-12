'use strict';

var messagesCtrl = function ($scope, $rootScope, walletService) {
    $scope.ajaxReq = ajaxReq;
    $scope.Validator = Validator;
    walletService.wallet = null;

    const useTestData = false;

    const DATE = new Date();
    const KEY = '@messages@';

    const sendMessageModal = new Modal(document.getElementById('sendMessageModal'));

    const config = {
        fetchMessageInterval: 10 // seconds
    };


    const MESSAGE = {
        from: '0x1234',
        to: '', // adding param locally so can switch b/w accounts easier
        text: 'TEST',
        time: DATE.getTime(),
    };


    const messageSet = messages => Array.from(new Set(messages.map(JSON.stringify))).map(JSON.parse);


    $scope.msgCheckTime = null;

    // messages grouped by addr

    $scope.messagesList = {};


    $scope.messagesConversation = null;


    $scope.newMessage = {
        to: '',
        text: '',
    };


    $scope.unlockWallet = false;

    $scope.tx = {
        data: '',
        to: '',
        gasLimit: '',
        from: '',
    };


    $scope.VISIBILITY = {
        LIST: 'list',
        NEW: 'new',
        CONVERSATION: 'conversation',

    };


    $scope.visibility = $scope.VISIBILITY.LIST;

    $scope.loadingMessages = false;


    $scope.MESSAGE_STALING_PERIOD = 2160000;

    $scope.message_staling_period = DATE.getTime() + $scope.MESSAGE_STALING_PERIOD;

    // INIT


    let node = nodes.nodeList.etc_epool;

    let CONTRACT_ADDRESS = '0x6A77417FFeef35ae6fe2E9d6562992bABA47a676'; // '0x8F7a526C9693572baD2586895605e89B8D753068';

    const CONTRACT = node.abiList.find(abi => abi.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase());

    if (!CONTRACT) {

        console.error('ERROR FINDING CONTRACT', CONTRACT_ADDRESS, node);
    }


    const {name, address, abi} = CONTRACT;

    const messageContract = {
        functions: [],
        abi: JSON.parse(abi),
        name,
        address
    };


    messageContract.abi.forEach((item) => {

        if (item.type === 'function') {

            item.inputs.forEach(i => i.value = '');

            messageContract.functions.push(item);
        }

    });


    if (useTestData) {


        console.log('use test data');

        node = nodes.nodeList.rop_mew;


        $rootScope.$broadcast('ChangeNode', 'rop_mew');
        CONTRACT_ADDRESS = '0x8F7a526C9693572baD2586895605e89B8D753068';

        messageContract.address = CONTRACT_ADDRESS;


        function generateTestMessages() {


            const addrs_ = ["0x186f9a221197e3c5791c3a75b25558f9aa5a94c8", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0xd547750d9a3993a988e4a6ace72423f67c095480", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4"]

            const addrs = Array.from(new Set(addrs_));

            const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


            addrs.forEach((addr, i) => {


                $scope.messages.push(mapToMessage(addr, addr, lorem, new Date(2016, i + 9, 1).getTime()));
                $scope.messages.push(mapToMessage(addr, addr, lorem, new Date(2018, i + 2, 1).getTime()));
            })

        }


        // $scope.messages = generateTestMessages();
        // mapMessagesToMessageList();

        //initMessages('0x1234')
    }


    // LIST of all messages, stored locally

    $rootScope.$broadcast('ChangeNode', 'etc_epool');


    $scope.interval = setInterval(() => {

        $scope.msgCheckTime = new Date().toLocaleTimeString();
        console.log('check messages', $scope.msgCheckTime);


        if ($scope.unlockWallet && $scope.wallet) {

            initMessages($scope.wallet.getAddressString());
        }


    }, 1000 * config.fetchMessageInterval);


    $scope.messages = handleGetLocalMessages();

    getMessageStalingPeriod();

    function encodeInputs(inputs) {


        const types = inputs.map(i => i.type);

        const values = inputs.map(i => i.value || '');


        return ethUtil.solidityCoder.encodeParams(types, values);


    }


    function findFunctionBy(name) {

        return messageContract.functions.find(function_ => function_.name === name);
    }


    function encode_(functionName) {

        const foundFunction = messageContract.functions.find(function_ => function_.name === functionName);

        if (foundFunction) {


            return ethFuncs.getFunctionSignature(ethUtil.solidityUtils.transformToFullName(foundFunction));


        } else {

            console.error('error locationg', functionName);
        }


    }

    function handleContractCall(functionName, inputs_ = null, callback_) {

        const foundFunction = messageContract.functions.find(function_ => function_.name === functionName);


        if (!foundFunction) {

            console.error('err');

            return null;
        }
        let data = encode_(foundFunction.name);

        if (inputs_) {

            foundFunction.inputs.forEach((item, i) => item.value = inputs_[i]);

            data += encodeInputs(foundFunction.inputs);
        }


        data = ethFuncs.sanitizeHex(data);

        node.lib.getEthCall({to: messageContract.address, data}, function (data) {

            if (data.error) {

                uiFuncs.notifier.danger(data.msg);

            }
            callback_(data);

        })


    }

    const FUNCTION_NAMES = ["lastIndex", "newMessage", "messages", "message_staling_period", "last_msg_index", "getLastMessage", "keys", "getPublicKey", "getMessageByIndex", "setPublicKey", "sendMessage"];

    function getMessageStalingPeriod() {

        handleContractCall('message_staling_period', null, function (result) {


            if (result && 'data' in result) {

                $scope.MESSAGE_STALING_PERIOD = Number(ethFuncs.hexToDecimal(result.data));
            }
            $scope.message_staling_period = DATE.getTime() + $scope.MESSAGE_STALING_PERIOD;
        });


    }


    function getLastMsgIndex(addr, callback_ = console.log) {


        handleContractCall('last_msg_index', [addr], callback_);
    }

    function getMessageByIndex(addr, index, callback_ = console.log) {

        handleContractCall('getMessageByIndex', [addr, index], callback_);


    }


    function initMessages(addr) {


        $scope.loadingMessages = true;

        // filter messages by address in wallet
        const messages = $scope.messages.slice().filter(validMessage).filter(message => message.to === addr);


        getLastMsgIndex(addr, function (result) {

            if (result && result.hasOwnProperty('data')) {

                const lastMsgIndex = parseInt(ethFuncs.hexToDecimal(result.data));


                if (lastMsgIndex > messages.length) {

                    const queue = [];
                    let curIndex = lastMsgIndex;
                    while (curIndex > messages.length) {

                        queue.push(curIndex);

                        curIndex--;

                    }


                    queue.forEach(index_ => getMessageByIndex(addr, index_, function (result) {


                        if (!result.error && result.hasOwnProperty('data')) {

                            const outTypes = findFunctionBy('getMessageByIndex').outputs.map(i => i.type);

                            const dater = ethUtil.solidityCoder.decodeParams(outTypes, result.data.replace('0x', ''));

                            const [from, text, time] = dater;


                            const MESSAGE = mapToMessage(from, addr, text, Number(time.toString()) * 1000);


                            $scope.messages.push(MESSAGE);
                            $scope.saveMessages();
                            mapMessagesToMessageList();

                            if ($scope.visibility === $scope.VISIBILITY.CONVERSATION) {

                                // update if sending msg to same addr

                                $scope.messagesConversation = $scope.messages.filter(m => m.to === addr);
                            }

                        }

                    }));


                }

                else mapMessagesToMessageList();

                $scope.loadingMessages = false;
                // else uiFuncs.notifier.info('messages loaded from local storage');


            }

        })
    }

    function validMessage(obj_) {

        return Object.keys(MESSAGE).every(key => {


            return obj_.hasOwnProperty(key)
        })
    }

    function handleGetLocalMessages() {


        let messages = [];

        try {

            const messages_ = JSON.parse(globalFuncs.localStorage.getItem(KEY));

            messages = messageSet(messages_);

        } catch (e) {

            messages = [];

        } finally {

            if (!(messages && Array.isArray(messages) && messages.every(validMessage))) {

                messages = messages.filter(validMessage);
            }


        }
        return messages;
    }


    $scope.saveMessages = function saveMessages() {


        let messages = $scope.messages.slice().filter(validMessage);


        let messageSet_ = messageSet(messages);

        console.log(messageSet_, messageSet_.length);

        globalFuncs.localStorage.setItem(KEY, JSON.stringify(messageSet_));

        return messageSet_;

    }


    $scope.viewMessagesConversation = function (addr) {

        $scope.visibility = $scope.VISIBILITY.CONVERSATION;
        $scope.messagesConversation = $scope.messagesList[addr];


    };


    $scope.numberOfNewMessages = function numberOfNewMessages(address) {


        const newMessages = $scope.messagesList[address].filter(message => {


            return message.time + $scope.message_staling_period > DATE.getTime();
        });


        return newMessages.length;

    };


    function mapToMessage(from, to, text, time) {

        return Object.assign({}, MESSAGE, {from, to, text, time});
    }


    /*

        messages are grouped by addr and sorted
     */


    function mapMessagesToMessageList() {


        // console.log($scope.messages);


        const addr = $scope.wallet.getAddressString();

        const sorted = $scope.messages.filter(message => message.to === addr).sort((a, b) => b.time - a.time);


        $scope.messagesList = sorted.reduce((accum_, message) => {

            if (!accum_[message.from]) {

                accum_[message.from] = [message];
            }

            else accum_[message.from].push(message);

            return accum_;

        }, {});


    }


    $scope.$watch(function () {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function () {
        if (walletService.wallet == null) {

            $scope.unlockWallet = false;
            return;
        }
        $scope.wallet = walletService.wallet;
        $scope.unlockWallet = true;

        initMessages(walletService.wallet.getAddressString());


    });


    $scope.handleSubmitNewMessage = function ($event) {

        $event.preventDefault();

        // console.log($event);

        const [TO, TEXT] = $event.target;

        const to = TO.value;
        const text = TEXT.value;
        sendMessage(to, text);

    };


    $scope.setVisibility = function setVisibility(str) {


        $scope.visibility = str;

        $scope.newMessage = Object.assign({}, {text: '', to: ''});

        $scope.tx = {};

    };


    $scope.validateAddress = function validateAddress() {

        return Validator.isValidENSorEtherAddress($scope.newMessage.to);
    };


    function sendMessage(to, text) {


        const sendMsgAbi = messageContract.abi.find(a => a.name === 'sendMessage');

        if (!sendMsgAbi) {

            console.error('error');

            return;
        }


        var fullFuncName = ethUtil.solidityUtils.transformToFullName(sendMsgAbi);
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
        $scope.tx.data = ethFuncs.sanitizeHex(funcSig + ethUtil.solidityCoder.encodeParams(
            sendMsgAbi.inputs.map(i => i.type),
            [to, text],
        ));


        // FIXME: ETC!!!!

        ajaxReq.getTransactionData($scope.wallet.getAddressString(), function (data) {

            if (data.error) $scope.notifier.danger(data.msg);

            data = data.data;

            const {address: from, gasprice: gasPrice, nonce} = data;

            const estObj = {
                //gasPrice,
                from,
                to: messageContract.address,
                data: $scope.tx.data,
                value: "0x00"
            };


            ethFuncs.estimateGas(estObj, function (data) {

                if (data.error) {

                    $scope.tx.gasLimit = '';

                    $scope.notifier.danger(data.msg);

                    return false;

                } else {

                    Object.assign($scope.tx, {
                        gasLimit: data.data,
                        gasPrice,
                        from,
                        nonce,
                        to: messageContract.address,
                        value: '0x00',
                    });

                    const txData = uiFuncs.getTxData($scope);

                    txData.gasPrice = gasPrice;
                    txData.nonce = nonce;

                    uiFuncs.generateTx(txData, function (rawTx) {


                        // console.log(Object.keys(rawTx), rawTx);

                        const {signedTx, isError} = rawTx;

                        if (isError) {


                            return false;
                        }


                        $scope.rawTx = rawTx;

                        $scope.signedTx = signedTx;

                        sendMessageModal.open();


                    })

                }

            });
        })


    };


    $scope.confirmSendMessage = function () {
        sendMessageModal.close();

        uiFuncs.sendTx($scope.signedTx, function (resp) {
            if (!resp.isError) {


                var bExStr = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? "<a href='" + $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                var contractAddr = $scope.tx.contractAddr ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', $scope.tx.contractAddr) + "' target='_blank' rel='noopener'>" + $scope.tx.contractAddr + "</a>" : '';
                $scope.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);
            } else {
                $scope.notifier.danger(resp.error);
            }
        });
    }


    $scope.empty = function () {

        return Object.keys($scope.messagesList).length === 0;
    };


}
module.exports = messagesCtrl;
