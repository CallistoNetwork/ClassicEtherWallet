<main class="tab-pane dexns-tab active"
      ng-if="globalService.currentTab === globalService.tabs.dexns.id"
      ng-controller='DexnsController'
      ng-cloak
>


    @@if (site === 'cew' ) { @@include( './sendTx-contract-modal.tpl', { "site": "cew" } ) }
    @@if (site === 'cx' ) { @@include( './sendTx-contract-modal.tpl', { "site": "cx" } ) }


    <!-- Dexns Register Name Modal -->
    <article ng-show="(dexns_status==7)" class="modal fade" id="dexnsConfirmModal" tabindex="-1">
        <section class="modal-dialog">
            <section class="modal-content">

                <div class="modal-body">

                    <button type="button" class="close" data-dismiss="modal">&times;</button>

                    <h2 class="modal-title">
                        You are about to
                        <span ng-show="(dexns_status==7)"> register a name:</span>
                    </h2>

                    <div>
                        <h4>{{ DexNSName }}</h4>
                        <small>You will pay

                            {{tx.value / 1e18 | number }}
                            {{dexnsService.feContract.network}} for this name.
                        </small>
                        <small>You will own this name for 1 year.</small>
                    </div>

                    <table class="table">
                        <tbody>
                        <tr class="text-center">
                            <td>
                                <div class="addressIdenticon med" title="Address Indenticon"
                                     blockie-address="{{walletService.wallet.getAddressString()}}"
                                     watch-var="wallet.getAddressString()"></div>
                            </td>
                            <td class="mono">-><br/>

                                {{tx.value / 1e18 | number }}


                                {{dexnsService.feContract.network}}
                            </td>
                            <td>
                                <div class="addressIdenticon med" title="Address Indenticon" blockie-address="{{tx.to}}"
                                     watch-var="tx.to"></div>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <p> The <strong>{{dexnsService.feContract.network}}</strong> node you are sending through is provided by
                        <strong>{{dexnsService.feContract.service}}</strong>.
                    </p>

                    <h4 translate="SENDModal_Content_3"> Are you sure you want to do this? </h4>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-default" data-dismiss="modal" translate="SENDModal_No">
                        No, get me out of here!
                    </button>
                    <button class="btn btn-primary" ng-click="_registerName()" translate="SENDModal_Yes">
                        Yes, I am sure! Make transaction.
                    </button>
                </div>

            </section>
        </section>
    </article>
    <!-- Dexns Register Name Modal -->



    <div class="block">


        <div class="row text-right">
            <button
                class="btn btn-default"
                ng-click="init();"
            >
                Reset
            </button>

        </div>


        <!-- Title -->
        <article class="cont-md">
            <h1 class="text-center" translate="NAV_DexNS"> DexNS </h1>
            <h2 class="text-center" translate="NAV_Decentralized_Naming_Service"> Decentralized Naming Service </h2>
            <p>
                <a href="https://github.com/EthereumCommonwealth/DexNS/blob/master/README.md"
                   target="_blank"
                   rel="noopener"
                >
                    DexNS
                </a>

                is a distributed, open-source name service based on Ethereum Classic smart-contracts.
                You can register human-readable names for personal use, names for smart-contracts or
                symbolic names for your tokens.
            </p>
            <p>
                DexNS supports all names without any limitations, but it is recommended to use only letters and numbers
                without white spaces.
            </p>
            <p>
                Registration of the Name will cost you <code>


                {{toEther(dexnsService.feContract.namePrice[0].value)}}

                {{dexnsService.feContract.network}}


            </code>, and you will own each
                registered name for <code>
                1 year


            </code>. You
                can
                also extend the term of
                ownership of the Names before
                the expiry date, but you must pay the name price again to extend name binding period.

            </p>
        </article>
        <!-- / Title -->

        <br/>

        <article class="row" ng-show="(dexns_status === 0)">
            <section class="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
                <button class="btn btn-primary btn-block" ng-click="openRegisterName()"> I am a user and I want to
                    register a Name
                    for my address
                </button>
                <button class="btn btn-primary btn-block"
                        ng-click="openRegisterToken()"> I am a token developer and I
                    want to register my token symbol
                </button>
                <button class="btn btn-primary btn-block" ng-click="dexns_status = 3"> I want to manage my
                    DexNS name(s)
                </button>

                <!--<button class="btn btn-default" ng-click="checkName()"> I am a smart-contract developer </button> -->

            </section>
        </article>


        <!-- Unlock Directive: Everything but notAvailable & forbidden -->
        <article class="row" ng-show="(dexns_status === 1)">
            <section class="clearfix collapse-container">
                <article class="row">
                    <section class="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
                        <form ng-submit="handleCheckName()">
                            <label for="DexNSName">DexNS Name</label>

                            <input class="form-control"
                                   type="text"
                                   id="DexNSName"
                                   placeholder="my_name@gmail.com"
                                   ng-model="DexNSName"
                                   ng-class="'is-valid'"
                            />
                            <button class="btn btn-primary" type="submit"> Check DexNS Name</button>
                        </form>
                    </section>
                </article>
            </section>
        </article>


        <form
            ng-show="dexns_status === 2"
            ng-submit="handleRegisterAndUpdateName(tokenRegistration)"
            class="capitalize-form-label"
            novalidate
            name="tokenRegistration"
            dexns-token-registration-form
        >
        </form>

        <!-- Unlock Directive: Everything but notAvailable & forbidden -->
        <article class="row" ng-show="(dexns_status === 6 || dexns_status === 7)">
            <section class="clearfix collapse-container">
                <article class="row">
                    <p class="text-center"> You are going to register: </p>
                    <section class="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
                        <div>
                            <p class="form-control"
                            >
                                <code> {{ DexNSName }} </code>
                            </p>
                        </div>
                        <button class="btn btn-primary" ng-click="registerDexNSName()"> Register this name!</button>
                    </section>
                </article>
            </section>
        </article>


        <!-- / Unlock Directive: Everything but notAvailable / forbidden -->


        @@if (site === 'cew' ) { @@include( './dexns-contract-interact.tpl', { "site": "cew" } ) }
        @@if (site === 'cx' ) { @@include( './dexns-contract-interact.tpl', { "site": "cx" } ) }


        <div ng-show="!wd">
            @@if (site === 'cew' ) {
            <wallet-decrypt-drtv></wallet-decrypt-drtv>
            }
            @@if (site === 'cx' ) {
            <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
            }
        </div>


    </div>

</main>
