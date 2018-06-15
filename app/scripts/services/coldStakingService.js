var coldStakingService = function (walletService) {


        this.contractAddrs = {
            'CLO Testnet 3.0': '0xa45083107ae67636cd9b93ad13c15b939dbdce31',
            // fixme: testing addr
            'RINKEBY ETH': '0x713f80e73b174b9aba62dd75fa1da6925c13ace5',//'0xa3a278371d1569d849f93f4241c7812969e863a3',
            // CLO: '0x',
            //"ROPSTEN ETH": '0x1797a49729e1595d385484a2d48e74703bf4f150'
        };


        this.contract = {
            "name": "Cold Staking",
            // rinkeby
            //fixme testing addr
            "address": '0xa45083107ae67636cd9b93ad13c15b939dbdce31',//"0xa3a278371d1569d849f93f4241c7812969e863a3",
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

        this._staking_threshold = 0;

        this.defaultTx = () => ({
            inputs: null,
            from: walletService.wallet.getAddressString(),
            value: 0,
            unit: 'ether',
        });


        this.reset_staker_info = function () {


            this._staker_info = {
                weight: 0,
                init: 0,
                stake_time: 0,
                reward: 0
            };
        };


        /*
            Gets the reward for address
         */


        this.staker_info = function () {

            const addr = walletService.wallet.getAddressString();

            const _tx = {inputs: [addr], from: addr, value: 0};

            ethFuncs.handleContractCall('staker_info', this.contract, _tx, data => {

                // console.log('staker_info()', data);


                if (!data.error) {


                    const [weight, init, stake_time, reward] = data.data;

                    Object.assign(this._staker_info, {
                        weight: etherUnits.toEther(weight.toFixed(0), 'wei'),
                        init: init.toFixed(0),
                        stake_time: stake_time.toFixed(0),
                        reward: reward.toFixed(0),
                    });

                    return this._staker_info;

                }
            })

        };

        this.staking_threshold = function () {

            ethFuncs.handleContractCall('staking_threshold', this.contract, this.defaultTx(), data => {

                if (!data.error) {

                    this._staking_threshold = data.data[0];
                }
            })
        };

        this.stake_reward = function () {

            const addr = walletService.wallet.getAddressString();

            const _tx = {inputs: [addr], from: addr, value: 0};

            ethFuncs.handleContractCall('stake_reward', this.contract, _tx, data => {

                // console.log('stake_reward()', data);

                if (!data.error) {


                    this._staker_info.reward = data.data[0].toFixed(0);

                    // console.log('staking info', this._staker_info);


                }

                return this._staker_info.reward;
            })
        };


        this.claim_and_withdraw = function (callback = console.log) {


            // claim_and_withdraw


            ethFuncs.handleContractCall('claim_and_withdraw', this.contract, this.defaultTx(), callback);


        };

        this.valid_staking_tx = function (num_) {

            return new BigNumber(this._staking_threshold).lte(new BigNumber(num_));
        };

        this.claim = function (callback = console.log) {


            // claim


            ethFuncs.handleContractCall('claim', this.contract, this.defaultTx(), callback);


        };

        this.updateAddress = function () {


            if (Object.keys(this.contractAddrs).includes(ajaxReq.type)) {


                Object.assign(this.contract, {
                    address: this.contractAddrs[ajaxReq.type]
                });
            }
        };


        return this;
    }
;


module.exports = coldStakingService;
