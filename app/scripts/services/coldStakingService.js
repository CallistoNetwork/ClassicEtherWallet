const contract = require('../abiDefinitions/rinkebyAbi').find(i => i.name === 'Cold Staking');
//const contract_clo = require('../abiDefinitions/clo').find(i => i.name === 'Cold Staking');
//const contract_clot = require('../abiDefinitions/clot').find(i => i.name === 'Cold Staking');

if (!contract) throw new Error('Unable to locate cold staking contract');


const addrs = {
    "Testnet CLO": '0xa45083107ae67636cd9b93ad13c15b939dbdce31',
    'RINKEBY ETH': '0x713f80e73b174b9aba62dd75fa1da6925c13ace5',
};

const round_interval = {
    'CLO': 172800,
    'Testnet CLO': 15000,
    'RINKEBY ETH': 15000,
};

// extending InitContract will set view params
class ColdStakingContract extends Contract {

    constructor(network = 'RINKEBY ETH') {

        const {abi} = contract;

        const addr = addrs[network];

        super(abi, addr, network);
        this.staking_threshold = 0;

        this.round_interval = round_interval[network];
        this.networks = Object.keys(addrs);

        this.initStakerInfo();
        this.handleContractCall('staking_threshold');



    }

    initStakerInfo() {

        this.staker_info = {
            weight: 0,
            init: 0,
            stake_time: 0,
            reward: 0,
        };
    }


}


const coldStakingService = function (walletService) {

    this.tx = {gasLimit: -1};

    this.networks = Object.keys(addrs);

    this.contract = new ColdStakingContract();

    this.validNetwork = () => this.networks.includes(ajaxReq.type);


    /*

        Reset information and read from contract
     */

    this.handleInit = function () {


        if (this.validNetwork()) {


            this.contract = new ColdStakingContract(ajaxReq.type);

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


    this.userCanWithdraw = function () {

        if (this.validNetwork()) {


            return new BigNumber(this.contract.round_interval).lt(this.contract.staker_info.stake_time);

        }

        return false;
    };


    this.valid_staking_tx = function (num_) {

        return new BigNumber(this.contract.staking_threshold).lte(num_);
    };

    this.staker_info = function () {

        return this.contract.handleContractCall('staker_info', [walletService.wallet.getAddressString()])
            .then(result => {

                const [weight, init, stake_time, reward] = result.data.map(Number);
                this.contract.staker_info = {
                    weight: Number(etherUnits.toEther(weight, 'wei')),
                    init,
                    stake_time,
                    reward: Number(etherUnits.toEther(reward, 'wei'))
                };

            })
    };

    return this;


};


module.exports = coldStakingService;
