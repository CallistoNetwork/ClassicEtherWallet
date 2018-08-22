<div class="row" ng-show="dexns_status === 3">


    <!-- Function Selector -->

    <div class="btn-group">
        <a class="btn btn-default" ng-click="dropdownContracts = !dropdownContracts">
            {{selectedFunc == null ? "Select a function" : selectedFunc.name}}<i
            class="caret"></i></a>
        <ul class="dropdown-menu" ng-show="dropdownContracts">
            <li ng-repeat="func in visibleFuncList track by $index"
                ng-class="func.stateMutability === 'view' ? 'btn-read' : 'btn-write'"
            ><a
                style="color: rgb(0,0,0);"
                ng-click="selectFunc(func);">{{func.name}}</a></li>
        </ul>
    </div>

    <!-- Contract Input & Output -->

    <div
        class="row"
        ng-repeat="_function in visibleFuncList track by _function.index + _function.name + $index"
        ng-show="selectedFunc.name === _function.name && selectedFunc.index === _function.index"
    >
        <!-- Input -->
        <form
            ng-class="_function.stateMutability === 'view' ? 'col-sm-6' : 'col-sm-12'"
            ng-submit="handleSubmit(_function);"
        >
            <div ng-repeat="input in _function.inputs">
                @@include( '../includes/contract-input.tpl', { "site": "cew" } )
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


            <table class="table table-responsive" title="Metadata"
            >
                <caption>Outputs</caption>

                <tbody>
                <!-- Custom Metadata UI -->


                <tr
                    ng-if="_function.name === 'metadataOf'"
                    ng-repeat="input in outputs[_function.name] track by $index"
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

                <!-- Generic Contract output UI -->

                <tr ng-if="_function.name !== 'metadataOf'">

                    <td ng-repeat="output in outputs[_function.name] track by $index"
                        class="form-group">
                        @@include( '../includes/contract-output.tpl', { "site": "cew" } )
                    </td>

                </tr>
                </tbody>
            </table>


            <div
                ng-if="_function.name === 'metadataOf' && raw"
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
                                {{ raw }}

                            </textarea>
            </div>

        </div>


    </div>
</div>
