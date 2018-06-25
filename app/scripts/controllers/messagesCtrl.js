'use strict';

var messagesCtrl = function ($scope,
                             $rootScope,
                             $interval,
                             globalService,
                             newMessageService,
                             walletService,
                             backgroundNodeService) {


    const {CONTRACT} = newMessageService;

    const {name, address, abi} = CONTRACT;

    const messageContract = {
        functions: [],
        abi: typeof abi === 'string' ? JSON.parse(abi) : abi,
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


    const VISIBILITY = {
        LIST: 'list',
        NEW: 'new',
        CONVERSATION: 'conversation',

    };


    newMessageService.handleGetLocalMessages();


    Object.assign($scope, {
        ajaxReq: ajaxReq,
        Validator: Validator,
        wallet: walletService.wallet,
        rawTx: null,
        signedTx: null,
        msgCheckTime: null,
        messagesConversation: null,
        unlockWallet: false,
        loadingMessages: false,
        newMessageService,
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

                newMessageService.MESSAGE_STALING_PERIOD = parseInt(ethFuncs.hexToDecimal(result.data));
            }
            newMessageService.message_staling_period = new Date(new Date().getTime() - (newMessageService.MESSAGE_STALING_PERIOD * 1000)).getTime()
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
        const messages = newMessageService.messages.filter(message => message.to === addr);


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


                            newMessageService.messages.push(MESSAGE);

                            $scope.saveMessages();
                            mapMessagesToMessageList();


                            if ($scope.visibility === $scope.VISIBILITY.CONVERSATION) {

                                // update if sending msg to same addr

                                newMessageService.messagesConversation = newMessageService.messages.filter(m => m.to === addr);
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


    $scope.viewMessagesConversation = function (addr) {

        $scope.visibility = $scope.VISIBILITY.CONVERSATION;
        newMessageService.messagesConversation = newMessageService.messagesList[addr];


    };


    $scope.numberOfNewMessagesFrom = function numberOfNewMessages(from, address) {


        return newMessageService.messages.filter(message =>

            message.to === address &&
            message.from === from &&
            newMessageService.message_staling_period < message.time
        ).length

    };


    /*

        messages are grouped by addr and sorted
     */


    function mapMessagesToMessageList() {


        // console.log(newMessageService.messages);


        const addr = $scope.wallet.getAddressString();

        const sorted = newMessageService.messages.filter(message => message.to === addr).sort((a, b) => b.time - a.time);


        newMessageService.messagesList = sorted.reduce((accum_, message) => {

            if (!accum_[message.from]) {

                accum_[message.from] = [message];
            }

            else accum_[message.from].push(message);

            return accum_;

        }, {});

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

        newMessageService.messagesList = {};

        $scope.loadingMessages = true;


        initMessages(walletService.wallet.getAddressString());


        $scope.interval = $interval(messageInterval, 1000 * config.fetchMessageInterval);


    });


    $scope.$watch('NUMBER_OF_NEW_MESSAGES', (val) => {

        const {tabs: {sendTransaction: {id}}} = globalService;

        if (0 < val &&
            !newMessageService.openedModals.includes($scope.wallet.getAddressString()) &&
            globalService.currentTab === id) {


            newMessagesModal.open();

            newMessageService.openedModals.push($scope.wallet.getAddressString());

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

        } else sendMessage(to, text);

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

                let response = resp.error;

                if (resp.error.includes('Insufficient funds')) {


                    response = globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type);


                }

                $scope.notifier.danger(response);


            }
        });
    }


    $scope.empty = function () {

        return Object.keys(newMessageService.messagesList).length === 0;
    };


}
module.exports = messagesCtrl;
