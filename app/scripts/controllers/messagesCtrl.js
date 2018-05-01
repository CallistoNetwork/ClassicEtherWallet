'use strict';

const _uniqueBy = require('lodash/uniqBy');

var messagesCtrl = function ($scope, $rootScope, $interval, globalService, walletService, backgroundNodeService) {


    const DATE = new Date();

    // localStorage key
    const KEY = '@messages@';


    let CONTRACT_ADDRESS = '0x6A77417FFeef35ae6fe2E9d6562992bABA47a676';

    const CONTRACT = nodes.nodeList.etc_ethereumcommonwealth_geth.abiList.find(contract => contract.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase());

    if (!CONTRACT) {

        throw new Error('ERROR FINDING CONTRACT: ' + CONTRACT_ADDRESS);
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


    const sendMessageModal = new Modal(document.getElementById('sendMessageModal'));
    const newMessagesModal = new Modal(document.getElementById('newMessagesModal'));


    const config = {
        fetchMessageInterval: 30 // seconds
    };


    const MESSAGE = {
        from: '0x1234',
        to: '', // adding param locally so can switch b/w accounts easier
        text: 'TEST',
        time: DATE.getTime(),
        index: 0,
    };


    const messageSet = messages => _uniqueBy(messages, message => message.to + message.index);


    const MESSAGE_STALING_PERIOD = 2160000;

    const VISIBILITY = {
        LIST: 'list',
        NEW: 'new',
        CONVERSATION: 'conversation',

    };


    Object.assign($scope, {
        ajaxReq: ajaxReq,
        Validator: Validator,
        wallet: walletService.wallet,
        rawTx: null,
        signedTx: null,
        msgCheckTime: null,
        messagesList: {},
        messagesConversation: null,
        unlockWallet: false,
        loadingMessages: false,
        MESSAGE_STALING_PERIOD,
        message_staling_period: DATE.getTime() + MESSAGE_STALING_PERIOD,
        NUMBER_OF_MESSAGES: 0,
        NUMBER_OF_NEW_MESSAGES: 0,
        newMessage: {
            to: '',
            text: '',
        },
        visibility: 'list',
        VISIBILITY,
        tx: {
            data: '',
            to: '',
            gasLimit: '',
            from: '',
        },
        interval: null,
        messages: handleGetLocalMessages(),
    });


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

        nodes.nodeList[backgroundNodeService.backgroundNode].lib.getEthCall({
            to: messageContract.address,
            data
        }, function (data) {

            if (data.error) {

                uiFuncs.notifier.danger(data.msg);

            }
            callback_(data);

        })


    }

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





        // filter messages by address in wallet
        const messages = $scope.messages.slice().filter(message => message.to === addr);


        mapMessagesToMessageList();


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

                        $scope.loadingMessages = false;

                    }

                    queue.forEach(index_ => getMessageByIndex(addr, index_, function (result) {


                        if (!result.error && result.hasOwnProperty('data')) {

                            const outTypes = findFunctionBy('getMessageByIndex').outputs.map(i => i.type);

                            const [from, text, time] = ethUtil.solidityCoder.decodeParams(outTypes, result.data.replace('0x', ''));

                            const MESSAGE = mapToMessage(from, addr, text, Number(time.toString()) * 1000, index_);


                            $scope.messages.push(MESSAGE);

                            $scope.saveMessages();
                            mapMessagesToMessageList();


                            if ($scope.visibility === $scope.VISIBILITY.CONVERSATION) {

                                // update if sending msg to same addr

                                $scope.messagesConversation = $scope.messages.filter(m => m.to === addr);
                            }

                        }

                        $scope.loadingMessages = false;

                    }));


                } else {

                    $scope.loadingMessages = false;

                }


            } else {

                $scope.loadingMessages = false;

                //$scope.notifier.danger('Error locating lastMsgIndex');
                console.error('Error locating lastMsgIndex');
            }


        });


    }

    function validMessage(obj_) {

        return Object.keys(MESSAGE).every(key => {


            return obj_.hasOwnProperty(key);
        });
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

        // console.log(messageSet_, messageSet_.length);

        globalFuncs.localStorage.setItem(KEY, JSON.stringify(messageSet_));

        return messageSet_;

    }


    $scope.viewMessagesConversation = function (addr) {

        $scope.visibility = $scope.VISIBILITY.CONVERSATION;
        $scope.messagesConversation = $scope.messagesList[addr];


    };


    $scope.numberOfNewMessages = function numberOfNewMessages(address) {


        return $scope.messages.filter(message =>

            validMessage(message) &&
            message.to === address &&
            message.time < $scope.message_staling_period
        ).length

    };

    $scope.numberOfNewMessagesFrom = function numberOfNewMessages(from, address) {


        return $scope.messages.filter(message =>

            validMessage(message) &&
            message.to === address &&
            message.from === from &&
            message.time < $scope.message_staling_period
        ).length

    };


    function mapToMessage(from, to, text, time, index) {

        return Object.assign({}, MESSAGE, {from, to, text, time, index});
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


        $scope.NUMBER_OF_MESSAGES = sorted.length;
        $scope.NUMBER_OF_NEW_MESSAGES = $scope.numberOfNewMessages(addr);


    }

    function messageInterval() {

        $scope.msgCheckTime = new Date().toLocaleTimeString();
        // console.log('check messages', $scope.msgCheckTime);


        if ($scope.unlockWallet && $scope.wallet) {

            initMessages($scope.wallet.getAddressString());
        }


    }


    $scope.$watch(function () {

        if (!walletService.wallet) {
            return null;
        }
        return walletService.wallet.getAddressString();

    }, function (address) {
        if (!address) {

            $scope.unlockWallet = false;
            $interval.cancel($scope.interval);
            return;
        }
        $scope.unlockWallet = true;

        $scope.wallet = walletService.wallet;

        $interval.cancel($scope.interval);
        $scope.interval = null;

        $scope.messagesList = {};

        $scope.loadingMessages = true;

        $scope.openedModal = false;


        initMessages(walletService.wallet.getAddressString());


        $scope.interval = $interval(messageInterval, 1000 * config.fetchMessageInterval);


    });


    $scope.$watch('NUMBER_OF_NEW_MESSAGES', (val) => {

        const {tabs: {sendTransaction: {id}}} = globalService;

        if (0 < val && !$scope.openedModal && globalService.currentTab === id) {


            newMessagesModal.open();

            $scope.openedModal = true;

        }
    });


    $scope.handleSubmitNewMessage = function ($event) {

        $event.preventDefault();

        const [TO, TEXT] = $event.target;

        const to = TO.value;
        const text = TEXT.value;

        if (nodes.nodeList[globalFuncs.getCurNode()].type.toUpperCase() !== 'ETC') {

            $scope.notifier.danger('Wrong chain! You need to switch to $ETC network to send messages');


        } else if (!Validator.isValidAddress(to)) {

            $scope.notifier.danger(globalFuncs.errorMsgs[5]);

        } else if (!$scope.wallet.hwType) {


            $scope.notifier.danger(globalFuncs.errorMsgs[9]);
        }
        else sendMessage(to, text);

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


        var fullFuncName = ethUtil.solidityUtils.transformToFullName(sendMsgAbi);
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);

        $scope.tx.data = ethFuncs.sanitizeHex(funcSig + ethUtil.solidityCoder.encodeParams(
            sendMsgAbi.inputs.map(i => i.type),
            [to, text],
        ));


        const estObj = {
            from: $scope.wallet.getAddressString(),
            to: messageContract.address,
            data: $scope.tx.data,
            value: "0x00"
        };


        ethFuncs.estimateGas(estObj, function (data) {

            if (data.error || parseInt(data.data) === -1) {

                $scope.tx.gasLimit = '';

                $scope.notifier.danger('Gas estimation error');


            } else {

                Object.assign($scope.tx, estObj, {gasLimit: data.data});

                const txData = uiFuncs.getTxData($scope);

                uiFuncs.generateTx(txData, function (rawTx) {


                    const {signedTx, isError} = rawTx;

                    if (isError) {


                        $scope.notifier.danger(rawTx.error);

                    } else {


                        $scope.rawTx = rawTx;
                        $scope.signedTx = signedTx;


                        sendMessageModal.open();
                    }


                })

            }

        });

    }


    $scope.confirmSendMessage = function () {
        sendMessageModal.close();

        uiFuncs.sendTx($scope.signedTx, function (resp) {
            if (!resp.isError) {


                var bExStr = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? "<a href='" + $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                var contractAddr = $scope.tx.contractAddr ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', $scope.tx.contractAddr) + "' target='_blank' rel='noopener'>" + $scope.tx.contractAddr + "</a>" : '';
                $scope.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);
            } else {


                $scope.notifier.danger(typeof resp.error === 'string' && resp.error || globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
            }
        });
    }


    $scope.empty = function () {

        return Object.keys($scope.messagesList).length === 0;
    };


}
module.exports = messagesCtrl;
