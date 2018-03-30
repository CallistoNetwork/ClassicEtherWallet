'use strict';

// TODO: add ability to send contract a value on deployment


var contractsCtrl = function ($scope, $sce, $rootScope, walletService) {
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
    $scope.visibility = "interactView";


    $scope.sendContractModal = new Modal(document.getElementById('sendContract'));
    $scope.showReadWrite = false;
    $scope.sendTxModal = new Modal(document.getElementById('deployContract'));
    $scope.Validator = Validator;

    const initTrans = {
        gasLimit: '',
        data: '',
        to: '',
        unit: "ether",
        value: 0,
        nonce: null,
        gasPrice: null
    };


    const initContract = {
        address: globalFuncs.urlGet('address') != null && $scope.Validator.isValidAddress(globalFuncs.urlGet('address')) ? globalFuncs.urlGet('address') : '',
        abi: [],
        functions: [],
        selectedFunc: null,
        applyConstructorParams: false,
        constructorParams: [],
        bytecode: '',
    };

    const multisig = {
        bytecode: '606060405234156200001057600080fd5b60405162001cd638038062001cd683398101604052808051820191906020018051906020019091908051906020019091905050808383600060018351016001819055503373ffffffffffffffffffffffffffffffffffffffff1660026001610100811015156200007c57fe5b0181905550600161010260003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600090505b82518110156200015e578281815181101515620000cf57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff16600282600201610100811015156200010357fe5b018190555080600201610102600085848151811015156200012057fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550806001019050620000b6565b8160008190555050505080610105819055506200018e6200019f640100000000026200196f176401000000009004565b6101078190555050505050620001b6565b60006201518042811515620001b057fe5b04905090565b611b1080620001c66000396000f3006060604052600436106100fc576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063173825d9146101735780632f54bf6e146101ac5780634123cb6b146101fd57806352375093146102265780635c52c2f51461024f578063659010e7146102645780637065cb481461028d578063746c9171146102c6578063797af627146102ef578063b20d30a91461032e578063b61d27f614610351578063b75c7dc6146103c3578063ba51a6df146103ea578063c2cf73261461040d578063c41a360a1461046b578063cbf0b0c0146104ce578063f00d4b5d14610507578063f1736d861461055f575b6000341115610171577fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3334604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b005b341561017e57600080fd5b6101aa600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610588565b005b34156101b757600080fd5b6101e3600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506106c9565b604051808215151515815260200191505060405180910390f35b341561020857600080fd5b6102106106ff565b6040518082815260200191505060405180910390f35b341561023157600080fd5b610239610705565b6040518082815260200191505060405180910390f35b341561025a57600080fd5b61026261070c565b005b341561026f57600080fd5b61027761074a565b6040518082815260200191505060405180910390f35b341561029857600080fd5b6102c4600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610751565b005b34156102d157600080fd5b6102d961089d565b6040518082815260200191505060405180910390f35b34156102fa57600080fd5b6103146004808035600019169060200190919050506108a3565b604051808215151515815260200191505060405180910390f35b341561033957600080fd5b61034f6004808035906020019091905050610c57565b005b341561035c57600080fd5b6103a5600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919080359060200190820180359060200191909192905050610c95565b60405180826000191660001916815260200191505060405180910390f35b34156103ce57600080fd5b6103e8600480803560001916906020019091905050610ff3565b005b34156103f557600080fd5b61040b6004808035906020019091905050611107565b005b341561041857600080fd5b61045160048080356000191690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611193565b604051808215151515815260200191505060405180910390f35b341561047657600080fd5b61048c6004808035906020019091905050611213565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156104d957600080fd5b610505600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611231565b005b341561051257600080fd5b61055d600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061127c565b005b341561056a57600080fd5b61057261142e565b6040518082815260200191505060405180910390f35b600080366040518083838082843782019150509250505060405180910390206105b081611435565b15156105bb57600080fd5b61010260008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054915060008214156105f6576106c4565b60018054036000541115610609576106c4565b60006002836101008110151561061b57fe5b0181905550600061010260008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610658611641565b6106606116ea565b7f58619076adf5bb0943d100ef88d52d7c3fd691b19d3a9071b555b651fbf418da83604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b505050565b60008061010260008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054119050919050565b60015481565b6101075481565b60003660405180838380828437820191505092505050604051809103902061073381611435565b151561073e57600080fd5b60006101068190555050565b6101065481565b60003660405180838380828437820191505092505050604051809103902061077881611435565b151561078357600080fd5b61078c826106c9565b1561079657610899565b61079e611641565b60fa6001541015156107b3576107b26116ea565b5b60fa6001541015156107c457610899565b6001600081548092919060010191905055508173ffffffffffffffffffffffffffffffffffffffff166002600154610100811015156107ff57fe5b018190555060015461010260008473ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f994a936646fe87ffe4f1e469d3d6aa417d6b855598397f323de5b449f765f0c382604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b5050565b60005481565b6000816108af81611435565b15156108ba57600080fd5b60006101086000856000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610c50576101086000846000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166101086000856000191660001916815260200190815260200160002060010154610108600086600019166000191681526020019081526020016000206002016040518082805460018160011615610100020316600290048015610a135780601f106109e857610100808354040283529160200191610a13565b820191906000526020600020905b8154815290600101906020018083116109f657829003601f168201915b505091505060006040518083038185875af1925050501515610a3457600080fd5b7fe7c957c06e9a662c1a6c77366179f5b702b97651dc28eee7d5bf1dff6e40bb4a338461010860008760001916600019168152602001908152602001600020600101546101086000886000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661010860008960001916600019168152602001908152602001600020600201604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200185600019166000191681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818154600181600116156101000203166002900481526020019150805460018160011615610100020316600290048015610bd75780601f10610bac57610100808354040283529160200191610bd7565b820191906000526020600020905b815481529060010190602001808311610bba57829003601f168201915b5050965050505050505060405180910390a161010860008460001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160009055600282016000610c459190611985565b505060019150610c51565b5b50919050565b600036604051808383808284378201915050925050506040518091039020610c7e81611435565b1515610c8957600080fd5b81610105819055505050565b6000610ca0336106c9565b1515610cab57600080fd5b610cb48461182f565b15610dcf577f92ca3a80853e6663fa31fa10b99225f18d4902939b4c53a9caae9043f6efd0043385878686604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200182810382528484828181526020019250808284378201915050965050505050505060405180910390a18473ffffffffffffffffffffffffffffffffffffffff168484846040518083838082843782019150509250505060006040518083038185875af1925050501515610dc357600080fd5b60006001029050610feb565b60003643604051808484808284378201915050828152602001935050505060405180910390209050610e00816108a3565b158015610e62575060006101086000836000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b15610fea57846101086000836000191660001916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508361010860008360001916600019168152602001908152602001600020600101819055508282610108600084600019166000191681526020019081526020016000206002019190610f179291906119cd565b507f1733cbb53659d713b79580f79f3f9ff215f78a7c7aa45890f3b89fc5cddfbf328133868887876040518087600019166000191681526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018281038252848482818152602001925080828437820191505097505050505050505060405180910390a15b5b949350505050565b600080600061010260003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549250600083141561103357611101565b8260020a915061010360008560001916600019168152602001908152602001600020905060008282600101541611156111005780600001600081548092919060010191905055508181600101600082825403925050819055507fc7fb647e59b18047309aa15aad418e5d7ca96d173ad704f1031a2c3d7591734b3385604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182600019166000191681526020019250505060405180910390a15b5b50505050565b60003660405180838380828437820191505092505050604051809103902061112e81611435565b151561113957600080fd5b6001548211156111485761118f565b81600081905550611157611641565b7facbdb084c721332ac59f9b8e392196c9eb0e4932862da8eb9beaf0dad4f550da826040518082815260200191505060405180910390a15b5050565b60008060008061010360008760001916600019168152602001908152602001600020925061010260008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054915060008214156111f6576000935061120a565b8160020a9050600081846001015416141593505b50505092915050565b60006002600183016101008110151561122857fe5b01549050919050565b60003660405180838380828437820191505092505050604051809103902061125881611435565b151561126357600080fd5b8173ffffffffffffffffffffffffffffffffffffffff16ff5b600080366040518083838082843782019150509250505060405180910390206112a481611435565b15156112af57600080fd5b6112b8836106c9565b156112c257611428565b61010260008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054915060008214156112fd57611428565b611305611641565b8273ffffffffffffffffffffffffffffffffffffffff166002836101008110151561132c57fe5b0181905550600061010260008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508161010260008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507fb532073b38c83145e3e5135377a08bf9aab55bc0fd7c1179cd4fb995d2a5159c8484604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b50505050565b6101055481565b60008060008061010260003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549250600083141561147657611639565b6101036000866000191660001916815260200190815260200160002091506000826000015414156114fc5760005482600001819055506000826001018190555061010480548091906001016114cb9190611a4d565b82600201819055508461010483600201548154811015156114e857fe5b906000526020600020900181600019169055505b8260020a90506000818360010154161415611638577fe1c52dc63b719ade82e8bea94cc41a0d5d28e4aaf536adb5e9cccc9ff8c1aeda3386604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182600019166000191681526020019250505060405180910390a1600182600001541115156116105761010461010360008760001916600019168152602001908152602001600020600201548154811015156115c157fe5b9060005260206000209001600090556101036000866000191660001916815260200190815260200160002060008082016000905560018201600090556002820160009055505060019350611639565b8160000160008154809291906001900391905055508082600101600082825417925050819055505b5b505050919050565b600080610104805490509150600090505b818110156116de5761010860006101048381548110151561166f57fe5b90600052602060002090015460001916600019168152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560018201600090556002820160006116d19190611985565b5050806001019050611652565b6116e66118b9565b5050565b6000600190505b60015481101561182c575b6001548110801561171f575060006002826101008110151561171a57fe5b015414155b156117315780806001019150506116fc565b5b600180541180156117565750600060026001546101008110151561175257fe5b0154145b156117735760016000815480929190600190039190505550611732565b600154811080156117985750600060026001546101008110151561179357fe5b015414155b80156117b557506000600282610100811015156117b157fe5b0154145b15611827576002600154610100811015156117cc57fe5b0154600282610100811015156117de57fe5b0181905550806101026000600284610100811015156117f957fe5b0154815260200190815260200160002081905550600060026001546101008110151561182157fe5b01819055505b6116f1565b50565b600061183a336106c9565b151561184557600080fd5b6101075461185161196f565b11156118705760006101068190555061186861196f565b610107819055505b610106548261010654011015801561189057506101055482610106540111155b156118af578161010660008282540192505081905550600190506118b4565b600090505b919050565b600080610104805490509150600090505b8181101561195c576000600102610104828154811015156118e757fe5b906000526020600020900154600019161415156119515761010360006101048381548110151561191357fe5b906000526020600020900154600019166000191681526020019081526020016000206000808201600090556001820160009055600282016000905550505b8060010190506118ca565b610104600061196b9190611a79565b5050565b6000620151804281151561197f57fe5b04905090565b50805460018160011615610100020316600290046000825580601f106119ab57506119ca565b601f0160209004906000526020600020908101906119c99190611a9a565b5b50565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611a0e57803560ff1916838001178555611a3c565b82800160010185558215611a3c579182015b82811115611a3b578235825591602001919060010190611a20565b5b509050611a499190611a9a565b5090565b815481835581811511611a7457818360005260206000209182019101611a739190611abf565b5b505050565b5080546000825590600052602060002090810190611a979190611abf565b50565b611abc91905b80821115611ab8576000816000905550600101611aa0565b5090565b90565b611ae191905b80821115611add576000816000905550600101611ac5565b5090565b905600a165627a7a723058201d5cfe074d631e44b6ad06ddf905247ed206d3205bc8cb69221483f77f47a8080029',
        abi: JSON.stringify([
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "removeOwner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
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
                "name": "isOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "m_numOwners",
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
                "name": "m_lastDay",
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
                "name": "resetSpentToday",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "m_spentToday",
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
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "addOwner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "m_required",
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
                        "name": "_h",
                        "type": "bytes32"
                    }
                ],
                "name": "confirm",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_newLimit",
                        "type": "uint256"
                    }
                ],
                "name": "setDailyLimit",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    },
                    {
                        "name": "_data",
                        "type": "bytes"
                    }
                ],
                "name": "execute",
                "outputs": [
                    {
                        "name": "_r",
                        "type": "bytes32"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_operation",
                        "type": "bytes32"
                    }
                ],
                "name": "revoke",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_newRequired",
                        "type": "uint256"
                    }
                ],
                "name": "changeRequirement",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_operation",
                        "type": "bytes32"
                    },
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "hasConfirmed",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
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
                        "name": "ownerIndex",
                        "type": "uint256"
                    }
                ],
                "name": "getOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
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
                        "name": "_to",
                        "type": "address"
                    }
                ],
                "name": "kill",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    }
                ],
                "name": "changeOwner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "m_dailyLimit",
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
                "inputs": [
                    {
                        "name": "_owners",
                        "type": "address[]"
                    },
                    {
                        "name": "_required",
                        "type": "uint256"
                    },
                    {
                        "name": "_daylimit",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "operation",
                        "type": "bytes32"
                    }
                ],
                "name": "Confirmation",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "operation",
                        "type": "bytes32"
                    }
                ],
                "name": "Revoke",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "oldOwner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnerChanged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnerAdded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "oldOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnerRemoved",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "newRequirement",
                        "type": "uint256"
                    }
                ],
                "name": "RequirementChanged",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Deposit",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "SingleTransact",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "operation",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "MultiTransact",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "operation",
                        "type": "bytes32"
                    },
                    {
                        "indexed": false,
                        "name": "initiator",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "data",
                        "type": "bytes"
                    }
                ],
                "name": "ConfirmationNeeded",
                "type": "event"
            }
        ])
    };


    const testArray = {
        bytecode: '606060405234156200001057600080fd5b60405162000dc638038062000dc6833981016040526200003a90678000000000000000906200070e565b836000908051906020019062000052929190620000a8565b5082600190805190602001906200006b92919062000137565b508160029080519060200190620000849291906200019e565b5080600390805190602001906200009d929190620001f0565b505050505062000949565b82805482825590600052602060002090810192821562000124579160200282015b82811115620001235782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190620000c9565b5b5090506200013391906200029d565b5090565b8280548282559060005260206000209081019282156200018b579160200282015b828111156200018a57825182908051906020019062000179929190620002e3565b509160200191906001019062000158565b5b5090506200019a91906200036a565b5090565b828054828255906000526020600020908101928215620001dd579160200282015b82811115620001dc578251825591602001919060010190620001bf565b5b509050620001ec91906200039b565b5090565b82805482825590600052602060002090601f016020900481019282156200028a5791602002820160005b838211156200025957835183826101000a81548160ff02191690831515021790555092602001926001016020816000010492830192600103026200021a565b8015620002885782816101000a81549060ff021916905560010160208160000104928301926001030262000259565b505b509050620002999190620003c3565b5090565b620002e091905b80821115620002dc57600081816101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905550600101620002a4565b5090565b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200032657805160ff191683800117855562000357565b8280016001018555821562000357579182015b828111156200035657825182559160200191906001019062000339565b5b5090506200036691906200039b565b5090565b6200039891905b808211156200039457600081816200038a9190620003f6565b5060010162000371565b5090565b90565b620003c091905b80821115620003bc576000816000905550600101620003a2565b5090565b90565b620003f391905b80821115620003ef57600081816101000a81549060ff021916905550600101620003ca565b5090565b90565b50805460018160011615610100020316600290046000825580601f106200041e57506200043f565b601f0160209004906000526020600020908101906200043e91906200039b565b5b50565b6000620004508251620008dd565b905092915050565b600082601f83011215156200046c57600080fd5b8151620004836200047d826200080c565b620007de565b91508181835260208401935060208101905083856020840282011115620004a957600080fd5b60005b83811015620004dd5781620004c2888262000442565b845260208401935060208301925050600181019050620004ac565b5050505092915050565b600082601f8301121515620004fb57600080fd5b8151620005126200050c8262000835565b620007de565b915081818352602084019350602081019050838560208402820111156200053857600080fd5b60005b838110156200056c578162000551888262000684565b8452602084019350602083019250506001810190506200053b565b5050505092915050565b600082601f83011215156200058a57600080fd5b8151620005a16200059b826200085e565b620007de565b9150818183526020840193506020810190508360005b83811015620005eb5781518601620005d088826200069a565b845260208401935060208301925050600181019050620005b7565b5050505092915050565b600082601f83011215156200060957600080fd5b8151620006206200061a8262000887565b620007de565b915081818352602084019350602081019050838560208402820111156200064657600080fd5b60005b838110156200067a57816200065f8882620006f8565b84526020840193506020830192505060018101905062000649565b5050505092915050565b6000620006928251620008fd565b905092915050565b600082601f8301121515620006ae57600080fd5b8151620006c5620006bf82620008b0565b620007de565b91508082526020830160208301858383011115620006e257600080fd5b620006ef83828462000913565b50505092915050565b600062000706825162000909565b905092915050565b600080600080608085870312156200072557600080fd5b600085015167ffffffffffffffff8111156200074057600080fd5b6200074e8782880162000458565b945050602085015167ffffffffffffffff8111156200076c57600080fd5b6200077a8782880162000576565b935050604085015167ffffffffffffffff8111156200079857600080fd5b620007a687828801620005f5565b925050606085015167ffffffffffffffff811115620007c457600080fd5b620007d287828801620004e7565b91505092959194509250565b6000604051905081810181811067ffffffffffffffff821117156200080257600080fd5b8060405250919050565b600067ffffffffffffffff8211156200082457600080fd5b602082029050602081019050919050565b600067ffffffffffffffff8211156200084d57600080fd5b602082029050602081019050919050565b600067ffffffffffffffff8211156200087657600080fd5b602082029050602081019050919050565b600067ffffffffffffffff8211156200089f57600080fd5b602082029050602081019050919050565b600067ffffffffffffffff821115620008c857600080fd5b601f19601f8301169050602081019050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60008115159050919050565b6000819050919050565b60005b838110156200093357808201518184015260208101905062000916565b8381111562000943576000848401525b50505050565b61046d80620009596000396000f300606060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680638971727a14610067578063b021f5671461009d578063f01a4e0e146100d3578063fe99d72b14610109575b600080fd5b341561007257600080fd5b61008760046100829036906102a5565b61013f565b604051610094919061034c565b60405180910390f35b34156100a857600080fd5b6100bd60046100b89036906102a5565b610172565b6040516100ca9190610331565b60405180910390f35b34156100de57600080fd5b6100f360046100ee9036906102a5565b6101b1565b6040516101009190610367565b60405180910390f35b341561011457600080fd5b61012960046101249036906102a5565b61026d565b6040516101369190610389565b60405180910390f35b60038181548110151561014e57fe5b9060005260206000209060209182820401919006915054906101000a900460ff1681565b60008181548110151561018157fe5b90600052602060002090016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6001818154811015156101c057fe5b90600052602060002090016000915090508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102655780601f1061023a57610100808354040283529160200191610265565b820191906000526020600020905b81548152906001019060200180831161024857829003601f168201915b505050505081565b60028181548110151561027c57fe5b90600052602060002090016000915090505481565b600061029d82356103e5565b905092915050565b6000602082840312156102b757600080fd5b60006102c584828501610291565b91505092915050565b6102d7816103af565b82525050565b6102e6816103cf565b82525050565b60006102f7826103a4565b80845261030b8160208601602086016103ef565b61031481610422565b602085010191505092915050565b61032b816103db565b82525050565b600060208201905061034660008301846102ce565b92915050565b600060208201905061036160008301846102dd565b92915050565b6000602082019050818103600083015261038181846102ec565b905092915050565b600060208201905061039e6000830184610322565b92915050565b600081519050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60008115159050919050565b6000819050919050565b6000819050919050565b60005b8381101561040d5780820151818401526020810190506103f2565b8381111561041c576000848401525b50505050565b6000601f19601f83011690509190505600a265627a7a723058200e82b8ae908422a29ca186e1c380db019ed9f4ad2ead1e429a63851610554ce86c6578706572696d656e74616cf50037',
        abi: JSON.stringify([
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Booleans",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
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
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Addresses",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
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
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Names",
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
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "Numbers",
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
                "inputs": [
                    {
                        "name": "owners",
                        "type": "address[]"
                    },
                    {
                        "name": "names",
                        "type": "string[]"
                    },
                    {
                        "name": "numbers",
                        "type": "uint256[]"
                    },
                    {
                        "name": "booleans",
                        "type": "bool[]"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            }
        ])
    };

    //Object.assign(initContract, multisig);
    //Object.assign(initContract, testArray);


    $scope.tx = initTrans;

    $scope.rawTx = null;

    $scope.signedTx = null;

    $scope.contract = initContract;

    $scope.selectedAbi = ajaxReq.abiList[0];

    $scope.showRaw = false;

    $scope.$watch(function () {
        if (walletService.wallet == null) return null;
        return walletService.wallet.getAddressString();
    }, function () {
        if (walletService.wallet == null) return;
        $scope.wallet = walletService.wallet;
        $scope.wd = true;
        $scope.tx.nonce = 0;

    });


    /*
        Reset data on visibility switch
     */
    $scope.$watch('visibility', function () {

        $scope.tx = Object.assign({}, $scope.tx, initTrans);
        $scope.contract = Object.assign({}, $scope.contract, initContract);


        $scope.rawTx = null;
        $scope.signedTx = null;

    });

    $scope.$watch('contract.address', function (newValue, oldValue) {
        if ($scope.Validator.isValidAddress($scope.contract.address)) {

            for (var i in ajaxReq.abiList) {
                if (ajaxReq.abiList[i].address.toLowerCase() === $scope.contract.address.toLowerCase()) {
                    $scope.contract.abi = ajaxReq.abiList[i].abi;
                    break;
                }
            }
        }
    });
    $scope.selectExistingAbi = function (index) {
        $scope.selectedAbi = ajaxReq.abiList[index];
        $scope.contract.address = $scope.selectedAbi.address;
        $scope.addressDrtv.ensAddressField = $scope.selectedAbi.address;
        $scope.addressDrtv.showDerivedAddress = false;
        $scope.dropdownExistingContracts = false;
        $scope.contract.selectedFunc = null
        $scope.dropdownContracts = false;

        if ($scope.initContractTimer) clearTimeout($scope.initContractTimer);
        $scope.initContractTimer = setTimeout(function () {
            $scope.initContract();
        }, 50);
    };


    $scope.$watch('contract.bytecode', function (newVal, oldVal) {


        $scope.tx.data = handleContractData();

    });


    /*


        if adding params to constructor, append params to data
     */

    function handleContractData() {

        const {applyConstructorParams, abi, constructorParams, bytecode, selectedFunc} = $scope.contract;


        if ($scope.visibility === 'interactView') {


            if (selectedFunc === null) {

                return '';
            }

            return $scope.getContractData();
        }

        else if (applyConstructorParams && abi) {


            return ethFuncs.sanitizeHex(bytecode + ethUtil.solidityCoder.encodeParams(
                constructorParams.inputs.map(i => i.type),
                constructorParams.inputs.map(i => {

                    // if array split values

                    if (i.type.slice(-2) === '[]') {

                        // filter blank values

                        // TODO: update UI

                        return i.value.filter(item => item !== "");
                    }

                    return i.value;
                })
            ))

        }


        return ethFuncs.sanitizeHex(bytecode);
    }


    $scope.estimateGasLimit = function (callback = null) {


        const {value, unit, to, data} = $scope.tx;

        if (!data) {

            $scope.tx.gasLimit = '';
            return false;
        }


        var estObj = {

            from: $scope.wallet && $scope.wallet.getAddressString() ? $scope.wallet.getAddressString() : globalFuncs.donateAddress,
            data: handleContractData(),

        };

        if (to && to !== '0xCONTRACT') {

            estObj.to = to;
        }


        estObj.value = ethFuncs.sanitizeHex(ethFuncs.decimalToHex(etherUnits.toWei(value, unit)));


        $scope.tx.gasLimit = 'loading...';


        ethFuncs.estimateGas(estObj, function (data) {


            if (data.error) {

                $scope.tx.gasLimit = '';

                $scope.notifier.danger(data.msg);

            } else {

                $scope.tx.gasLimit = data.data;
            }

            if (callback) {

                callback();
            }

        });
    };


    $scope.generateTx = function (callback = null) {

        let {data, gasLimit} = $scope.tx;

        try {
            if ($scope.wallet == null) throw globalFuncs.errorMsgs[3];
            else if (!ethFuncs.validateHexString(data)) throw globalFuncs.errorMsgs[9];
            else if (!globalFuncs.isNumeric(gasLimit) || parseFloat(gasLimit) <= 0) throw globalFuncs.errorMsgs[8];


            $scope.tx.data = handleContractData();

            const walletString = $scope.wallet.getAddressString();


            ajaxReq.getTransactionData(walletString, function (data) {

                if (data.error) {
                    $scope.notifier.danger(data.msg);
                }


                $scope.tx.to = $scope.tx.to || '0xCONTRACT';

                $scope.tx.contractAddr = $scope.tx.to === '0xCONTRACT' ? ethFuncs.getDeteministicContractAddress(walletString, data.data.nonce) : '';

                var txData = uiFuncs.getTxData($scope);


                uiFuncs.generateTx(txData, function (rawTx) {
                    if (!rawTx.isError) {
                        $scope.rawTx = rawTx.rawTx;
                        $scope.signedTx = rawTx.signedTx;

                        $scope.showRaw = true;

                    } else {
                        $scope.showRaw = false;
                        $scope.notifier.danger(rawTx.error);
                    }
                    if (!$scope.$$phase) $scope.$apply();
                });
            });
        } catch (e) {
            $scope.notifier.danger(e);
        } finally {

            if (callback) {

                $scope.sendContractModal.open();
            }
        }
    };


    $scope.sendTx = function () {
        $scope.sendTxModal.close();
        $scope.sendContractModal.close();
        uiFuncs.sendTx($scope.signedTx, function (resp) {
            if (!resp.isError) {
                var bExStr = $scope.ajaxReq.type !== nodes.nodeTypes.Custom ? "<a href='" + $scope.ajaxReq.blockExplorerTX.replace("[[txHash]]", resp.data) + "' target='_blank' rel='noopener'> View your transaction </a>" : '';
                var contractAddr = $scope.tx.contractAddr ? " & Contract Address <a href='" + ajaxReq.blockExplorerAddr.replace('[[address]]', $scope.tx.contractAddr) + "' target='_blank' rel='noopener'>" + $scope.tx.contractAddr + "</a>" : '';
                $scope.notifier.success(globalFuncs.successMsgs[2] + "<br />" + resp.data + "<br />" + bExStr + contractAddr);
            } else {
                $scope.notifier.danger(globalFuncs.errorMsgs[17].replace('{}', ajaxReq.type));
            }
        });
    };

    $scope.setVisibility = function (str) {
        $scope.visibility = str;


    };

    $scope.selectFunc = function (index) {
        $scope.contract.selectedFunc = {name: $scope.contract.functions[index].name, index: index};
        if (!$scope.contract.functions[index].inputs.length) {
            $scope.readFromContract();
            $scope.showRead = false;
        } else $scope.showRead = true;
        $scope.dropdownContracts = !$scope.dropdownContracts;
    };


    /*

        Gather contract information

     */

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


    /*

      Write to a contract
   */

    $scope.writeToContract = function () {
        if (!$scope.wd) {
            $scope.notifier.danger(globalFuncs.errorMsgs[3]);
            return;
        }

        $scope.tx.to = $scope.contract.address;
        $scope.tx.data = $scope.getContractData();

        // estimate gas limit via ajax request, generate tx data, open sendTransactionModal

        $scope.estimateGasLimit($scope.generateTx.bind(this, true));


    };


    $scope.toggleContractParams = function () {


        $scope.contract.applyConstructorParams = !$scope.contract.applyConstructorParams;


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
    $scope.initContract = function () {
        try {
            if (!$scope.Validator.isValidAddress($scope.contract.address)) throw globalFuncs.errorMsgs[5];
            else if (!$scope.Validator.isJSON($scope.contract.abi)) throw globalFuncs.errorMsgs[26];
            $scope.contract.functions = [];
            var tAbi = JSON.parse($scope.contract.abi);
            for (var i in tAbi)
                if (tAbi[i].type == "function") {
                    tAbi[i].inputs.map(function (i) {
                        i.value = '';
                    });
                    $scope.contract.functions.push(tAbi[i]);
                }
            $scope.showReadWrite = true;

        } catch (e) {
            $scope.notifier.danger(e);
        }
    };


    $scope.$watch('contract.abi', function handleAbiUpdate(newVal) {


        if ($scope.visibility === 'deployView') {


            const constructor = $scope.initConstructorParamsFrom(newVal);

            if (constructor &&
                constructor.hasOwnProperty('inputs') &&
                Array.isArray(constructor.inputs) &&
                constructor.inputs.length > 0
            ) {

                $scope.contract.abi = newVal;

                $scope.contract.constructorParams = constructor;

            }


        }


    });

    $scope.initConstructorParamsFrom = function (abi) {

        try {

            if (Array.isArray(abi) && abi.length === 0) {

                return abi;
            }

            abi = JSON.parse(abi);

        } catch (e) {


            console.error('error parsing abi', abi);

            return [];
        }


        const constructor = abi.find(i => i.type === 'constructor');

        if (!constructor) {


            $scope.notifier.danger('No constructor found in abi');
            return [];
        }

        constructor.inputs.forEach(input => input.value = '');

        return constructor;


    }
}
module.exports = contractsCtrl;
