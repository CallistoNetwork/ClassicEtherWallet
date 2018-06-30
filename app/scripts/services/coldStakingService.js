const contractAddrs_ = {
    "Testnet CLO": '0xa45083107ae67636cd9b93ad13c15b939dbdce31',
    'RINKEBY ETH': '0x713f80e73b174b9aba62dd75fa1da6925c13ace5',
};

const contract_ = {
    "name": "Cold Staking",
    "address": contractAddrs_['Testnet CLO'],
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


var coldStakingService = function (walletService) {


    this.contract = new InitContract(contract_.abi, contractAddrs_['RINKEBY ETH'], 'RINKEBY ETH');


    this.contractAddrs = contractAddrs_;

    this._round_interval = {
        'CLO': 172800,
        'Testnet CLO': 15000,
        'RINKEBY ETH': 15000,
    };

    /*

        Reset information and read from contract
     */

    this.handleInit = function () {


        this.reset_staker_info();
        this.contract.staking_threshold = 0;

        if (Object.keys(this.contractAddrs).includes(ajaxReq.type)) {


            this.contract.get_staking_threshold();

            if (walletService &&
                walletService.wallet &&
                walletService.wallet.getAddressString()
            ) {



                // fixme: call fails unless waiting a period of time
                setTimeout(() => {


                    this.contract.staker_info.weight === 0 && this.staker_info();

                }, 1000);


                setTimeout(() => {


                    this.contract.staker_info.weight === 0 && this.staker_info();

                }, 2000);


            }

        }


    };


    /*
        Gets the reward for address
     */


    /// UTILS

    this.reset_staker_info = function () {


        this.contract.staker_info = {
            weight: 0,
            init: 0,
            stake_time: 0,
            reward: 0
        };
    };


    this.userCanWithdraw = function () {


        return new BigNumber(this._round_interval[ajaxReq.type]).lt(this.contract.staker_info.stake_time);
    };


    this.valid_staking_tx = function (num_) {

        return new BigNumber(this.contract.staking_threshold).lte(num_);
    };

    this.updateAddress = function () {


        if (Object.keys(this.contractAddrs).includes(ajaxReq.type)) {


            this.contract.address = this.contractAddrs[ajaxReq.type];


        }
        return this.contract.address;
    };


    // WRITE

    this.claim = function () {

        return this.contract.handleContractWrite('claim', {}, walletService.wallet);


    };


    this.claim_and_withdraw = function () {


        return this.contract.handleContractWrite('claim_and_withdraw', {}, walletService.wallet);


    }


    //  READ

    this.staking_threshold = function () {


        return this.contract.handleContractCall('staking_threshold').then(data => {

            this.contract.staking_threshold = etherUnits.toEther(data.data[0], 'wei');
        });
    };

    this.staker_info = function () {

        return this.contract.handleContractCall('staker_info', [walletService.wallet.getAddressString()])
            .then(result => {

                const [weight, init, stake_time, reward] = result.data.map(Number);
                this.contract.staker_info = {
                    weight: etherUnits.toEther(weight, 'wei'),
                    init,
                    stake_time,
                    reward: etherUnits.toEther(reward, 'wei')
                };

            })
    }
    return this;


};


module.exports = coldStakingService;
