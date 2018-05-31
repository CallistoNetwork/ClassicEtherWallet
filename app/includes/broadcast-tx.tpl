<main class="tab-pane active"
      ng-if="globalService.currentTab === globalService.tabs.broadcastTx.id"
      ng-controller='broadcastTxCtrl'
      ng-cloak>

    <h2 class="text-center">Broadcast Signed Transaction</h2>

    <p class="text-center">
        Paste a signed transaction and click 'send transaction'
    </p>


    <form ng-submit="handleSubmit()">
        <label>Signed Transaction</label>
        <input ng-model="input.signedTx" class="form-control">

        <div ng-show="validTx()">
            <h3>Raw Transaction</h3>
            <code>{{input.rawTx}}</code>
        </div>
        <button class="btn btn-primary">Send Transaction</button>
    </form>

    <h1>QR code</h1>
</main>
