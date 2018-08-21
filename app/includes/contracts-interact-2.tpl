<!-- STEP READ/WRITE -->
<section class="col-xs-12 clearfix">

    <!-- Contract Info CONTRACT_Interact_CTA -->
    <div class="form-group">
        <h4 translate="CONTRACT_Interact_Title">Read / Write Contract </h4>
        <h5> {{ contract.address }} </h5>

        <div class="form-group well"
             ng-show="contract.address=='0x0101010101010101010101010101010101010101' || contract.address=='0x1010101010101010101010101010101010101010'">
            <p> Please change the address to your Multisig Address to your own address.</p>
        </div>

        <eos-keypair></eos-keypair>

        <div class="btn-group">
            <a class="btn btn-default" ng-click="dropdownContracts = !dropdownContracts">
                {{contract.selectedFunc==null ? "Select a function" : contract.selectedFunc.name}}<i class="caret"></i></a>
            <ul class="dropdown-menu" ng-show="dropdownContracts">
                <li ng-repeat="func in contract.functions track by $index"><a
                    ng-click="selectFunc($index)">{{func.name}}</a></li>
            </ul>
        </div>
    </div>

    <!-- Write -->
    <div class="form-group" ng-show="contract.selectedFunc">
        <div ng-repeat="input in contract.functions[contract.selectedFunc.index].inputs track by $index">

            @@include( '../includes/contract-input.tpl', { "site": "cew" } )

            <!--<contract-input input="{{input}}"></contract-input>-->

        </div>
    </div>
    <!-- / Write -->
    <!-- Output -->
    <div class="form-group output" ng-show="contract.functions[contract.selectedFunc.index].constant">
        <div ng-repeat="output in contract.functions[contract.selectedFunc.index].outputs track by $index"
             class="form-group">

            @@include( '../includes/contract-output.tpl', { "site": "cew" } )

            <!--<contract-output output="{{output}}"></contract-output>-->

        </div>
    </div>
    <!-- / Output -->


</section>
