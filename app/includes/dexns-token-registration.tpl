<form
        ng-show="dexns_status === 2"
        ng-submit="handleRegisterAndUpdateName($event)"
        class="capitalize-form-label"
>

    <label for="tokenName">
        Token Name (DexNS name)
    </label>

    <input id="tokenName" name="tokenName" type="text" class="form-control" ng-model="input.tokenName"/>


    <label for="owner">
        owner
    </label>
    <input name="owner" id="owner" ng-model="input.owner" class="form-control"/>

    <label for="destination">
        destination
    </label>
    <input name="destination" id="destination" ng-model="input.destination" class="form-control"/>


    <label for="hideOwner">
        hideOwner
    </label>

    <input type="checkbox" name="hideOwner" id="hideOwner" ng-model="input.hideOwner" class="form-control"/>

    <label for="assign">
        assign
    </label>
    <input type="checkbox" name="assign" id="assign" ng-model="input.assign" class="form-control"/>

    <h3>Metadata (optional)</h3>

    <label for="abi">
        abi
    </label>
    <textarea rows="5" name="abi" id="abi" ng-model="input.abi" class="form-control"></textarea>
    <label for="link">
        link
    </label>
    <input name="link" id="link" ng-model="input.link" class="form-control"/>
    <label for="sourceCode">
        sourceCode
    </label>
    <input name="sourceCode" id="sourceCode" ng-model="input.sourceCode" class="form-control"/>
    <label for="info">
        info
    </label>
    <input name="info" id="info" ng-model="input.info" class="form-control"/>


    <label for="tokenNetwork">token network</label>
    <input class="form-control" id="tokenNetwork" name="tokenNetwork" ng-model="input.tokenNetwork"/>


    <button type="submit" class="btn btn-primary">Register Token</button>
</form>
