<main
    ng-if="globalService.currentTab === globalService.tabs.contracts.id"
    class="tab-pane contracts active"
    ng-controller='contractsCtrl'
    ng-cloak
>

    <!-- Modals -->

    <!-- Interact Modal -->
    <!-- Interact Modal -->
    <article class="modal fade" id="interactWithContractModal" tabindex="-1">
        <section class="modal-dialog">
            <form name="sendContractTx" ng-submit="sendTx()" contract-interact-modal>
            </form>
        </section>
    </article>
    <!-- / Interact Modal -->

    <!-- Contract Deploy Modal -->

    <article class="modal fade" id="deployContract" tabindex="-1">
        <section class="modal-dialog">
            <section class="modal-content">
                <div class="modal-body" ng-if="tx.contractAddr">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h2 class="modal-title" translate="SENDModal_Title">Confirm Transaction!</h2>


                    <div class="row col-xs-12">You are about to
                        <strong>
                            deploy a contract
                        </strong>
                    </div>
                    <a href="{{ajaxReq.blockExplorerAddr.replace('[[address]]', tx.contractAddr);}}" target="_blank" rel="noopener">
                        <div class="row col-xs-12 d-flex justify-content-center align-items-center">
                            <div class="addressIdenticon med"
                                 title="Address Indenticon"
                                 style="display: inline-block; margin: 1rem;"
                                 blockie-address="{{tx.contractAddr}}"
                                 watch-var="tx.contractAddr">

                            </div>
                            <span>{{ethUtil.toChecksumAddress(tx.contractAddr)}}</span>
                        </div>
                    </a>
                    <div class="row col-xs-12">
                        On the
                        <b>
                            <coin-icon icon="{{ajaxReq.type.toLowerCase()}}"></coin-icon>
                            Chain
                        </b>
                    </div>


                    <h4 translate="SENDModal_Content_3"> Are you sure you want to do this? </h4>
                </div>

                <div ng-init="showDetails = false;" class="container-fluid">
                    <div class="row">
                        <div class="text-center col-xs-12">
                            <button type="button"
                                    class="btn btn-default"
                                    ng-click="showDetails = !showDetails"
                            >Details
                            </button>
                        </div>
                    </div>
                    <div ng-show="showDetails" class="row">
                        <textarea readonly class="form-control" title="tx details" rows="5">
                            {{tx | json }}
                        </textarea>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
                        No, get me out of here!
                    </button>
                    <button class="btn btn-primary" ng-click="sendTx()" translate="SENDModal_Yes">
                        Yes, I am sure! Make transaction.
                    </button>
                </div>

            </section>
        </section>
    </article>


    <!-- /Contract Deploy Modal -->

    <!-- Modals -->


    <!-- Title -->
    <div class="block text-center">
        <h2>
            <a translate="NAV_InteractContract" ng-class="{'isActive': visibility === 'interactView'}"
               ng-click="setVisibility('interactView')"> Interact with Contract </a>
            or
            <a translate="NAV_DeployContract" ng-class="{'isActive': visibility === 'deployView'}"
               ng-click="setVisibility('deployView')"> Deploy Contract </a>
        </h2>
    </div>
    <!-- / Title -->


    <!-- Interact Contracts -->

    <div ng-show="visibility === 'interactView'">


        <article class="row block">

            @@if (site === 'cew' ) { @@include( '../includes/contracts-interact-1.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/contracts-interact-1.tpl', { "site": "cx" } ) }

        </article>


        <article class="row block" ng-show="showReadWrite">

            @@if (site === 'cew' ) { @@include( '../includes/contracts-interact-2.tpl', { "site": "cew" } ) }
            @@if (site === 'cx' ) { @@include( '../includes/contracts-interact-2.tpl', { "site": "cx" } ) }

        </article>


        <!-- / Interact Contracts -->

    </div>
    <!-- Deploy Contract -->
    <article class="row block" ng-show="visibility === 'deployView'">

        @@if (site === 'cew' ) { @@include( '../includes/contracts-deploy-1.tpl', { "site": "cew" } ) }
        @@if (site === 'cx' ) { @@include( '../includes/contracts-deploy-1.tpl', { "site": "cx" } ) }

    </article>
    <!-- / Deploy Contract -->

    <article class="col-xs-12" ng-show="contract.selectedFunc!=null && visibility === 'interactView'">

        <button class="btn btn-primary btn-block" ng-click="readFromContract()"
                ng-show="contract.functions[contract.selectedFunc.index].constant && showRead">
            <span translate="CONTRACT_Read"> READ</span>
        </button>

        <button class="btn btn-primary btn-block" ng-click="writeToContract()"
                ng-show="!contract.functions[contract.selectedFunc.index].constant">
            <span translate="CONTRACT_Write"> WRITE</span>
        </button>

    </article>


    <!--wallet decrypt-->

    <div ng-click="wd = !wd" class="marg-v-md">

        <h1>
                 <span
                     style="margin: 0; padding: 0 2px;"
                     class="collapse-button glyphicon"
                     ng-class="wd ? 'glyphicon-plus' : 'glyphicon-minus'"
                 ></span>
            <span>Change Wallet</span>
        </h1>
    </div>
    <article class="form-group"
             ng-show="!wd">
        @@if (site === 'cx' ) {
        <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
        }
        @@if (site === 'cew' ) {
        <wallet-decrypt-drtv></wallet-decrypt-drtv>
        }
    </article>


</main>
