<!-- STEP READ/WRITE -->
<section class="col-xs-12 clearfix">

    <!-- Contract Info CONTRACT_Interact_CTA -->
    <div class="form-group">
        <h4>
            <span translate="CONTRACT_Interact_Title">
            Read / Write Contract
            </span>

            <a href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', ethUtil.toChecksumAddress(contract.address))}}"
               target="_blank" rel="noopener"
               class="pull-right"
            >
                <small class="d-inline-flex align-items-center justify-content-center">
                    <div class="addressIdenticon med" title="Address Indenticon" blockie-address="{{contract.address}}"
                         watch-var="contract.address"></div>
                    {{ ethUtil.toChecksumAddress(contract.address) }}
                </small>
            </a>
        </h4>

        <div class="form-group well"
             ng-show="contract.address === '0x0101010101010101010101010101010101010101' || contract.address === '0x1010101010101010101010101010101010101010'">
            <p> Please change the address to your Multisig Address to your own address.</p>
        </div>

        <eos-keypair></eos-keypair>

        <div class="btn-group">
            <a class="btn btn-default" ng-click="dropdownContracts = !dropdownContracts">
                {{!(contract.selectedFunc && contract.selectedFunc.name) ? "Select a function" : contract.selectedFunc.name}}<i
                class="caret"></i></a>
            <ul class="dropdown-menu" ng-show="dropdownContracts">
                <li ng-repeat="func in contract.functions track by $index"
                    ng-class="func.stateMutability === 'view' ? 'btn-read' : 'btn-write'"
                ><a
                    style="color: rgb(0,0,0)"
                    ng-click="selectFunc($index)">{{func.name}}</a></li>
            </ul>
        </div>
    </div>


    <!-- Write -->
    <div class="form-group" ng-show="contract.selectedFunc">
        <form name="writeValue"
              ng-show="contract.selectedFunc &&
              contract.selectedFunc.stateMutability  &&
              'payable' === contract.selectedFunc.stateMutability"
        >
            <label translate="SEND_amount">Amount to Send:</label>
            <div class="input-group col-sm-11">
                <input
                    type="number"
                    class="form-control"
                    min="0"
                    step="1e-18"
                    placeholder="{{ 'SEND_amount_short' | translate }}"
                    ng-model="tx.value"
                    autocomplete="off"
                    ng-model-options="{debounce: 500}"
                    spellcheck="false"
                    name="value"
                    ng-class="writeValue.value.$valid ? 'is-valid' : 'is-invalid'"
                />
                <div class="input-group-btn">
                    <a style="min-width: 170px"
                       class="btn"
                    >
                        <coin-icon icon="{{ajaxReq.type.toLowerCase()}}"></coin-icon>
                    </a>
                </div>
            </div>
        </form>

        <div ng-repeat="input in contract.functions[contract.selectedFunc.index].inputs track by $index">

            @@include( '../includes/contract-input.tpl', { "site": "cew" } )

        </div>
    </div>
    <!-- / Write -->
    <!-- Output -->
    <div class="form-group output" ng-show="(contract.functions[contract.selectedFunc.index].constant || contract.functions[contract.selectedFunc.index].stateMutability === 'view')">
        <div ng-repeat="output in contract.functions[contract.selectedFunc.index].outputs track by $index"
             class="form-group">

            @@include( '../includes/contract-output.tpl', { "site": "cew" } )


        </div>
    </div>
    <!-- / Output -->


</section>
