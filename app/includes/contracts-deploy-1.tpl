<section class="col-xs-12">

    <!-- Byte Code -->
    <div class="form-group">
        <h4 translate="CONTRACT_ByteCode"> Byte Code: </h4>
        <textarea
            class="form-control"
            rows="8"
            ng-model="contract.bytecode"
            ng-class="Validator.isValidHex(contract.bytecode) && contract.bytecode != '' ? 'is-valid' : 'is-invalid'"></textarea>
    </div>

    <a ng-click="toggleContractParams()" ng-show="true" class="">
        <p class="strong ng-scope" ng-show="!contract.applyConstructorParams" translate="TRANS_params">+Advanced: Add
            Params</p>
        <p class="strong ng-scope" ng-show="contract.applyConstructorParams" translate="TRANS_params_remove">-Advanced:
            Remove Params</p>
    </a>

    <section class="col-xs-12 clearfix"
             ng-show="contract.applyConstructorParams"
    >
        <label translate="CONTRACT_Json"> ABI / JSON Interface </label>
        <textarea class="form-control"
                  rows="6"
                  placeholder='[{ "type":"contructor", "inputs": [{ "name":"param1", "type":"uint256", "indexed":true }], "name":"Event" }, { "type":"function", "inputs": [{"name":"a", "type":"uint256"}], "name":"foo", "outputs": [] }] '
                  ng-class="Validator.isJSON(contract.abi) ? 'is-valid' : 'is-invalid'"
                  ng-model="contract.abi"
        ></textarea>
    </section>

    <div
        ng-show="contract.applyConstructorParams && contract.abi"
        ng-repeat="input in contract.constructorParams.inputs track by $index"
        class="form-group"
    >

        @@include( '../includes/contract-input.tpl', { "site": "cew" } )


    </div>

    <!-- Gas -->
    <div class="form-group">
        <h4 translate="TRANS_gas"> Gas: </h4>
        <div class="input-group">
            <input class="form-control"
                   type="text"
                   placeholder="300000"
                   ng-model="tx.gasLimit"
                   ng-class="Validator.isPositiveNumber(tx.gasLimit) ? 'is-valid' : 'is-invalid'"/>

            <div class="input-group-btn">
                <button style="min-width: 170px"
                        class="btn btn-default"
                        ng-click="estimateGasLimit()"
                > Estimate gasLimit
                </button>
            </div>
        </div>
    </div>

    <!-- Sign TX Button (once wallet has been unlocked) -->
    <div class="form-group">
        <a class="btn btn-info btn-block" ng-click="generateTx()" ng-show="wd" translate="DEP_signtx"> Sign
            Transaction </a>
    </div>

    <!-- TXs -->
    <section class="row" ng-show="showRaw">
        <!-- Raw TX -->
        <div class="form-group col-sm-6">
            <h4 translate="SEND_raw"> Raw Transaction </h4>
            <textarea class="form-control" rows="4" readonly>{{rawTx}}</textarea>
        </div>
        <!-- Singed TX -->
        <div class="form-group col-sm-6">
            <h4 translate="SEND_signed"> Signed Transaction </h4>
            <textarea class="form-control" rows="4" readonly>{{signedTx}}</textarea>
        </div>
    </section>

    <!-- Deploy Contract Button (once tx has been signed) -->
    <div class="form-group" ng-show="showRaw">
        <a class="btn btn-primary btn-block" data-toggle="modal" data-target="#deployContract"
           translate="NAV_DeployContract"> Deploy Contract </a>
    </div>


</section>
