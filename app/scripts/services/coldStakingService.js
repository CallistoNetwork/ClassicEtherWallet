var coldStakingService = function (walletService) {


    const contractAddrs = {
        CLOT: '0xa45083107ae67636cd9b93ad13c15b939dbdce31',
        // fixme: testing addr
        'RINKEBY ETH': '0x64bebb2aae4e6911daac96717c37e3bd127e1832',//'0xa3a278371d1569d849f93f4241c7812969e863a3',
        CLO: '0x',
        //"ROPSTEN ETH": '0x1797a49729e1595d385484a2d48e74703bf4f150'
    };


    const contract = {
        "name": "Cold Staking",
        // rinkeby
        //fixme testing addr
        "address": '0x64bebb2aae4e6911daac96717c37e3bd127e1832',//"0xa3a278371d1569d849f93f4241c7812969e863a3",
        abi: [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "_address",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Donate",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "claim",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "claim_and_withdraw",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "First_Stake_donation",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "name": "report_abuse",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "staker",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "reward",
                        "type": "uint256"
                    }
                ],
                "name": "Claim",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "addr",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "weight",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "init_block",
                        "type": "uint256"
                    }
                ],
                "name": "StartStaking",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "start_staking",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "staker",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "weight",
                        "type": "uint256"
                    }
                ],
                "name": "WithdrawStake",
                "type": "event"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "withdraw_stake",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "max_delay",
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
                "inputs": [],
                "name": "reward",
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
                "inputs": [],
                "name": "round_interval",
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
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "name": "stake_reward",
                "outputs": [
                    {
                        "name": "_reward",
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
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "name": "staker_info",
                "outputs": [
                    {
                        "name": "weight",
                        "type": "uint256"
                    },
                    {
                        "name": "init",
                        "type": "uint256"
                    },
                    {
                        "name": "stake_time",
                        "type": "uint256"
                    },
                    {
                        "name": "reward",
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
                "name": "staking_pool",
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
                "inputs": [],
                "name": "staking_threshold",
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
                "inputs": [],
                "name": "test",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "pure",
                "type": "function"
            }
        ],
    };


    this._staker_info = {
        weight: 0,
        init: 0,
        stake_time: 0,
        reward: 0
    };


    /*
        Gets the reward for address
     */

    const zeroValue = '0x00';


    function staker_info() {

        const addr = walletService.wallet.getAddressString();

        ethFuncs.handleContractCall('staker_info', contract, [addr], addr, zeroValue, data => {

            console.log('staker_info()', data);

            if (data.error) {

                console.error('error getting staker info');


            } else {

                const {outputs} = contract.abi.find(a => a.name === 'staker_info');

                const [weight, init, stake_time, reward] = ethUtil.solidityCoder.decodeParams(outputs.map(o => o.type), data.data.replace('0x', ''));

                Object.assign(this._staker_info, {
                    weight: etherUnits.toEther(weight.toFixed(0), 'wei'),
                    init: init.toFixed(0),
                    stake_time: stake_time.toFixed(0),
                    reward: reward.toFixed(0),
                });

            }
            return this._staker_info;

        })

    }

    function stake_reward() {

        const addr = walletService.wallet.getAddressString();

        ethFuncs.handleContractCall('stake_reward', contract, [addr], addr, zeroValue, data => {

            console.log('stake_reward()', data);

            if (data.error) {


                this._staker_info.reward = 0;
            } else {


                this._staker_info.reward = ethUtil.solidityCoder.decodeParam('uint', data.data).toFixed(0);

                console.log(this._staker_info);


            }

            return this._staker_info.reward;
        })
    }


    function claim_and_withdraw(callback = console.log) {


        // claim_and_withdraw


        ethFuncs.handleContractCall('claim_and_withdraw', contract, null, walletService.wallet.getAddressString(), zeroValue, callback);


    }

    function claim(callback = console.log) {


        // claim


        ethFuncs.handleContractCall('claim', contract, null, walletService.wallet.getAddressString(), zeroValue, callback);


    }

    function updateAddress() {


        if (Object.keys(contractAddrs).includes(ajaxReq.type)) {


            Object.assign(contract, {
                address: contractAddrs[ajaxReq.type]
            });
        }
    }


    return {
        contract,
        contractAddrs,
        claim,
        claim_and_withdraw,
        staker_info,
        _staker_info: this._staker_info,
        stake_reward,
        updateAddress
    }
};


module.exports = coldStakingService;
