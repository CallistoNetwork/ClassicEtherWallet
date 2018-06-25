var coldStakingService = function (walletService) {

    this.contractAddrs = {
        "Testnet CLO": '0xa45083107ae67636cd9b93ad13c15b939dbdce31',
        'RINKEBY ETH': '0x713f80e73b174b9aba62dd75fa1da6925c13ace5',
    };

    this._round_interval = {
        'CLO': 172800,
        'Testnet CLO': 15000,
        'RINKEBY ETH': 15000,
    };


    this.contract = {
        "name": "Cold Staking",
        "address": this.contractAddrs['Testnet CLO'],
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


    this.userCanWithdraw = function () {


        // fixme
        return false;
        //return new BigNumber(this._round_interval[ajaxReq.type]).lt(this._staker_info.stake_time);
    };
    /*

        Reset information and read from contract
     */

    this.handleInit = function () {


        this.reset_staker_info();
        this._staking_threshold = 0;

        if (Object.keys(this.contractAddrs).includes(ajaxReq.type)) {


            this.staking_threshold();

            if (walletService &&
                walletService.wallet &&
                walletService.wallet.getAddressString()
            ) {

                this.staker_info();

                // fixme: call fails unless waiting a period of time
                setTimeout(() => {


                    this._staker_info.weight === 0 && this.staker_info();

                }, 1000);


                setTimeout(() => {


                    this._staker_info.weight === 0 && this.staker_info();

                }, 2000);


            }

        }


    };


    /*
        Gets the reward for address
     */


    this.staker_info = function (addr = walletService.wallet.getAddressString()) {


        const _tx = {inputs: [addr]};


        this.handleContractCall('staker_info', _tx, data => {

            // console.log('staker_info()', data);


            if (!data.error) {


                const [weight, init, stake_time, reward] = data.data.map(Number);


                Object.assign(this._staker_info, {
                    init,
                    stake_time,
                    reward,
                    weight: etherUnits.toEther(weight, 'wei')
                });

            }
        })

    };

    this.handleContractCall = function (functionName, transaction, callback) {

        const address = this.updateAddress();

        // if (functionName === 'staker_info') {
        //
        //     console.log('staker info', this.contract, transaction);
        // }

        ethFuncs.handleContractCall(functionName, this.contract, Object.assign({}, transaction, {to: address}), callback);


    };

    this.staking_threshold = function () {


        this.handleContractCall('staking_threshold', {}, data => {

            if (!data.error) {

                this._staking_threshold = parseInt(data.data[0]);
            }
        })
    };

    this.stake_reward = function (addr = walletService.wallet.getAddressString()) {


        const _tx = {inputs: [addr]};


        this.handleContractCall('stake_reward', _tx, data => {

            // console.log('stake_reward()', data);

            if (!data.error) {


                this._staker_info.reward = parseInt(data.data[0]);

                // console.log('staking info', this._staker_info);


            }

        })
    };


    this.claim_and_withdraw = function (callback = console.log) {


        this.handleContractCall('claim_and_withdraw', {from: walletService.wallet.getAddressString()}, callback);


    };

    this.valid_staking_tx = function (num_) {

        return new BigNumber(this._staking_threshold).lte(num_);
    };

    this.claim = function (callback = console.log) {


        this.handleContractCall('claim', {from: walletService.wallet.getAddressString()}, callback);


    };


    this.updateAddress = function () {


        if (Object.keys(this.contractAddrs).includes(ajaxReq.type)) {


            Object.assign(this.contract, {
                address: this.contractAddrs[ajaxReq.type]
            });
        }

        return this.contract.address;
    };

    this.reset_staker_info = function () {


        this._staker_info = {
            weight: 0,
            init: 0,
            stake_time: 0,
            reward: 0
        };
    };

    return this;


};


module.exports = coldStakingService;
