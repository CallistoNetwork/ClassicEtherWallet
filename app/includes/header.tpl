<header class="{{curNode.name}} {{curNode.service}} nav-index-{{gService.currentTab}}"
        aria-label="header">

    @@if (site === 'cew' ) {
    <div class="small announcement">
        <div class="container">
            <big>⚠ SECURITY ALERT!<br>There is a security vulnerability in <a
                href="https://github.com/ethereum/EIPs/issues/20">ERC20 token standard</a>. ERC20 tokens are <a
                href="https://gist.github.com/Dexaran/ddb3e89fe64bf2e06ed15fbd5679bd20">insecure</a>!<br>Use ERC20
                tokens at your own risk. ClassicEtherWallet is not responsible for the consequences of using tokens of
                this standard.</big><br>
            Do not transfer ERC20 tokens into any smart-contract using the <code>transfer</code> function. This will
            result in the loss of your tokens.
            <br/>
        </div>
    </div>
    }

    @@if (site === 'cx' ) {
    <div class="small announcement annoucement-danger">
        <div class="container" translate="CX_Warning_1">Make sure you have <strong>external backups</strong> of any
            wallets you store here. Many things could happen that would cause you to lose the data in this Chrome
            Extension, including uninstalling the extension. This extension is a way to easily access your wallets,
            <strong>not</strong> a way to back them up.
        </div>
    </div>
    }

    <article class="modal fade" id="customNodeModal" tabindex="-1">
        <section class="modal-dialog">
            <section class="modal-content">
                <form name="customNodeForm" custom-node-form ng-submit="saveCustomNode()">
                </form>
            </section>
        </section>
    </article>


    <section class="bg-gradient header-branding">
        <section class="container">
            @@if (site === 'cew' ) {
            <a class="brand" href="https://ethereumproject.github.io/etherwallet/" aria-label="Go to homepage">
                <img src="images/logo-myetherwallet.png" height="64px" width="245px" alt="ClassicEtherWallet"/>
            </a>
            }
            @@if (site === 'cx' ) {
            <a class="brand" href="/cx-wallet.html" aria-label="Go to homepage">
                <img src="images/logo-myetherwallet.png" height="64px" width="245px" alt="ClassicEtherWallet"/>
            </a>
            }
            <div class="tagline">

                <!--<span>3.11.0.0</span>-->

                <span class="dropdown dropdown-lang" ng-cloak>
          <a tabindex="0" aria-haspopup="true" aria-expanded="false"
             aria-label="change language. current language {{curLang}}" class="dropdown-toggle  btn btn-white"
             ng-click="dropdown = !dropdown">{{curLang}}<i class="caret"></i></a>
          <ul class="dropdown-menu" ng-show="dropdown">
            <li><a ng-class="{true:'active'}[curLang=='Deutsch']" ng-click="changeLanguage('de','Deutsch'     )"> Deutsch         </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Ελληνικά']" ng-click="changeLanguage('el','Ελληνικά'    )"> Ελληνικά        </a></li>
            <li><a ng-class="{true:'active'}[curLang=='English']" ng-click="changeLanguage('en','English'     )"> English         </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Español']" ng-click="changeLanguage('es','Español'     )"> Español         </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Suomi']"
                   ng-click="changeLanguage('fi','Suomi'       )"> Suomi           </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Français']" ng-click="changeLanguage('fr','Français'    )"> Français        </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Magyar']"
                   ng-click="changeLanguage('hu','Magyar'      )"> Magyar          </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Indonesian']" ng-click="changeLanguage('id','Indonesian'  )"> Bahasa Indonesia</a></li>
            <li><a ng-class="{true:'active'}[curLang=='Italiano']" ng-click="changeLanguage('it','Italiano'    )"> Italiano        </a></li>
            <li><a ng-class="{true:'active'}[curLang=='日本語']"
                   ng-click="changeLanguage('ja','日本語'       )"> 日本語           </a></li>
            <li><a ng-class="{true:'active'}[curLang=='한국어']"
                   ng-click="changeLanguage('ko','한국어'       )"> 한국어            </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Nederlands']" ng-click="changeLanguage('nl','Nederlands'  )"> Nederlands      </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Norsk Bokmål']" ng-click="changeLanguage('no','Norsk Bokmål')"> Norsk Bokmål    </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Polski']"
                   ng-click="changeLanguage('pl','Polski'      )"> Polski          </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Português']" ng-click="changeLanguage('pt','Português'   )"> Português       </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Русский']" ng-click="changeLanguage('ru','Русский'     )"> Русский         </a></li>
              <!--<li><a ng-class="{true:'active'}[curLang=='Slovenčina']"   ng-click="changeLanguage('sk','Slovenčina'  )"> Slovenčina      </a></li>-->
              <!--<li><a ng-class="{true:'active'}[curLang=='Slovenščina']"  ng-click="changeLanguage('sl','Slovenščina' )"> Slovenščina     </a></li>-->
              <!--<li><a ng-class="{true:'active'}[curLang=='Svenska']"      ng-click="changeLanguage('sv','Svenska'     )"> Svenska         </a></li>-->
            <li><a ng-class="{true:'active'}[curLang=='Türkçe']"
                   ng-click="changeLanguage('tr','Türkçe'      )"> Türkçe          </a></li>
            <li><a ng-class="{true:'active'}[curLang=='Tiếng Việt']" ng-click="changeLanguage('vi','Tiếng Việt'  )"> Tiếng Việt      </a></li>
            <li><a ng-class="{true:'active'}[curLang=='简体中文']"
                   ng-click="changeLanguage('zhcn','简体中文'   )"> 简体中文         </a></li>
            <li><a ng-class="{true:'active'}[curLang=='繁體中文']"
                   ng-click="changeLanguage('zhtw','繁體中文'   )"> 繁體中文         </a></li>
            <li role="separator" class="divider"></li>
            <li><a data-toggle="modal" data-target="#disclaimerModal" translate="FOOTER_4"> Disclaimer </a></li>
          </ul>
        </span>

                <span class="dropdown dropdown-gas" ng-cloak>
          <a tabindex="0" aria-haspopup="true" aria-label="adjust gas price" class="dropdown-toggle  btn btn-white"
             ng-click="dropdownGasPrice = !dropdownGasPrice">
            <span translate="OFFLINE_Step2_Label_3">Gas Price</span>: {{gas.value}} Gwei
            <i class="caret"></i>
          </a>
          <ul class="dropdown-menu" ng-show="dropdownGasPrice">
            <div class="header--gas">
              <span translate="OFFLINE_Step2_Label_3">Gas Price</span>: <input type="number" ng-model="gas.value"
                                                                               value="{{gas.value}}" min="{{gas.min}}"
                                                                               max="{{gas.max}}" step="{{gas.step}}"
                                                                               ng-change="gasChanged()"
                                                                               ng-blur="validateGasPrice()"
            /> Gwei
              <p class="small col-xs-4 text-left"><{{recommendedGas.low}}</p>
              <p class="small col-xs-4 text-center">{{recommendedGas.low}} - {{recommendedGas.high}}</p>
              <p class="small col-xs-4 text-right">>{{recommendedGas.high}}</p>
              <p class="small col-xs-4 text-left">Not So Fast</p>
              <p class="small col-xs-4 text-center">Fast</p>
              <p class="small col-xs-4 text-right">Fast AF</p>
              <p class="small" style="white-space:normal;font-weight:300;margin: 2rem 0 0;"
                 translate="GAS_PRICE_Desc"></p>
              <a class="small" translate="x_ReadMore"
                 href="https://support.ethereumcommonwealth.io/gas/what-is-gas-ethereum.html" target="_blank"
                 rel="noopener"></a>
            </div>
          </ul>


        </span>

                <div ng-switch="walletService.wallet.type === 'web3' || walletService.wallet.hwType === 'web3'">
                    <div ng-switch-when="true" class="dropdown dropdown-node">
                        <a tabindex="0" aria-haspopup="true"
                           class="dropdown-toggle btn btn-white"
                        >
                            <span translate="Network"></span>
                            {{walletService.wallet.network}}
                        </a>
                    </div>

                    <div ng-switch-default
                         class="dropdown dropdown-node"
                    >
                        <a tabindex="0"
                           aria-haspopup="true"
                           aria-label="change node. current node {{curNode.name}} node by {{curNode.service}}"
                           class="dropdown-toggle  btn btn-white"
                           ng-click="globalService.dropdownNode = !globalService.dropdownNode"
                        >
                            Network: {{curNode.name}}
                            <small>({{curNode.service}})</small>
                            <i class="caret"></i>
                        </a>

                        <network-selector></network-selector>
                    </div>
                </div>
                <!-- Note: The separator colors you see on the frontend are in styles/etherwallet-custom.less. If you add / change a node, you have to adjust these. Ping j-chimienti if you're not a CSS wizard -->


            </div>
        </section>
    </section>

    <nav role="navigation" aria-label="main navigation" class="container nav-container overflowing">
        <a aria-hidden="true" ng-show="showLeftArrow" class="nav-arrow-left" ng-click="scrollLeft(100);"
           ng-mouseover="scrollHoverIn(true,2);" ng-mouseleave="scrollHoverOut()">&#171;</a>
        <div class="nav-scroll">
            <ul class="nav-inner">


                @@if (site === 'cew' ) {
                <li ng-repeat="tab in tabNames track by $index" class="nav-item {{tab.name}}"
                    ng-class="{active: $index==gService.currentTab}" ng-show="tab.mew" ng-click="tabClick($index)"><a
                    tabindex="0" aria-label="nav item: {{tab.name | translate}}" translate="{{tab.name}}"></a></li>
                }
                @@if (site === 'cx' ) {
                <li ng-repeat="tab in tabNames track by $index" class="nav-item {{tab.name}}"
                    ng-class="{active: $index==gService.currentTab}" ng-show="tab.cx" ng-click="tabClick($index)"><a
                    tabindex="0" aria-label="nav item: {{tab.name | translate}}" translate="{{tab.name}}"></a></li>
                }
                <li class="nav-item help"><a href="https://support.ethereumcommonwealth.io" target="_blank"
                                             rel="noopener">Help</a></li>
            </ul>
        </div>
        <a aria-hidden="true" ng-show="showRightArrow" class="nav-arrow-right" ng-click="scrollRight(100);"
           ng-mouseover="scrollHoverIn(false,2);" ng-mouseleave="scrollHoverOut()">&#187;</a>
    </nav>



</header>
