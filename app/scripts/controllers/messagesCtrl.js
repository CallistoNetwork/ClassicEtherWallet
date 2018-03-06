'use strict';


var messagesCtrl = function ($scope, $rootScope, walletService) {
    $scope.ajaxReq = ajaxReq;
    walletService.wallet = null;
    $scope.networks = {
        ETH: "eth_ethscan",
        ETC: "etc_epool",
        UBQ: "ubq",
        EXP: "exp",
    };


    var network = globalFuncs.urlGet('network') || null;

    if (network) {
        $rootScope.$broadcast('ChangeNode', $scope.networks[network.toUpperCase()] || 0);
    }
    $scope.visibility = "list";


    //$scope.sendContractModal = new Modal(document.getElementById('sendContract'));
    //$scope.showReadWrite = false;
    //$scope.sendTxModal = new Modal(document.getElementById('deployContract'));
    $scope.Validator = Validator;

    const MESSAGE = {
        from: '0x1234',
        text: 'TEST',
        time: new Date(),
    };

    $scope.messages = [];



    /*



       messageList is a object derived from all messages grouped by address


          messageList =  {
             "0x186f9a221197e3c5791c3a75b25558f9aa5a94c8": [
               {
                 "from": "0x186f9a221197e3c5791c3a75b25558f9aa5a94c8",
                 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                 "time": "2017-01-01T05:00:00.000Z"
               },
               {
                 "from": "0x186f9a221197e3c5791c3a75b25558f9aa5a94c8",
                 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                 "time": "2017-01-01T05:00:00.000Z"
               },
               {
                 "from": "0x186f9a221197e3c5791c3a75b25558f9aa5a94c8",
                 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                 "time": "2017-10-01T04:00:00.000Z"
               },
               {
                 "from": "0x186f9a221197e3c5791c3a75b25558f9aa5a94c8",
                 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                 "time": "2018-01-01T05:00:00.000Z"
               },
               {
                 "from": "0x186f9a221197e3c5791c3a75b25558f9aa5a94c8",
                 "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                 "time": "2016-07-01T04:00:00.000Z"
               }
             ],


             ]
           }
        */

    $scope.messagesList = {};


    $scope.messagesConversation = null;


    $scope.viewMessagesConversation = function(addr) {

        $scope.messagesConversation = $scope.messagesList[addr].reverse();


        $scope.visibility = 'conversation';
    };


    function generateTestMessages() {


        const addrs_ = ["0x186f9a221197e3c5791c3a75b25558f9aa5a94c8", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0xd547750d9a3993a988e4a6ace72423f67c095480", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4", "0x1c0fa194a9d3b44313dcd849f3c6be6ad270a0a4"]

        const addrs = Array.from(new Set(addrs_));

        const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";


        for (let i = 0; i <= 2; i++) {

            $scope.messages.push(mapToMessage(addrs[i], lorem, new Date(2017, i, 1)));
            $scope.messages.push(mapToMessage(addrs[i], lorem, new Date(2017, i + 9, 1)));
            $scope.messages.push(mapToMessage(addrs[i], lorem, new Date(2018, i, 1)));
            $scope.messages.push(mapToMessage(addrs[i], lorem, new Date(2018, i + 2, 1)));


        }
    }


    function mapToMessage(from, text, time) {

        return Object.assign({}, MESSAGE, {from, text, time});
    }


    const dater = new Date();


    // new messages are at the start of the month

    $scope.messageDateThreshold = new Date(dater.getFullYear(), dater.getMonth() + 1, 1);


    generateTestMessages();
    mapMessagesToMessageList();

    console.log($scope.messagesList);


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


    /*
        Reset data on visibility switch
     */

    $scope.setVisibility = function (str) {
        $scope.visibility = str;


    };

    $scope.handleSubmitNewMessage = function ($event) {

        $event.preventDefault();


    }

}
module.exports = messagesCtrl;
