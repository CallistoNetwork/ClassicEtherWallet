<!-- STEP READ/WRITE -->
<section class="col-xs-12 clearfix">

    <!-- Contract Info CONTRACT_Interact_CTA -->
    <span class="form-group">
    <h4 translate="CONTRACT_Interact_Title">Read / Write Contract </h4>
    <h5> {{ contract.address }} </h5>

    <div class="form-group well"
         ng-show="contract.address=='0x0101010101010101010101010101010101010101' || contract.address=='0x1010101010101010101010101010101010101010'">
      <p> Please change the address to your Multisig Address to your own address.</p>
    </div>

    <div class="form-group well" ng-show="contract.address=='0xd0a6E6C54DbC68Db5db3A091B171A77407Ff7ccf'">
      <ol>
        <li><strong>Generate EOS Key-pair</strong></li>
        <li><strong>Register / Map your EOS Key</strong>
          <ul>
            <li>Select <code>register</code></li>
            <li> Enter your <strong><u>EOS Public Key</u></strong> <--- CAREFUL! EOS PUBLIC KEY!</li>
            <li>Unlock wallet</li>
            <li><span translate="SEND_amount">Amount to Send</span>: <code>0</code> &middot; <span
                    translate="TRANS_gas">Gas Limit</span>: at least <code>90000</code></li>
          </ul>
        </li>
        <li><strong>Fund EOS Contract on Send Page</strong>
          <ul>
            <li>Go to Send Ether & Tokens Page</li>
            <li>Unlock same wallet you are unlocking here.</li>
            <li>Send Amount you want to Contribute to <code>0xd0a6E6C54DbC68Db5db3A091B171A77407Ff7ccf</code></li>
            <li><span translate="TRANS_gas">Gas Limit</span>: at least <code>90000</code></li>
          </ul>
        </li>
        <li><strong>Claim EOS Tokens</strong>
          <ul>
            <li>Select <code>claimAll</code>.</li>
            <li>Unlock wallet</li>
            <li><span translate="SEND_amount">Amount to Send</span>: <code>0</code> &middot; <span
                    translate="TRANS_gas">Gas Limit</span>: at least <code>90000</code></li>
          </ul>
        </li>
      </ol>
    </div>

    <div class="btn-group">
      <a class="btn btn-default" ng-click="dropdownContracts = !dropdownContracts">
      {{contract.selectedFunc==null ? "Select a function" : contract.selectedFunc.name}}<i class="caret"></i></a>
      <ul class="dropdown-menu" ng-show="dropdownContracts">
        <li ng-repeat="func in contract.functions track by $index"><a
                ng-click="selectFunc($index)">{{func.name}}</a></li>
      </ul>
    </div>
  </span>

    <!-- Write -->
    <span class="form-group" ng-show="contract.selectedFunc!=null">
    <div ng-repeat="input in contract.functions[contract.selectedFunc.index].inputs track by $index">
        @@include( '../includes/contract-input.tpl', { "site": "cew" } )

      </div>
  </span>
    <!-- / Write -->


    <!-- Output -->
    <span class="form-group output" ng-show="contract.functions[contract.selectedFunc.index].constant">
    <div ng-repeat="output in contract.functions[contract.selectedFunc.index].outputs track by $index"
         class="form-group">

              @@include( '../includes/contract-output.tpl', { "site": "cew" } )

    </div>
  </span>
    <!-- / Output -->


</section>
