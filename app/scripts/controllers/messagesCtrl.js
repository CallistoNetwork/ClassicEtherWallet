'use strict';

var messagesCtrl = function ($scope, $rootScope, walletService) {
    $scope.ajaxReq = ajaxReq;
    $scope.Validator = Validator;
    walletService.wallet = null;

    const KEY = '@messages@';

    const config = {
        fetchMessageInterval: 10 // seconds
    };

    const DATE = new Date();


    $scope.VISIBILITY = {
        LIST: 'list',
        NEW: 'new',
        CONVERSATION: 'conversation',

    };

    const testContract = {
        address: '0x8F7a526C9693572baD2586895605e89B8D753068',//'0x440fd2c0ee33b6b6e241da7f7e7a1c28a1539386',
        abi: [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "lastIndex",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_who",
                        "type": "address"
                    },
                    {
                        "name": "_index",
                        "type": "uint256"
                    }
                ],
                "name": "newMessage",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "messages",
                "outputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "text",
                        "type": "string"
                    },
                    {
                        "name": "time",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "message_staling_period",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "last_msg_index",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_who",
                        "type": "address"
                    }
                ],
                "name": "getLastMessage",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "keys",
                "outputs": [
                    {
                        "name": "key",
                        "type": "string"
                    },
                    {
                        "name": "key_type",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_who",
                        "type": "address"
                    }
                ],
                "name": "getPublicKey",
                "outputs": [
                    {
                        "name": "_key",
                        "type": "string"
                    },
                    {
                        "name": "_key_type",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_who",
                        "type": "address"
                    },
                    {
                        "name": "_index",
                        "type": "uint256"
                    }
                ],
                "name": "getMessageByIndex",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "_sender",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "_receiver",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "_time",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "message",
                        "type": "string"
                    }
                ],
                "name": "Message",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_key",
                        "type": "string"
                    },
                    {
                        "name": "_type",
                        "type": "string"
                    }
                ],
                "name": "setPublicKey",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "_sender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "_key",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "name": "_keytype",
                        "type": "string"
                    }
                ],
                "name": "PublicKeyUpdated",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_text",
                        "type": "string"
                    }
                ],
                "name": "sendMessage",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ]
    };

    $scope.visibility = $scope.VISIBILITY.LIST;


    const node = nodes.nodeList.rop_mew;  //  .etc_epool;

    $scope.MESSAGE_STALING_PERIOD = 2160000;

    $scope.message_staling_period = null;


    const messageContract = {
        functions: [],
        abi: null,
        name: null,
        address: '0x6A77417FFeef35ae6fe2E9d6562992bABA47a676'
    };


    const foundContract = Object.assign({}, testContract, {abi: JSON.stringify(testContract.abi)});

    //const foundContract = node.abiList.find(contract => contract.address === messageContract.address);


    if (foundContract) {

        Object.assign(messageContract, foundContract, {

            abi: JSON.parse(foundContract.abi)
        });

    }

    messageContract.abi.forEach((item) => {

        if (item.type === 'function') {

            item.inputs.forEach(i => i.value = '');

            messageContract.functions.push(item);
        }

    });


    const messageSet = messages => Array.from(new Set(messages.map(JSON.stringify))).map(JSON.parse);


    var network = globalFuncs.urlGet('network') || null;

    if (network) {
        // $rootScope.$broadcast('ChangeNode', $scope.networks[network.toUpperCase()] || 0);
        //$rootScope.$broadcast('ChangeNode', $scope.networks.rop_mew || 0);
    }


    const MESSAGE = {
        from: '0x1234',
        text: 'TEST',
        time: DATE.getTime(),
    };

    // LIST of all messages, stored locally


    $scope.messages = handleGetLocalMessages();


    // messages grouped by addr

    $scope.messagesList = {};


    $scope.messagesConversation = null;


    $scope.newMessage = {
        to: '',
        text: '',
    };


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

        const messages = $scope.messages.slice();


        getLastMsgIndex(addr, function (result) {

            if (result && result.hasOwnProperty('data')) {

                const lastMsgIndex = Number(ethFuncs.hexToDecimal(result.data));


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


                            const MESSAGE = mapToMessage(from, text, Number(time.toString()) * 1000);


                            $scope.messages.push(MESSAGE);
                            mapMessagesToMessageList();


                        }
                        // if last item in array
                        if (index_ === messages.length + 1) {


                            $scope.saveMessages();


                            // uiFuncs.notifier.info('new messages!');
                        }


                    }));


                }

                else mapMessagesToMessageList();
                // else uiFuncs.notifier.info('messages loaded from local storage');


            }

        })
    }


    function handleGetLocalMessages() {


        function validMessage(obj_) {

            return Object.keys(MESSAGE).every(key => {


                return obj_.hasOwnProperty(key)
            })
        }

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


        let messages = $scope.messages;


        let messageSet_ = messageSet(messages);

        globalFuncs.localStorage.setItem(KEY, JSON.stringify(messageSet_));

        return messageSet_;

    }


    $scope.viewMessagesConversation = function (addr) {

        $scope.messagesConversation = $scope.messagesList[addr];


        $scope.visibility = $scope.VISIBILITY.CONVERSATION;
    };


    $scope.numberOfNewMessages = function numberOfNewMessages(address) {


        const newMessages = $scope.messagesList[address].filter(message => {


            return message.time + $scope.message_staling_period > DATE.getTime();
        });


        return newMessages.length;

    };


    function mapToMessage(from, text, time) {

        return Object.assign({}, MESSAGE, {from, text, time});
    }


    // generateTestMessages();
    // mapMessagesToMessageList();


    function mapMessagesToMessageList() {


        // console.log($scope.messages);


        const sorted = $scope.messages.sort((a, b) => b.time - a.time);


        $scope.messagesList = sorted.reduce((accum_, message) => {

            if (!accum_[message.from]) {

                accum_[message.from] = [message];
            }

            else accum_[message.from].push(message);

            return accum_;

        }, {});
    }


    // $scope.$watch('messages', (val, oldVal) => {
    //
    //
    //     if (Array.isArray(val) && val.length > 0) {
    //         $scope.saveMessages();
    //     }
    //
    //     console.log($scope.messages);
    // });


    $scope.$watch(function () {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function () {
        if (walletService.wallet == null) return;
        $scope.wallet = walletService.wallet;
        $scope.wd = true;

    });


    $scope.handleSubmitNewMessage = function ($event) {

        $event.preventDefault();

        console.log($scope.newMessage);

        //TODO: write to contract


    }


    $scope.setVisibility = function setVisibility(str) {


        $scope.visibility = str;

        $scope.newMessage.text = '';


    };


    $scope.validateAddress = function validateAddress() {

        return Validator.isValidENSorEtherAddress($scope.newMessage.to);
    };

    function generateTestMessages() {


        const addrs_ = ["0x186f9a221197e3c5791c3a75b25558f9aa5a94c8", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0xd547750d9a3993a988e4a6ace72423f67c095480", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4"]

        const addrs = Array.from(new Set(addrs_));

        const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


        addrs.forEach((addr, i) => {


            $scope.messages.push(mapToMessage(addr, lorem, new Date(2016, i + 9, 1).getTime()));
            $scope.messages.push(mapToMessage(addr, lorem, new Date(2018, i + 2, 1).getTime()));
        })

    }


    getMessageStalingPeriod();
    const testAddrTo = '0x1234';
    initMessages(testAddrTo);


    setInterval(() => {

        console.log(new Date().toLocaleTimeString());

        initMessages(testAddrTo);


    }, 1000 * config.fetchMessageInterval);


}
module.exports = messagesCtrl;
