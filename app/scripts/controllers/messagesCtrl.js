"use strict";

var messagesCtrl = function(
    $scope,
    $rootScope,
    $interval,
    globalService,
    messageService,
    walletService,
    backgroundNodeService
) {
    const { CONTRACT } = messageService;

    const { name, address, abi } = CONTRACT;

    const messageContract = {
        functions: [],
        abi: typeof abi === "string" ? JSON.parse(abi) : abi,
        name,
        address
    };

    messageContract.abi.forEach(item => {
        if (item.type === "function") {
            item.inputs.forEach(i => (i.value = ""));

            messageContract.functions.push(item);
        }
    });

    const sendMessageModal = new Modal(
        document.getElementById("sendMessageModal")
    );
    const newMessagesModal = new Modal(
        document.getElementById("newMessagesModal")
    );

    const config = {
        fetchMessageInterval: 30 // seconds
    };

    const VISIBILITY = {
        LIST: "list",
        NEW: "new",
        CONVERSATION: "conversation"
    };

    messageService.handleGetLocalMessages();

    Object.assign($scope, {
        ajaxReq: ajaxReq,
        Validator: Validator,
        // wd: walletService && walletService.hasOwnProperty('wallet') && walletService.wallet.hasOwnProperty('getAddressString'),
        wallet: walletService.wallet,
        rawTx: null,
        signedTx: null,
        msgCheckTime: null,
        messagesConversation: null,
        unlockWallet: false,
        loadingMessages: false,
        messageService,
        newMessage: {
            to: "",
            text: ""
        },
        visibility: "list",
        VISIBILITY,
        tx: {
            data: "",
            to: "",
            gasLimit: "",
            from: ""
        },
        interval: null
    });

    getMessageStalingPeriod();

    function encodeInputs(inputs) {
        const types = inputs.map(i => i.type);

        const values = inputs.map(i => i.value || "");

        return ethUtil.solidityCoder.encodeParams(types, values);
    }

    function findFunctionBy(name) {
        return messageContract.functions.find(
            function_ => function_.name === name
        );
    }

    function encode_(funcName) {
        const foundFunction = messageContract.functions.find(
            function_ => function_.name === funcName
        );

        if (foundFunction) {
            return ethFuncs.getFunctionSignature(
                ethUtil.solidityUtils.transformToFullName(foundFunction)
            );
        } else {
            console.error("error locationg", funcName);
        }
    }

    function call(funcName, inputs_ = null, callback_) {
        const foundFunction = messageContract.functions.find(
            function_ => function_.name === funcName
        );

        if (!foundFunction) {
            console.error("err");

            return null;
        }
        let data = encode_(foundFunction.name);

        if (inputs_) {
            foundFunction.inputs.forEach(
                (item, i) => (item.value = inputs_[i])
            );

            data += encodeInputs(foundFunction.inputs);
        }

        data = ethFuncs.sanitizeHex(data);

        nodes.nodeList[backgroundNodeService.backgroundNode].lib.getEthCall(
            {
                to: messageContract.address,
                data
            },
            function(data) {
                if (data.error) {
                    uiFuncs.notifier.danger(data.msg);
                }
                callback_(data);
            }
        );
    }

    function getMessageStalingPeriod() {
        call("message_staling_period", null, function(result) {
            if (result && "data" in result) {
                messageService.MESSAGE_STALING_PERIOD = parseInt(
                    ethFuncs.hexToDecimal(result.data)
                );
            }
            messageService.message_staling_period = new Date(
                new Date().getTime() -
                    messageService.MESSAGE_STALING_PERIOD * 1000
            ).getTime();
        });
    }

    function getLastMsgIndex(addr, callback_ = console.log) {
        call("last_msg_index", [addr], callback_);
    }

    function getMessageByIndex(addr, index, callback_ = console.log) {
        call("getMessageByIndex", [addr, index], callback_);
    }

    function initMessages(addr) {
        // filter messages by address in wallet
        const messages = messageService.messages.filter(
            message => message.to === addr
        );

        messageService.mapMessagesToMessageList(addr);

        getLastMsgIndex(addr, function(result) {
            if (result && result.hasOwnProperty("data")) {
                const lastMsgIndex = parseInt(
                    ethFuncs.hexToDecimal(result.data)
                );

                if (lastMsgIndex > 0) {
                    const queue = [];
                    let curIndex = lastMsgIndex;

                    while (curIndex) {
                        if (
                            !messages.find(
                                message => message.index === curIndex
                            )
                        ) {
                            queue.push(curIndex);
                        }

                        curIndex--;
                    }

                    if (queue.length === 0) {
                        messageService.loadingMessages = false;
                    }

                    queue.forEach(index_ =>
                        getMessageByIndex(addr, index_, function(result) {
                            if (
                                !result.error &&
                                result.hasOwnProperty("data")
                            ) {
                                const outTypes = findFunctionBy(
                                    "getMessageByIndex"
                                ).outputs.map(i => i.type);

                                const [
                                    from,
                                    text,
                                    time
                                ] = ethUtil.solidityCoder.decodeParams(
                                    outTypes,
                                    result.data.replace("0x", "")
                                );

                                const MESSAGE = new messageService.Message({
                                    from,
                                    to: addr,
                                    text,
                                    time: Number(time.toString()) * 1000,
                                    index: index_
                                });

                                messageService.messages.push(MESSAGE);
                                messageService.mapMessagesToMessageList(addr);
                                messageService.saveMessages();

                                if (
                                    $scope.visibility ===
                                    $scope.VISIBILITY.CONVERSATION
                                ) {
                                    // update if sending msg to same addr

                                    messageService.messagesConversation = messageService.messages.filter(
                                        m => m.to === addr
                                    );
                                }
                            }

                            messageService.loadingMessages = false;
                        })
                    );
                } else {
                    messageService.loadingMessages = false;
                }
            } else {
                messageService.loadingMessages = false;

                //uiFuncs.notifier.danger('Error locating lastMsgIndex');
                console.error("Error locating lastMsgIndex");
            }
        });
    }

    $scope.viewMessagesConversation = function(addr) {
        $scope.visibility = $scope.VISIBILITY.CONVERSATION;
        messageService.messagesConversation = messageService.messagesList[addr];
    };

    /*

        messages are grouped by addr and sorted
     */

    function messageInterval() {
        messageService.msgCheckTime = new Date().toLocaleTimeString();
        // console.log('check messages', $scope.msgCheckTime);

        if ($scope.unlockWallet && walletService.wallet) {
            initMessages(walletService.wallet.getAddressString());
        }
    }

    $scope.$on("$destroy", () => {
        $scope.stopMessages();
    });

    $scope.stopMessages = () => {
        if ($scope.interval) {
            $interval.cancel($scope.interval);
            $scope.interval = null;
        }
    };

    $scope.$on("ChangeWallet", function() {
        $scope.wd = true;

        $scope.stopMessages();

        messageService.messagesList = {};

        messageService.loadingMessages = true;

        initMessages(walletService.wallet.getAddressString());

        $scope.interval = $interval(
            messageInterval,
            1000 * config.fetchMessageInterval
        );
    });

    $scope.$watch("NUMBER_OF_NEW_MESSAGES", val => {
        const {
            tabs: {
                sendTransaction: { id }
            }
        } = globalService;

        if (
            0 < val &&
            !messageService.openedModals.includes(
                walletService.wallet.getAddressString()
            ) &&
            globalService.currentTab === id
        ) {
            newMessagesModal.open();

            messageService.openedModals.push(
                walletService.wallet.getAddressString()
            );
        }
    });

    $scope.handleSubmitNewMessage = function($event) {
        $event.preventDefault();

        const [TO, TEXT] = $event.target;

        const to = TO.value;
        const text = TEXT.value;

        if (ajaxReq.type.toUpperCase() !== "ETC") {
            uiFuncs.notifier.danger(
                "Wrong chain! You need to switch to $ETC network to send messages"
            );
        } else if (!Validator.isValidAddress(to)) {
            uiFuncs.notifier.danger(globalFuncs.errorMsgs[5]);
        } else sendMessage(to, text);
    };

    $scope.setVisibility = function setVisibility(str) {
        $scope.visibility = str;

        $scope.newMessage = Object.assign({}, { text: "", to: "" });

        $scope.tx = {};
    };

    $scope.validateAddress = function validateAddress() {
        return Validator.isValidENSorEtherAddress($scope.newMessage.to);
    };

    function sendMessage(to, text) {
        const sendMsgAbi = messageContract.abi.find(
            a => a.name === "sendMessage"
        );

        var fullFuncName = ethUtil.solidityUtils.transformToFullName(
            sendMsgAbi
        );
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);

        $scope.tx.data = ethFuncs.sanitizeHex(
            funcSig +
                ethUtil.solidityCoder.encodeParams(
                    sendMsgAbi.inputs.map(i => i.type),
                    [to, text]
                )
        );

        const estObj = {
            from: walletService.wallet.getAddressString(),
            to: messageContract.address,
            data: $scope.tx.data,
            value: "0x00"
        };

        ethFuncs
            .estimateGas(estObj)
            .then(function(gasLimit) {
                Object.assign($scope.tx, estObj, { gasLimit });

                const txData = uiFuncs.getTxData({
                    tx: $scope.tx,
                    wallet: walletService.wallet
                });

                uiFuncs.generateTx(txData).then(function(rawTx) {
                    const { signedTx, isError } = rawTx;

                    if (isError) {
                        uiFuncs.notifier.danger(rawTx.error);
                    } else {
                        $scope.rawTx = rawTx;
                        $scope.signedTx = signedTx;

                        sendMessageModal.open();
                    }
                });
            })
            .catch(err => {
                $scope.tx.gasLimit = -1;
            });
    }

    $scope.confirmSendMessage = function() {
        sendMessageModal.close();

        uiFuncs.sendTx($scope.signedTx, false).then(function(resp) {
            var bExStr =
                ajaxReq.type !== nodes.nodeTypes.Custom
                    ? "<a href='" +
                      ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) +
                      "' target='_blank' rel='noopener'> View your transaction </a>"
                    : "";
            var contractAddr = $scope.tx.contractAddr
                ? " & Contract Address <a href='" +
                  ajaxReq.blockExplorerAddr.replace(
                      "[[address]]",
                      $scope.tx.contractAddr
                  ) +
                  "' target='_blank' rel='noopener'>" +
                  $scope.tx.contractAddr +
                  "</a>"
                : "";
            uiFuncs.notifier.success(
                globalFuncs.successMsgs[2] +
                    "<br />" +
                    resp.data +
                    "<br />" +
                    bExStr +
                    contractAddr
            );
        });
    };

    $scope.empty = function() {
        return Object.keys(messageService.messagesList).length === 0;
    };
};
module.exports = messagesCtrl;
