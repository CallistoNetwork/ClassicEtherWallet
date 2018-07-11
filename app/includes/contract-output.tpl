<div ng-switch on="output.type">
    <!-- Address -->
    <div class="item write-address" ng-switch-when="address">
        <label> &#8627; {{output.name}}
            <small> {{output.type}}</small>
        </label>
        <div class="row">
            <div class="col-xs-11"><input class="form-control" type="text" placeholder="0x314156..."
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
        <input class="form-control" type="text" placeholder="151" ng-model="output.value" readonly/>
    </p>
    <!-- Address -->
    <p class="item write-string" ng-switch-when="string">
        <label> &#8627; {{output.name}}
            <small> {{output.type}}</small>
        </label>
        <input class="form-control" type="text" placeholder="Ohh! Shiny!" ng-model="output.value" readonly/>
    </p>
    <!-- Bytes -->
    <p class="item write-bytes" ng-switch-when="bytes">
        <label> &#8627; {{output.name}}
            <small> {{output.type}}</small>
        </label>
        <input class="form-control" type="text" placeholder="0x151bc..." ng-model="output.value" readonly/>
    </p>
    <!-- Boolean -->
    <p class="item write-boolean" ng-switch-when="bool">
        <label> &#8627; {{output.name}}
            <small> {{output.type}}</small>
        </label>
        <span ng-show="output.value==true" class="output-boolean-true"> <img src="images/icon-check-green.svg"
                                                                             width="22px" height="22px"/> TRUE </span>
        <span ng-show="output.value==false" class="output-boolean-false"> <img src="images/icon-x.svg" width="22px"
                                                                               height="22px"/>  FALSE </span>
    </p>
    <!--  -->
    <p class="item" ng-switch-default>
        <label> &#8627; {{output.name}}
            <small> {{output.type}}</small>
        </label>
        <input class="form-control" type="text" placeholder="" ng-model="output.value" readonly/>
    </p>
</div>
