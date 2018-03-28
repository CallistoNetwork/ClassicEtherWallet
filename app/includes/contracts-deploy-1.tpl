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

    <span class="form-group" ng-show="contract.applyConstructorParams && contract.abi">
      <div ng-repeat="input in contract.constructorParams.inputs track by $index">

          <div ng-if="input.type.slice(-2) === '[]'">


              <!-- huh, why aren't directives w/ links loading -->

              <!--<wallet-decrypt-drtv></wallet-decrypt-drtv>-->
              <!--<address-field>-->

              <array-input-drtv type="{{input.type}}"></array-input-drtv>
          </div>
        <div ng-if="input.type.slice(-2) !== '[]'" ng-switch on="input.type">
            <div class="item write-address" ng-switch-when="address">
            <label> {{input.name}} <small> {{input.type}} </small> </label>
            <div class="row">
              <div class="col-xs-11"><input class="form-control" type="text" placeholder="0x314156..."
                                            ng-model="input.value"
                                            ng-class="Validator.isValidAddress(input.value) ? 'is-valid' : 'is-invalid'"/></div>
              <div class="col-xs-1"><div class="addressIdenticon med" title="Address Indenticon"
                                         blockie-address="{{input.value}}" watch-var="input.value"></div></div>
            </div>
            </div>
            <p class="item write-unit256" ng-switch-when="uint256">
              <label> {{input.name}} <small> {{input.type}} </small> </label>
              <input class="form-control" type="text" placeholder="151" ng-model="input.value"
                     ng-class="Validator.isPositiveNumber(input.value) ? 'is-valid' : 'is-invalid'"/>
            </p>
            <p class="item write-string" ng-switch-when="string">
              <label> {{input.name}} <small> {{input.type}} </small> </label>
              <input class="form-control" type="text" placeholder="Ohh! Shiny!" ng-model="input.value"
                     ng-class="input.value!='' ? 'is-valid' : 'is-invalid'"/>
            </p>
            <p class="item write-bytes" ng-switch-when="bytes">
              <label> {{input.name}} <small> {{input.type}} </small> </label>
              <input class="form-control" type="text" placeholder="0x151bc..." ng-model="input.value"
                     ng-class="Validator.isValidHex(input.value) ? 'is-valid' : 'is-invalid'"/>
            </p>
            <p class="item write-boolean" ng-switch-when="bool">
              <label> {{input.name}} <small> {{input.type}} </small> </label>
              <span class="radio"><label><input ng-model="input.value" type="radio" name="optradio-{{input.name}}"
                                                ng-value="true">True</label></span>
              <span class="radio"><label><input ng-model="input.value" type="radio" name="optradio-{{input.name}}"
                                                ng-value="false">False</label></span>
            </p>
            <p class="item" ng-switch-default>
              <label> {{input.name}} <small> {{input.type}} </small> </label>
              <input class="form-control" type="text" placeholder="" ng-model="input.value"
                     ng-class="input.value!='' ? 'is-valid' : 'is-invalid'"/>
            </p>
        </div>
      </div>
    </span>

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

    @@if (site === 'cew' ) { @@include( '../includes/contracts-deploy-modal.tpl', { "site": "cew" } ) }
    @@if (site === 'cx' ) { @@include( '../includes/contracts-deploy-modal.tpl', { "site": "cx" } ) }

</section>
