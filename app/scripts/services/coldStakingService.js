var coldStakingService = function (walletService) {

    const contract = {
        "name": "Cold Staking",

        // rinkeby
        "address": "0xa3a278371d1569d849f93f4241c7812969e863a3",
        abi: [
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
                "constant": false,
                "inputs": [],
                "name": "claim",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
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
                "constant": false,
                "inputs": [],
                "name": "First_Stake_donation",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
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
                "constant": false,
                "inputs": [],
                "name": "withdraw_stake",
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
                "name": "test",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            }
        ],
    };


    const contractAddrs = {
        CLOT: '0xa45083107ae67636cd9b93ad13c15b939dbdce31',
        'RINKEBY ETH': '0xa3a278371d1569d849f93f4241c7812969e863a3',
        CLO: '0x',
        //"ROPSTEN ETH": '0x1797a49729e1595d385484a2d48e74703bf4f150'
    };


    this.stake_balance = 0;

    /*
        Gets the reward for address
     */

    function stake_info() {


        ethFuncs.handleContractCall('stake_info', contract, null, [walletService.wallet.getAddressString()], '0x00', data => {

        })
    }

    function stake_reward() {

        const addr = walletService.wallet.getAddressString();

        ethFuncs.handleContractCall('stake_reward', contract, [addr], addr, '0x00', data => {

            console.log('stake_reward', data);

            if (data.data && data.data === '0x') {


                this.stake_balance = 0;
            }

            else {

                this.stake_balance = data.data;
            }

            return this.stake_balance;
        })
    }

    function claim_and_withdraw(callback = console.log) {


        // claim_and_withdraw


        ethFuncs.handleContractCall('claim_and_withdraw', contract, null, walletService.wallet.getAddressString(), '0x00', callback);


    }

    function claim(callback = console.log) {


        // claim


        ethFuncs.handleContractCall('claim', contract, null, walletService.wallet.getAddressString(), '0x00', callback);


    }

    function updateAddress() {


        if (['CLO', 'RINKEBY ETH', 'CLOT'].includes(ajaxReq.type)) {


            Object.assign(contract, {
                address: contractAddrs[ajaxReq.type]
            });
        }
    }


    return {
        contract,
        contractAddrs,
        stake_balance: this.stake_balance,
        claim,
        claim_and_withdraw,
        stake_reward,
        updateAddress
    }
};



module.exports = coldStakingService;
