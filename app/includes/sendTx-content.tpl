<!-- Content -->
<article class="col-sm-7 block">


        <form send-transaction-form
              name="sendTransactionForm"
        >
        </form>

        <div ng-show="showRaw">
            <div class="row form-group">
                <div class="col-sm-6">
                    <label for="rawTx" translate="SEND_raw"> Raw Transaction </label>
                    <textarea class="form-control" id="rawTx" rows="4" readonly>{{rawTx}}</textarea>
                </div>
                <div class="col-sm-6">
                    <label for="signedTx" translate="SEND_signed"> Signed Transaction </label>
                    <textarea name="signedTx" id="signedTx" class="form-control" rows="4"
                              readonly>{{signedTx}}</textarea>
                </div>
            </div>

            <div class="clearfix form-group">
                <a class="btn btn-primary btn-block col-sm-11" data-toggle="modal" data-target="#sendTransaction"
                   translate="SEND_trans"> Send Transaction </a>
            </div>
        </div>
</article>
<!-- / Content -->

<article class="col-sm-5">

    <sidebar></sidebar>


</article>
