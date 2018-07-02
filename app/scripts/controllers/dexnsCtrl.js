'use strict';
/* 0 -> nothing
 *  1 -> user
 *  2 -> token
 *  3 -> contract
 *  4 -> update Name
 *  5 -> access Name content
 *  6 -> step 2 register Name
 *  7 -> confirmation
 */
const statusCodes = {
    nothing: 0,
    'user': 1,
    'token': 2,
    'contract': 3,
    'update Name': 4,
    'access Name content': 5,
    'step 2 register Name': 6,
    'confirmation': 7,
};


//var DexNSFrontendABI = require('../abiDefinitions/rinkebyAbi.json').find(i => i.address === '0x1797a49729e1595d385484a2d48e74703bf4f150');


var DexNSFrontendABI = require('../abiDefinitions/etcAbi.json').find(i => i.name === 'DexNS Frontend contract');

var DexNSABI = require('../abiDefinitions/etcAbi.json').find(i => i.name === 'DexNS State storage');


if (!DexNSFrontendABI) {

    throw new Error('Unable to locate DexNSFrontendABI')
}

if (!DexNSABI) {

    throw new Error('Unable to locate DexNSABI');
}


var dexnsCtrl = function ($scope, $sce, $rootScope, walletService, backgroundNodeService, dexnsService) {


    $scope.dexnsService = dexnsService;
    walletService.wallet = null;
    $scope.contract = dexnsService.contract;
    $scope.sendTxStatus = "";

    $scope.walletService = walletService;

    $scope.dexns_status = statusCodes.nothing; //0;


    $rootScope.$broadcast('ChangeNode', globalFuncs.networks['ETC'] || 0);

    $scope.input = {
        abi: '',
        link: '',
        sourceCode: '',
        info: '',
        tokenName: '',
        tokenNetwork: ajaxReq.type,
    };


    $scope.hideEnsInfoPanel = false;
    $scope.networks = globalFuncs.networks;

    $scope.tx = {
        gasLimit: '200000',
        data: '',
        to: '',
        unit: "ether",
        value: 0,
        gasPrice: null
    };


    // user input of name to register
    $scope.DexNSName = '';

    $scope.dexnsConfirmModalModal = new Modal(document.getElementById('dexnsConfirmModal'));


    // TODO
    $scope.$watch(function () {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function () {
        if (walletService.wallet == null) return;
        $scope.wallet = walletService.wallet;
        $scope.wd = true;
        $scope.wallet.setBalance();
        $scope.wallet.setTokens();
    });

    var DexNSFrontendContract = {
        functions: [],
    };
    for (var i in DexNSABI) {
        if (DexNSFrontendABI[i].type === "function") {
            DexNSFrontendABI[i].inputs.map(function (i) {
                i.value = '';
            });
            DexNSFrontendContract.functions.push(DexNSFrontendABI[i]);
        }
    }

    $scope.handleRegisterAndUpdateName = function (event) {

        event.preventDefault();

        const {tokenName, owner, destination, metadata, hideOwner, assign} = $scope.input;


        // fixme: hideOwner, owner

        const _metadata = dexnsService.metaData($scope.input);

        const inputs = [tokenName, owner, destination, _metadata, hideOwner, assign];

        Object.assign($scope.tx, {
            inputs,
            value: dexnsService.contract.namePrice,
            unit: 'wei',
            from: walletService.wallet.getAddressString(),
        });
        const {tx} = $scope;

        const wallet = walletService.wallet;

        dexnsService.contract.handleContractWrite(
            'registerAndUpdateName',
            wallet,
            tx,
        );

    };


    $scope.getOwningTime = function () {

        dexnsService.contract.handleContractCall('owningTime')
            .then(result => {

                dexnsService.contract.owningTime = result.data[0];
            }).catch(err => {

            console.error('error getOwningTime');
            dexnsService.contract.owningTime = 31536000;


        })
    }

    $scope.getDexNSPrice = function () {


        dexnsService.contract.handleContractCall('namePrice')
            .then(result => {

                console.log('namePrice', result);

                dexnsService.contract.namePrice = result.data[0];
            })
            .catch(err => {

                console.error('error locating name price');

                dexnsService.contract.namePrice = 100000000000000000;
                $scope.notifier.danger(err);
            });

    };

    $scope.openRegisterName = function () {
        $scope.dexns_status = statusCodes.user; // 1 -> user
    }

    $scope.openRegisterToken = function () {

        $scope.dexns_status = statusCodes.token;
    }

    $scope.checkDexNSName = function () {


        dexnsService.contract.handleContractCall('endtimeOf', [$scope.DexNSName], {})
            .then(data => {

                const _time = new Date().getTime();
                const _renderedTime = new BigNumber(_time);
                if (ajaxReq.type !== "ETC") {
                    $scope.notifier.danger("DexNS accepts only $ETC for gas payments! You should switch to ETC node first to register your name.");
                }
                if (_renderedTime > data.data) {
                    $scope.dexns_status = statusCodes['step 2 register Name'];
                    $scope.notifier.info("This name is available for registration.");
                } else {
                    uiFuncs.notifier.danger("This name is already registered! You should try to register another name.");
                }

            })

    }

    $scope.registerDexNSName = function () {

        if ($scope.wallet === undefined) {
            $scope.notifier.danger("Unlock your wallet first!");
        } else {

            $scope.dexns_status = statusCodes.confirmation;
            $scope.dexnsConfirmModalModal.open();
        }
    }


    $scope.sendTx = function () {
        $scope.dexnsConfirmModalModal.close();

        const tx = {
            value: dexnsService.contract.namePrice,
            unit: 'wei',
            from: walletService.wallet.getAddressString(),
            inputs: [$scope.DexNSName],
        };

        dexnsService.contract.handleContractWrite('registerName', walletService.wallet, tx);
    };


    $scope.toTimestamp = function (date) {
        var dateSplitted = date.split('-'); // date must be in DD-MM-YYYY format
        var formattedDate = dateSplitted[1] + '/' + dateSplitted[0] + '/' + dateSplitted[2];
        return new Date(formattedDate).getTime();
    };

    $scope.getDexNSPrice();
    $scope.getOwningTime();

}

module.exports = dexnsCtrl;
