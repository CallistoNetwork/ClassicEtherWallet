<form
        ng-show="dexns_status === 2"
        ng-submit="handleRegisterAndUpdateName($event)"
        class="capitalize-form-label"
>

    <label for="tokenName">
        Token Name (DexNS name)
    </label>

    <input required id="tokenName" name="tokenName" type="text" class="form-control" ng-model="input.tokenName"
           ng-class="input.tokenName ? 'is-valid' : 'is-invalid'"
    />


    <!--<label for="owner">-->
    <!--owner-->
    <!--</label>-->
    <!--<input name="owner" id="owner" ng-model="input.owner" class="form-control"/>-->

    <!--<label for="destination">-->
    <!--destination-->
    <!--</label>-->
    <!--<input name="destination" id="destination" ng-model="input.destination" class="form-control"/>-->


    <!--<label for="hideOwner">-->
    <!--hideOwner-->
    <!--</label>-->

    <!--<input type="checkbox" name="hideOwner" id="hideOwner" ng-model="input.hideOwner" class="form-control"/>-->

    <!--<label for="assign">-->
    <!--assign-->
    <!--</label>-->
    <!--<input type="checkbox" name="assign" id="assign" ng-model="input.assign" class="form-control"/>-->

    <hr/>

    <h5>Optional token parameters</h5>

    <label for="abi">
        abi
    </label>
    <textarea
            placeholder='[{ "type":"contructor", "inputs": [{ "name":"param1", "type":"uint256", "indexed":true }], "name":"Event" }, { "type":"function", "inputs": [{"name":"a", "type":"uint256"}], "name":"foo", "outputs": [] }] '
            rows="5" name="abi" id="abi" ng-model="input.abi" class="form-control"
    ></textarea>
    <label for="link">
        link
    </label>
    <input
            placeholder="https://bitcointalk.org/"
            type="url" name="link" id="link" ng-model="input.link" class="form-control"
            ng-class="Validator.isValidURL(input.link) ? 'is-valid' : 'is-invalid'"
    />
    <label for="sourceCode">
        sourceCode
    </label>
    <input

            placeholder="https://github.com/"
            type="url" name="sourceCode" id="sourceCode" ng-model="input.sourceCode" class="form-control"
            ng-class="Validator.isValidURL(input.sourceCode) ? 'is-valid' : 'is-invalid'"

    />
    <label for="info">
        info
    </label>
    <input name="info" id="info" ng-model="input.info" class="form-control"
           placeholder="brief description of the token"/>


    <label for="tokenNetwork">token network</label>


    <select class="form-control" id="tokenNetwork" name="tokenNetwork" ng-model="input.tokenNetwork">
        <option ng-repeat="node in noder"
                value="{{node}}"
        >{{node}}</option>
    </select>




    <button type="submit" class="btn btn-primary">Register Token</button>
</form>
