'use strict';


var messagesCtrl = function ($scope, $rootScope, walletService) {
    $scope.ajaxReq = ajaxReq;
    $scope.Validator = Validator;
    walletService.wallet = null;
    $scope.networks = {
        ETH: "eth_ethscan",
        ETC: "etc_epool",
        UBQ: "ubq",
        EXP: "exp",
    };


    $scope.VISIBILITY = {
        LIST: 'list',
        NEW: 'new',
        CONVERSATION: 'conversation',

    };

    $scope.visibility = $scope.VISIBILITY.LIST;


    var network = globalFuncs.urlGet('network') || null;

    if (network) {
        $rootScope.$broadcast('ChangeNode', $scope.networks[network.toUpperCase()] || 0);
    }


    const MESSAGE = {
        from: '0x1234',
        text: 'TEST',
        time: new Date().getTime(),
    };

    // LIST of all messages, stored locally

    $scope.messages = [];


    // messages grouped by addr

    $scope.messagesList = {};


    $scope.messagesConversation = null;


    $scope.newMessage = {
        to: '',
        text: '',
    };


    $scope.viewMessagesConversation = function (addr) {

        $scope.messagesConversation = $scope.messagesList[addr].sort((a, b) => a - b);


        $scope.visibility = $scope.VISIBILITY.CONVERSATION;
    };


    $scope.numberOfNewMessages = function numberOfNewMessages(address) {


        const newMessages = $scope.messagesList[address].filter(message => {

            // console.log(message.time, $scope.message_staling_period, message.time >= $scope.message_staling_period);

            return message.time >= $scope.message_staling_period;
        });


        console.log(address, $scope.message_staling_period, newMessages.length);

        return newMessages.length;

    };


    function generateTestMessages() {


        const addrs_ = ["0x186f9a221197e3c5791c3a75b25558f9aa5a94c8", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0xd547750d9a3993a988e4a6ace72423f67c095480", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4"]

        const addrs = Array.from(new Set(addrs_));

        const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


        addrs.forEach((addr, i) => {


            $scope.messages.push(mapToMessage(addr, lorem, new Date(2017, i, 1).getTime()));
            $scope.messages.push(mapToMessage(addr, lorem, new Date(2017, i + 9, 1).getTime()));
            $scope.messages.push(mapToMessage(addr, lorem, new Date(2018, i, 1).getTime()));
            $scope.messages.push(mapToMessage(addr, lorem, new Date(2018, i + 2, 1).getTime()));
            $scope.messages.push(mapToMessage(addr, lorem, new Date(2018, i + 4, 1, i, i).getTime()));
        })

    }


    function mapToMessage(from, text, time) {

        return Object.assign({}, MESSAGE, {from, text, time});
    }


// TODO: grab from contract

    $scope.MESSAGE_STALLING_PERIOD = 2160000;

    $scope.message_staling_period = new Date().getTime() + $scope.MESSAGE_STALLING_PERIOD;


    generateTestMessages();
    mapMessagesToMessageList();


    function mapMessagesToMessageList() {


        const sorted = $scope.messages.slice().sort((a, b) => b.time - a.time);


        $scope.messagesList = sorted.reduce((accum_, message) => {

            if (!accum_[message.from]) {

                accum_[message.from] = [message];
            }

            accum_[message.from].push(message);

            return accum_;

        }, {});
    }


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


    $scope.getContractData = function () {


        const {functions, selectedFunc} = $scope.contract;

        var curFunc = functions[selectedFunc.index];
        var fullFuncName = ethUtil.solidityUtils.transformToFullName(curFunc);
        var funcSig = ethFuncs.getFunctionSignature(fullFuncName);
        var typeName = ethUtil.solidityUtils.extractTypeName(fullFuncName);
        var types = typeName.split(',');
        types = types[0] === "" ? [] : types;
        var values = [];
        for (var i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
                if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));
                else values.push(curFunc.inputs[i].value);
            } else values.push('');
        }

        return ethFuncs.sanitizeHex(funcSig + ethUtil.solidityCoder.encodeParams(types, values));

    };

    $scope.readFromContract = function () {
        ajaxReq.getEthCall({to: $scope.contract.address, data: $scope.getContractData()}, function (data) {
            if (!data.error) {
                var curFunc = $scope.contract.functions[$scope.contract.selectedFunc.index];
                var outTypes = curFunc.outputs.map(function (i) {
                    return i.type;
                });
                var decoded = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''));
                for (var i in decoded) {
                    if (decoded[i] instanceof BigNumber) curFunc.outputs[i].value = decoded[i].toFixed(0);
                    else curFunc.outputs[i].value = decoded[i];
                }
            } else throw data.msg;

        });
    };


}
module.exports = messagesCtrl;
