<section class="pre-footer">
    <div class="container">
        <p>ClassicEtherWallet.com does not hold your keys for you. We cannot access accounts, recover keys, reset
            passwords, nor reverse transactions. Protect your keys &amp; always check that you are on correct URL. <a
                role="link" tabindex="0" data-toggle="modal" data-target="#disclaimerModal"> You are responsible for
                your security.</a>
        </p>
    </div>
</section>
<footer class="footer {{curNode.type}}" role="content" aria-label="footer">
    <article class="block__wrap" style="max-width: 1780px; margin: auto;">
        <section class="footer--left">
            <span>Version: 3.12.2</span>
            <p><span translate="FOOTER_1">Free, open-source, client-side interface for generating Ethereum Classic wallets &amp; more. Interact with the Ethereum-compatible blockchains such are ETH, ETC, UBQ and EXP easily &amp; securely. Double-check the URL ( https://ethereumproject.github.io/etherwallet/ ) before unlocking your wallet.</span>
            </p>
            <p><a href="https://ethereumproject.github.io/etherwallet/helpers.html" target="_blank" rel="noopener"
                  role="link" tabindex="0">
                Helpers &amp; ENS Debugging
            </a></p>
            <p><a data-target="#disclaimerModal" data-toggle="modal" target="_blank" rel="noopener" role="link"
                  tabindex="0" translate="FOOTER_4"> Disclaimer </a></p>
            <p> &copy; 2018 ClassicEtherWallet, LLC </p>
        </section>
        <section class="footer--cent">
            <h5><i aria-hidden="true">💝</i> Donations are always appreciated!</h5>
            <p>ETH or ETC donation address: <span class="mono wrap"><big><a
                href="https://gastracker.io/addr/0x2ca1377dfa03577ce5bbb815c98eda1ac7632e7d">0x2ca1377dfa03577ce5bbb815c98eda1ac7632e7d</a></big></span>
            </p>

            <h5><i aria-hidden="true">👫</i> You can support us by supporting our blockchain-family.</h5>
            <p><a
                aria-label="Swap Ether or Bitcoin via Change Now.com"
                href="{{changeNow.affiliateLink}}" target="_blank"
                rel="noopener">Swap via Change Now.com</a>
            </p>
            <p><a href="https://www.ledgerwallet.com/r/fa4b?path=/products/" target="_blank" rel="noopener">Buy a Ledger
                Wallet</a></p>
            <p><a href="https://trezor.io/?a=myetherwallet.com" target="_blank" rel="noopener">Buy a TREZOR</a></p>
            <p><a href="https://digitalbitbox.com/?ref=mew" target="_blank" rel="noopener">Buy a Digital Bitbox</a></p>
            <h5 ng-hide="curLang=='en'"><i>🏅</i> <span
                translate="Translator_Desc"> Thank you to our translators </span></h5>
            <p ng-hide="curLang=='en'">
                <span translate="TranslatorName_1"></span>
                <span translate="TranslatorName_2"></span>
                <span translate="TranslatorName_3"></span>
                <span translate="TranslatorName_4"></span>
                <span translate="TranslatorName_5"></span>
            </p>
        </section>
        <section class="footer--righ brand-primary">

            <div class="footer-branding">

            </div>
            <p><a aria-label="our organization on github"
                  href="https://github.com/EthereumCommonwealth/etherwallet/releases/latest" target="_blank"
                  rel="noopener" role="link" tabindex="0">
                Github: Ether wallet releases (downloadable version)
            </a></p>
            <p><a aria-label="Anti-Phishing chrome extension"
                  href="https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn"
                  target="_blank" rel="noopener" role="link" tabindex="0">
                Anti-Phishing CX
            </a></p>
            <p>
                <a aria-label="join our discord live chat" href="https://discordapp.com/invite/HgBa9b4" target="_blank"
                   rel="noopener" role="link" tabindex="0">Discord live chat</a>
                &middot;
                <a aria-label="reddit" href="https://www.reddit.com/r/EthereumClassic/" target="_blank" rel="noopener"
                   role="link" tabindex="0">Reddit</a>
                &middot;
                <a aria-label="twitter" href="https://twitter.com/eth_classic" target="_blank" rel="noopener"
                   role="link" tabindex="0">Twitter</a>
                &middot;
                <a aria-label="medium" href="https://medium.com/@dexaran820" target="_blank" rel="noopener" role="link"
                   tabindex="0">Medium</a>
            </p>
            <p><b>Latest Block #:</b> {{currentBlockNumber | number}} </p>
        </section>
    </article>
</footer>

@@if (site === 'cew' ) { @@include( './footer-disclaimer-modal.tpl',   { "site": "cew" } ) }
@@if (site === 'cx'  ) { @@include( './footer-disclaimer-modal.tpl',   { "site": "cx"  } ) }
