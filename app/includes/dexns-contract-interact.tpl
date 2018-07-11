<div class="row" ng-show="dexns_status === 3">


    <div class="btn-group">
        <a class="btn btn-default" ng-click="dropdownContracts = !dropdownContracts">
            {{selectedFunc == null ? "Select a function" : selectedFunc}}<i
                class="caret"></i></a>
        <ul class="dropdown-menu" ng-show="dropdownContracts">
            <li ng-repeat="func in visibleFuncList track by $index"
                ng-class="func.stateMutability === 'view' ? 'btn-read' : 'btn-write'"
            ><a
                    ng-click="selectFunc(func);">{{func.name}}</a></li>
        </ul>
    </div>

    <div
            class="row"
            ng-repeat="_function in visibleFuncList track by $index"
            ng-show="selectedFunc === _function.name"

    >


        <form
                ng-class="_function.stateMutability === 'view' ? 'col-sm-6' : 'col-sm-12'"

                ng-submit="handleSubmit(_function);"
        >
            <div ng-repeat="input in _function.inputs track by $index">


                <div>
                    <div ng-if="input.type.slice(-2) === '[]'">
                        <array-input-drtv name="{{input.name}}" type="{{input.type}}"></array-input-drtv>
                    </div>
                    <div ng-if="input.type.slice(-2) !== '[]'" ng-switch on="input.type">
                        <div class="item write-address" ng-switch-when="address">
                            <label> {{input.name}}
                                <small> {{input.type}}</small>
                            </label>
                            <div class="row">
                                <div class="col-xs-11"><input class="form-control" type="text"
                                                              placeholder="0x314156..."
                                                              ng-model="input.value"
                                                              ng-class="Validator.isValidAddress(input.value) ? 'is-valid' : 'is-invalid'"/>
                                </div>
                                <div class="col-xs-1">
                                    <div class="addressIdenticon med" title="Address Indenticon"
                                         blockie-address="{{input.value}}" watch-var="input.value"></div>
                                </div>
                            </div>
                        </div>
                        <p class="item write-unit256" ng-switch-when="uint256">
                            <label> {{input.name}}
                                <small> {{input.type}}</small>
                            </label>
                            <input class="form-control" type="text" placeholder="151" ng-model="input.value"
                                   ng-class="Validator.isPositiveNumber(input.value) ? 'is-valid' : 'is-invalid'"/>
                        </p>
                        <p class="item write-string" ng-switch-when="string">
                            <label> {{input.name}}
                                <small> {{input.type}}</small>
                            </label>
                            <input class="form-control" type="text" placeholder="Ohh! Shiny!"
                                   ng-model="input.value"
                                   ng-class="input.value!='' ? 'is-valid' : 'is-invalid'"/>
                        </p>
                        <p class="item write-bytes" ng-switch-when="bytes">
                            <label> {{input.name}}
                                <small> {{input.type}}</small>
                            </label>
                            <input class="form-control" type="text" placeholder="0x151bc..."
                                   ng-model="input.value"
                                   ng-class="Validator.isValidHex(input.value) ? 'is-valid' : 'is-invalid'"/>
                        </p>
                        <p class="item write-boolean" ng-switch-when="bool">
                            <label> {{input.name}}
                                <small> {{input.type}}</small>
                            </label>
                            <span class="radio"><label><input ng-model="input.value" type="radio"
                                                              name="optradio-{{input.name}}"
                                                              ng-value="true">True</label></span>
                            <span class="radio"><label><input ng-model="input.value" type="radio"
                                                              name="optradio-{{input.name}}"
                                                              ng-value="false">False</label></span>
                        </p>
                        <p class="item" ng-switch-default>
                            <label> {{input.name}}
                                <small> {{input.type}}</small>
                            </label>
                            <input class="form-control" type="{{input.type}}" placeholder=""
                                   ng-model="input.value"
                                   ng-class="input.value!='' ? 'is-valid' : 'is-invalid'"/>
                        </p>
                    </div>
                </div>
            </div>

            <button
                    type="submit"
                    class="btn"
                    ng-class="_function.stateMutability === 'view' ? 'btn-read' : 'btn-write'"

            >
                {{_function.name}}
            </button>
        </form>

        <div class="col-sm-6" ng-if="_function.stateMutability === 'view'">


            <div class="table-responsive">

                <table class="table table-hover" title="Metadata"
                >
                    <caption>
                        Result
                    </caption>

                    <tbody>


                    <tr
                            ng-if="_function.name === 'metadataOf'"
                            ng-repeat="input in METADATA track by $index"
                            class="row"
                    >
                        <td>{{input.key}}</td>

                        <td ng-if="['link', 'source'].includes(input.key)"
                        >
                            <a
                                    href="{{input.value}}"
                                    target="_blank"
                            >

                                {{input.value}}

                            </a>
                        </td>

                        <td ng-if="!['link', 'source'].includes(input.key)">
                            {{input.value}}
                        </td>

                    </tr>


                    <tr ng-if="_function.name !== 'metadataOf'">

                        <td ng-repeat="output in outputs[_function.name] track by $index"
                            class="form-group">
                            <div ng-switch on="output.type">
                                <!-- Address -->
                                <div class="item write-address" ng-switch-when="address">
                                    <label> &#8627; {{output.name}}
                                        <small> {{output.type}}</small>
                                    </label>
                                    <div class="row">
                                        <div class="col-xs-11"><input class="form-control" type="text"
                                                                      placeholder="0x314156..."
                                                                      ng-model="output.value" readonly/></div>
                                        <div class="col-xs-1">
                                            <div class="addressIdenticon med" title="Address Indenticon"
                                                 blockie-address="{{output.value}}" watch-var="output.value"></div>
                                        </div>
                                    </div>
                                </div>
                                <!-- unit256 -->
                                <p class="item write-unit256" ng-switch-when="uint256">
                                    <label> &#8627; {{output.name}}
                                        <small> {{output.type}}</small>
                                    </label>
                                    <input

                                            class="form-control" type="text" placeholder="151" ng-model="output.value"
                                            ng-value="output.value"
                                            readonly/>
                                </p>
                                <!-- Address -->
                                <p class="item write-string" ng-switch-when="string">
                                    <label> &#8627; {{output.name}}
                                        <small> {{output.type}}</small>
                                    </label>
                                    <input class="form-control" type="text" placeholder="Ohh! Shiny!"
                                           ng-model="output.value" readonly/>
                                </p>
                                <!-- Bytes -->
                                <p class="item write-bytes" ng-switch-when="bytes">
                                    <label> &#8627; {{output.name}}
                                        <small> {{output.type}}</small>
                                    </label>
                                    <input class="form-control" type="text" placeholder="0x151bc..."
                                           ng-model="output.value" readonly/>
                                </p>
                                <!-- Boolean -->
                                <p class="item write-boolean" ng-switch-when="bool">
                                    <label> &#8627; {{output.name}}
                                        <small> {{output.type}}</small>
                                    </label>
                                    <span ng-show="output.value==true" class="output-boolean-true"> <img
                                            src="images/icon-check-green.svg"
                                            width="22px" height="22px"/> TRUE </span>
                                    <span ng-show="output.value==false" class="output-boolean-false"> <img
                                            src="images/icon-x.svg" width="22px"
                                            height="22px"/>  FALSE </span>
                                </p>
                                <!--  -->
                                <p class="item" ng-switch-default>
                                    <label> &#8627; {{output.name}}
                                        <small> {{output.type}}</small>
                                    </label>
                                    <input class="form-control" type="text" placeholder="" ng-model="output.value"
                                           readonly/>
                                </p>
                            </div>
                        </td>

                    </tr>
                    </tbody>
                </table>

            </div>

            <div
                    ng-if="_function.name === 'metadataOf' && METADATA[0].value"
            >
                <label
                        for="metadata"
                >
                    Meta Data:
                </label>
                <textarea
                        title="raw metadata"
                        id="metadata"
                        class="form-control"
                        readonly
                        rows="5"
                >
                                {{ METADATA | json }}

                            </textarea>
            </div>

        </div>


        <!--<div ng-repeat="output in _function.outputs track by $index">-->
        <!--<p>{{output | json}}</p>-->
        <!--</div>-->


    </div>
</div>
