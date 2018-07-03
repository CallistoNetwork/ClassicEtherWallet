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


const dexnsCtrl = function (
    $scope,
    $sce,
    $rootScope,
    walletService,
    backgroundNodeService,
    dexnsService
) {


    $scope.dexnsService = dexnsService;
    walletService.wallet = null;
    $scope.sendTxStatus = "";

    $scope.etherUnits = etherUnits;

    $scope.walletService = walletService;

    $scope.dexns_status = statusCodes.nothing; //0;


    if (nodes.nodeList[globalFuncs.getCurNode()].type !== 'ETC') {

        $rootScope.$broadcast('ChangeNode', globalFuncs.networks['ETC'] || 0);

    }

    $scope.input = {
        abi: '',
        link: '',
        sourceCode: '',
        info: '',
        tokenName: '',
        tokenNetwork: ajaxReq.type,
        owner: '',
        destination: '',
        hideOwner: false,
        assign: false,
    };


    $scope.hideEnsInfoPanel = false;
    $scope.networks = globalFuncs.networks;

    $scope.tx = {
        gasLimit: '200000',
        data: '',
        to: '',
        unit: "ether",
        value: 0,
        gasPrice: ''
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


    $scope.handleRegisterAndUpdateName = function (event) {

        event.preventDefault();

        if (!walletUnlocked()) return false;

        const {tokenName, owner, destination, abi, link, sourceCode, info, tokenNetwork, hideOwner, assign} = $scope.input;


        // fixme: hideOwner, owner

        const _metadata = dexnsService.metaData($scope.input);

        const _owner = walletService.wallet.getAddressString();

        const _destination = _owner;

        const _hideOwner = true;

        const _assign = true;


        Object.assign($scope.tx, {
            inputs: [tokenName, _owner, _destination, _metadata, _hideOwner, _assign],
            value: dexnsService.contract.namePrice,
            unit: 'wei',
            from: _owner,
        });

        const wallet = walletService.wallet;

        dexnsService.contract.handleContractWrite(
            'registerAndUpdateName',
            wallet,
            $scope.tx,
        );

    };


    $scope.getOwningTime = function () {

        dexnsService.contract.handleContractCall('owningTime')
            .then(result => {

                dexnsService.contract.owningTime = result.data[0];
            }).catch(err => {

            console.error('error getOwningTime');

        })
    }

    $scope.getDexNSPrice = function () {


        dexnsService.contract.handleContractCall('namePrice')
            .then(result => {

                dexnsService.contract.namePrice = result.data[0];

            })
            .catch(err => {

                console.error('error locating name price');

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


    function walletUnlocked() {

        if ($scope.wallet === undefined) {
            $scope.notifier.danger("Unlock your wallet first!");

            return false;
        }

        return true;
    }

    $scope.registerDexNSName = function () {

        if (walletUnlocked()) {

            $scope.dexns_status = statusCodes.confirmation;

            Object.assign($scope.tx, {
                value: dexnsService.contract.namePrice,
                unit: 'wei',
                to: dexnsService.contract.address
            });

            $scope.dexnsConfirmModalModal.open();
        }
    }


    $scope.sendTx = function () {

        const tx = {
            value: dexnsService.contract.namePrice,
            unit: 'wei',
            from: walletService.wallet.getAddressString(),
            inputs: [$scope.DexNSName],
        };

        dexnsService.contract.handleContractWrite('registerName', walletService.wallet, tx).finally(() => {

            $scope.dexnsConfirmModalModal.close();

        })
    };


    $scope.toTimestamp = function (date) {
        var dateSplitted = date.split('-'); // date must be in DD-MM-YYYY format
        var formattedDate = dateSplitted[1] + '/' + dateSplitted[0] + '/' + dateSplitted[2];
        return new Date(formattedDate).getTime();
    };

    Promise.all([
        $scope.getDexNSPrice(),
        $scope.getOwningTime(),
    ]);

}

module.exports = dexnsCtrl;
