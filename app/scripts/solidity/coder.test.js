/*

       glad we don't have to compile contracts
       I was able to compile contract and deploy successfully,
       but with generic contract, not sure about compiling more
       advanced.

   */

//var greeterContracts = 'pragma solidity ^0.4.9; contract greeter { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { return greeting; } } ';
var greeterContracts =
    "pragma solidity ^0.4.9; contract greeter { string public greeting; function greeter(string _greeting) public { greeting = _greeting; } } ";

var solc = require("solc");

var assert = require("assert");

var solidityCoder = require("./coder");
var solidityUtils = require("./utils");

const ethUtil = {
    solidityCoder,
    solidityUtils
};

describe("solidity", function() {
    describe("constructor parameter encoding", function() {
        var abi = [
            {
                constant: false,
                inputs: [],
                name: "claimHeirOwnership",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                constant: false,
                inputs: [
                    {
                        name: "newHeir",
                        type: "address"
                    }
                ],
                name: "setHeir",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                constant: false,
                inputs: [],
                name: "proclaimDeath",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                constant: false,
                inputs: [],
                name: "heartbeat",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                constant: true,
                inputs: [],
                name: "heartbeatTimeout",
                outputs: [
                    {
                        name: "",
                        type: "uint256"
                    }
                ],
                payable: false,
                stateMutability: "view",
                type: "function"
            },
            {
                constant: true,
                inputs: [],
                name: "owner",
                outputs: [
                    {
                        name: "",
                        type: "address"
                    }
                ],
                payable: false,
                stateMutability: "view",
                type: "function"
            },
            {
                constant: true,
                inputs: [],
                name: "heir",
                outputs: [
                    {
                        name: "",
                        type: "address"
                    }
                ],
                payable: false,
                stateMutability: "view",
                type: "function"
            },
            {
                constant: true,
                inputs: [],
                name: "timeOfDeath",
                outputs: [
                    {
                        name: "",
                        type: "uint256"
                    }
                ],
                payable: false,
                stateMutability: "view",
                type: "function"
            },
            {
                constant: false,
                inputs: [],
                name: "removeHeir",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                constant: false,
                inputs: [
                    {
                        name: "newOwner",
                        type: "address"
                    }
                ],
                name: "transferOwnership",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        name: "_heartbeatTimeout",
                        type: "uint256"
                    }
                ],
                payable: false,
                stateMutability: "nonpayable",
                type: "constructor"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        name: "owner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        name: "newHeir",
                        type: "address"
                    }
                ],
                name: "HeirChanged",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        name: "owner",
                        type: "address"
                    }
                ],
                name: "OwnerHeartbeated",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        name: "owner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        name: "heir",
                        type: "address"
                    },
                    {
                        indexed: false,
                        name: "timeOfDeath",
                        type: "uint256"
                    }
                ],
                name: "OwnerProclaimedDead",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        name: "previousOwner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        name: "newOwner",
                        type: "address"
                    }
                ],
                name: "HeirOwnershipClaimed",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        name: "previousOwner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        name: "newOwner",
                        type: "address"
                    }
                ],
                name: "OwnershipTransferred",
                type: "event"
            }
        ];

        let constructor = null;

        function constructorFrom(abi) {
            const constructor = abi.find(i => i.type === "constructor");

            if (!constructor) return null;

            constructor.inputs.forEach(input => (input.value = ""));

            return constructor;
        }

        it("locates constructor from abi", function() {
            const constructor_ = constructorFrom(abi);

            assert(constructor_);

            constructor = constructor_;
        });

        it("sucessfully encodes params", function() {
            function encodeParams(constructor) {
                const curFunc = constructor;

                return ethUtil.solidityCoder.encodeParams(
                    curFunc.inputs.map(i => i.type),
                    curFunc.inputs.map(i => i.value)
                );
            }

            constructor.inputs[0].value = 86400;

            var params = encodeParams(constructor);

            assert(params);
        });
    });

    describe("solidarity compiler", function() {
        function compileExampleContract() {
            var input = "contract x { function g() {} }";
            // Setting 1 as second paramateractivates the optimiser
            var output = solc.compile(input, 1);

            var contracts = [];
            for (var contractName in output.contracts) {
                // code and ABI that are needed by web3
                // console.log(contractName + ': ' + output.contracts[contractName].bytecode) //
                //console.log('\n');

                //console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface))

                contracts.push(
                    output.contracts[contractName].bytecode,
                    JSON.stringify(output.contracts[contractName].interface)
                );
            }

            return contracts;
        }

        function compileExampleContracts() {
            var input = {
                "lib.sol":
                    "library L { function f() returns (uint) { return 7; } }",
                "cont.sol":
                    'import "lib.sol"; contract x { function g() { L.f(); } }'
            };

            var contracts = [];
            var output = solc.compile({ sources: input }, 1);
            for (var contractName in output.contracts) {
                console.log(
                    contractName +
                        ": " +
                        output.contracts[contractName].bytecode
                );

                contracts.push(
                    output.contracts[contractName].bytecode,
                    JSON.stringify(output.contracts[contractName].interface)
                );
            }

            return contracts;
        }

        function compileContract() {
            // Setting 1 as second paramateractivates the optimiser
            var output = solc.compile(greeterContracts, 1);

            var contracts_ = [];

            Object.keys(output.contracts).forEach(key => {
                contracts_.push(
                    output.contracts[key].bytecode,
                    JSON.stringify(output.contracts[key].interface)
                );
            });

            return contracts_;
        }

        it("should compile example contract", function() {
            var contracts = compileExampleContract();

            assert(contracts);
        });

        it("should compile two example contracts", function() {
            var contracts = compileExampleContracts();

            assert(contracts.length, 4);
        });

        it("should compile custom contract", function() {
            var contracts = compileContract();

            assert(contracts.length, 4);
        });

        it("should add constructor params to compiled contract", function() {
            var contracts = compileContract();

            var bytecode = contracts[0];

            var abi = JSON.parse(contracts[1]);

            var txData =
                bytecode + solidityCoder.encodeParams(["uint256"], ["7776000"]);

            const TX_DATA =
                "0x6060604052341561000f57600080fd5b60405161029a38038061029a833981016040528080518201919050508060009080519060200190610041929190610048565b50506100ed565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008957805160ff19168380011785556100b7565b828001600101855582156100b7579182015b828111156100b657825182559160200191906001019061009b565b5b5090506100c491906100c8565b5090565b6100ea91905b808211156100e65760008160009055506001016100ce565b5090565b90565b61019e806100fc6000396000f300606060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063ef690cc014610046575b600080fd5b341561005157600080fd5b6100596100d4565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561009957808201518184015260208101905061007e565b50505050905090810190601f1680156100c65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60008054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561016a5780601f1061013f5761010080835404028352916020019161016a565b820191906000526020600020905b81548152906001019060200180831161014d57829003601f168201915b5050505050815600a165627a7a723058209e602367f7746dd733aa6d5e1ebcaf2ddfbf7aa4813b2a087f38ee21734a2fb2002900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002796f000000000000000000000000000000000000000000000000000000000000";

            //FIXME: tx data is not matching when compiling, yet deploys successfully w/ params
            assert.equal(txData, TX_DATA);
        });
    });
});
