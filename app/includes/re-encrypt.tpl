<main class="tab-pane active"
      ng-if="[globalService.tabs.reEncrypt.id].includes(globalService.currentTab)"
      ng-controller='encryptCtrl as $ctrl'
      ng-cloak
>


    <div class="block">
        <h1 class="text-center" translate="NAV_Encrypt">Encrypt</h1>

        <div ng-show="!wd">
            @@if (site === 'cx' ) {
            <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
            }
            @@if (site === 'cew' ) {
            <wallet-decrypt-drtv></wallet-decrypt-drtv>
            }
        </div>


    </div>

    <div ng-show="wd">


        <div ng-if="loading">
            <div class="bouncing-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div ng-if="!loading && !newWallet">
            <form ng-submit="reEncrypt($event, $ctrl.input.newPassword)"
            >

                <div class="input-group">
                    <input
                        name="newPassword"
                        id="newPassword"
                        class="form-control"
                        type="{{showPass && 'password' || 'text'}}"
                        placeholder="{{'GEN_YOUR_NEW_PASSWORD' | translate }}"
                        ng-model="$ctrl.input.newPassword"
                        ng-class="$ctrl.input.newPassword.length > 8 ? 'is-valid' : 'is-invalid'"
                        aria-label="{{'GEN_Label_1' |translate}}"
                    />
                    <span tabindex="0" aria-label="make password visible"
                          role="button" class="input-group-addon eye"
                          ng-click="showPass=!showPass"></span>
                </div>
                <button type="submit"

                        class="btn btn-primary" translate="NAV_Encrypt"></button>
            </form>
        </div>

        <!--  SAVE WALLET INFO -->


        <div ng-if="!loading && newWallet">
            <section class="block__main gen__2--inner">
                <br/>
                <h1 translate="GEN_Label_2">Save your Keystore File (UTC / JSON) </h1>

                <a tabindex="0" role="button"
                   class="btn btn-primary"
                   href="{{newWalletDetails.blob}}"
                   download="{{newWalletDetails.fileName}}"
                   aria-label="{{'x_Download'|translate}} {{'x_Keystore'|translate}}"
                   aria-describedby="x_KeystoreDesc"
                   ng-click="downloaded()"
                   target="_self"
                   rel="noopener noreferrer"
                >
                    <span translate="x_Download"> DOWNLOAD </span> <span translate="x_Keystore2"> Keystore File (UTC / JSON) </span>
                </a>

                <div class="warn">
                    <p><strong>Do not lose it!</strong> It cannot be recovered if you lose it.</p>
                    <p><strong>Do not share it!</strong> Your funds will be stolen if you use this file on a
                        malicious/phishing site.</p>
                    <p><strong>Make a backup!</strong> Secure it like the millions of dollars it may one day be worth.
                    </p>
                </div>

                <p>
                    <a tabindex="0" role="button" class="btn btn-danger"
                       ng-class="newWalletDetails.downloaded ? '' : 'disabled' " ng-click="continueToPaper()"
                       translate="GET_ConfButton">
                        I understand. Continue.
                    </a>
                </p>

            </section>
        </div>

        <!-- PAPER WALLET -->

        <article role="main" class="block__wrap gen__3" ng-show="showPaperWallet">

            <section class="block__main gen__3--inner">

                <br/>

                <h1 translate="GEN_Label_5"> Save your Private Key</h1>
                <input aria-label="{{'x_PrivKey'|translate}}" aria-describedby="x_PrivKeyDesc"
                       value="{{wallet.getPrivateKeyString()}}"
                       class="form-control"
                       type="text"
                       readonly="readonly"
                       style="max-width: 50rem;margin: auto;"/>

                <br/>

                <a tabindex="0" aria-label="{{'x_Print'|translate}}" aria-describedby="x_PrintDesc" role="button"
                   class="btn btn-primary" ng-click="printQRCode()" translate="x_Print">PRINT</a>

                <div class="warn">
                    <p><strong>Do not lose it!</strong> It cannot be recovered if you lose it.</p>
                    <p><strong>Do not share it!</strong> Your funds will be stolen if you use this file on a
                        malicious/phishing site.</p>
                    <p><strong>Make a backup!</strong> Secure it like the millions of dollars it may one day be worth.
                    </p>
                </div>

                <br/>

                <a class="btn btn-default btn-sm" ng-click="getAddress()">
                    <span translate="GEN_Label_3"> Save your Address </span> →
                </a>

            </section>

            <section class="block__help">
                <h2 translate="GEN_Help_4">Guides &amp; FAQ</h2>
                <ul>
                    <li>
                        <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-save-slash-backup-my-wallet"
                           target="_blank" rel="noopener">
                            <strong translate="HELP_2a_Title">How to Save & Backup Your Wallet.</strong>
                        </a></li>
                    <li>
                        <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/protecting-yourself-and-your-funds"
                           target="_blank" rel="noopener">
                            <strong translate="GEN_Help_15">Preventing loss &amp; theft of your funds.</strong>
                        </a></li>
                    <li>
                        <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/what-are-the-different-formats-of-a-private-key"
                           target="_blank" rel="noopener">
                            <strong translate="GEN_Help_16">What are these Different Formats?</strong>
                        </a></li>
                </ul>

                <h2 translate="GEN_Help_17"> Why Should I? </h2>
                <ul>
                    <li translate="GEN_Help_18"> To have a secondary backup.</li>
                    <li translate="GEN_Help_19"> In case you ever forget your password.</li>
                    <li>
                        <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/how-do-i-safely-slash-offline-slash-cold-storage-with-myetherwallet"
                           target="_blank" rel="noopener" translate="GEN_Help_20">Cold Storage</a>
                    </li>
                </ul>

                <h2 translate="x_PrintDesc"></h2>

            </section>

        </article>

        <!-- /PAPER WALLET -->

    </div>


</main>
