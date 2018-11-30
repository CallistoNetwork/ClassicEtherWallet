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
            ng-class="_function.stateMutability === 'view' ? 'col-sm-4' : 'col-sm-12'"
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

        <div class="col-sm-8" ng-if="_function.stateMutability === 'view'">


            <table class="table table-responsive" title="Metadata"
            >
                <caption>{{_function.name}}</caption>

                <tbody>
                <!-- Custom Metadata UI -->


                <tr
                    ng-if="_function.name === 'metadataOf'"
                    ng-repeat="input in outputs[_function.name] track by $index"
                    class="row"
                >
                    <td>{{input.key}}</td>

                    <td>
                        <a
                            ng-if="['link', 'source'].includes(input.key)"
                            href="{{input.value}}"
                            target="_blank"
                        >
                            {{input.value}}
                        </a>
                        <div ng-if="'network' === input.key">
                            <coin-icon

                                icon="{{input.value.toLowerCase()}}"/>
                        </div>

                        <div ng-if="!['link', 'source', 'network'].includes(input.key)">
                            <span>{{input.value}}</span>
                        </div>

                    </td>


                </tr>

                <tr
                    ng-if="_function.name === 'metadataOf' && raw"
                >
                    <td colspan="2">
                        <code>
                            {{raw}}
                        </code>
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


        </div>


    </div>
</div>
