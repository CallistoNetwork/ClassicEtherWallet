<!-- Content -->
<article class="col-sm-8">


    <div class="block">
        <form send-transaction-form
              name="sendTransactionForm"
        >
        </form>

        <div class="row form-group" ng-show="showRaw">
            <div class="col-sm-6">
                <label for="rawTx" translate="SEND_raw"> Raw Transaction </label>
                <textarea class="form-control" id="rawTx" rows="4" readonly>{{rawTx}}</textarea>
            </div>
            <div class="col-sm-6">
                <label for="signedTx" translate="SEND_signed"> Signed Transaction </label>
                <textarea name="signedTx" id="signedTx" class="form-control" rows="4" readonly>{{signedTx}}</textarea>
            </div>
        </div>

        <div class="clearfix form-group" ng-show="showRaw">
            <a class="btn btn-primary btn-block col-sm-11" data-toggle="modal" data-target="#sendTransaction"
               translate="SEND_trans"> Send Transaction </a>
        </div>
    </div>
</article>
<!-- / Content -->

<!-- Sidebar -->
<article class="col-sm-4">

    <wallet-balance-drtv></wallet-balance-drtv>


    <div ng-show="checkTxPage" ng-click="checkTxReadOnly=!checkTxReadOnly" class="small text-right text-gray-lighter">
        <small>Advanced Users Only.</small>
    </div>

</article>
<!-- / Sidebar -->
