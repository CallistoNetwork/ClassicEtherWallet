<section class="pre-footer">
  <div class="container">
    <p>ClassicEtherWallet.com does not hold your keys for you. We cannot access accounts, recover keys, reset passwords, nor reverse transactions. Protect your keys &amp; always check that you are on correct URL. <a role="link" tabindex="0" data-toggle="modal" data-target="#disclaimerModal"> You are responsible for your security.</a>
    </p>
  </div>
</section>
<footer class="footer" role="content" aria-label="footer" ng-controller='footerCtrl' >
  <article class="block__wrap" style="max-width: 1780px; margin: auto;">
    <section class="footer--left">
      <a href="/"><img src="images/logo-myetherwallet.png" height="45px" width="auto" alt="Ether Wallet" class="footer--logo"/></a>
      <p><span translate="FOOTER_1">Free, open-source, client-side interface for generating Ethereum Classic wallets &amp; more. Interact with the Ethereum-compatible blockchains such are ETH, ETC, UBQ and EXP easily &amp; securely. Double-check the URL ( https://ethereumproject.github.io/etherwallet/ ) before unlocking your wallet.</span></p>
      <p><a aria-label="knowledge base" href="https://myetherwallet.groovehq.com/help_center" target="_blank" rel="noopener" role="link" tabindex="0">
        Knowledge Base
      </a></p>
      <p><a href="https://ethereumproject.github.io/etherwallet/helpers.html" target="_blank" rel="noopener" role="link" tabindex="0">
        Helpers &amp; ENS Debugging
      </a></p>
      <p><a href="https://ethereumproject.github.io/etherwallet/signmsg.html" target="_blank" rel="noopener" role="link" tabindex="0">
        Sign Message
      </a></p>
      <p><a data-target="#disclaimerModal" data-toggle="modal" target="_blank" rel="noopener" role="link" tabindex="0"  translate="FOOTER_4"> Disclaimer </a></p>
      <p> &copy; 2017 ClassicEtherWallet, LLC </p>
    </section>
    <section class="footer--cent">
        <h5> <i aria-hidden="true">👫</i> You can support us by supporting our blockchain-family.</h5>
        <p>Consider using our affiliate links to...</p>
        <p><a aria-label="Swap Ether or Bitcoin via Bity.com" href="https://bity.com/af/jshkb37v" target="_blank" rel="noopener">Swap ETH/BTC/EUR/CHF via Bity.com</a></p>
        <p><a href="https://www.ledgerwallet.com/r/fa4b?path=/products/" target="_blank" rel="noopener">Buy a Ledger Wallet</a></p>
        <p><a href="https://trezor.io/?a=myetherwallet.com" target="_blank" rel="noopener">Buy a TREZOR</a></p>
        <p><a href="https://digitalbitbox.com/?ref=mew" target="_blank" rel="noopener">Buy a Digital Bitbox</a></p>
        <h5><i aria-hidden="true">💝</i> Donations are always appreciated!</h5>
        <p>ETH, ETC, UBQ and EXP donation address: <span class="mono wrap">0x52823e725a34d42e14a1b66fb67299c30c4d8edf</small></span></p>
        <!--
        <p>MYD: <span class="mono wrap">mewsupport.eth <small>0xf7e983781609012307f2514f63D526D83D24F466</small></span></p>
        -->
        <h5 ng-hide="curLang=='en'"> <i>🏅</i> <span translate="Translator_Desc"> Thank you to our translators </span></h5>
        <p ng-hide="curLang=='en'">
          <span translate="TranslatorName_1"></span>
          <span translate="TranslatorName_2"></span>
          <span translate="TranslatorName_3"></span>
          <span translate="TranslatorName_4"></span>
          <span translate="TranslatorName_5"></span>
        </p>
    </section>
    <section class="footer--righ">
      <p><a aria-label="website via my ether wallet dot com" href="https://ethereumproject.github.io/etherwallet" target="_blank" rel="noopener" role="link" tabindex="0">
       ClassicEtherWallet.com
      </a></p>
      <p><a aria-label="website via github URL" href="https://ethereumproject.github.io/etherwallet/" target="_blank" rel="noopener" role="link" tabindex="0">
        ethereumproject.github.io/etherwallet/
      </a></p>
      <p><a aria-label="my ether wallet github" href="https://github.com/EthereumCommonwealth/etherwallet" target="_blank" rel="noopener" role="link" tabindex="0">
        Github: Current ClassicEtherWallet Site &amp; CX
      </a></p>
      <p><a aria-label="our organization on github" href="https://github.com/kvhnuke/etherwallet/releases/latest" target="_blank" rel="noopener" role="link" tabindex="0">
        Github: MyEtherWallet releases
      </a></p>
      <p><a aria-label="my ether wallet chrome extension" href="https://chrome.google.com/webstore/detail/classicetherwallet-cx/opggclcfcbfbchcienjdaohghcamjfhf" target="_blank" rel="noopener" role="link" tabindex="0">
        ClassicEtherWallet CX
      </a></p>
      <p><a aria-label="Anti-Phishing chrome extension" href="https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn" target="_blank" rel="noopener" role="link" tabindex="0">
        Anti-Phishing CX
      </a></p>
      <p>
        <a aria-label="join our slack" href="http://ethereumclassic.herokuapp.com/" target="_blank" rel="noopener" role="link" tabindex="0">Slack</a>
        &middot;
        <a aria-label="reddit" href="https://www.reddit.com/r/EthereumClassic/" target="_blank" rel="noopener" role="link" tabindex="0">Reddit</a>
        &middot;
        <a aria-label="twitter" href="https://twitter.com/eth_classic" target="_blank" rel="noopener" role="link" tabindex="0">Twitter</a>
        &middot;
        <a aria-label="medium" href="https://medium.com/@dexaran820" target="_blank" rel="noopener" role="link" tabindex="0">Medium</a>
      </p>
      <p ng-show="showBlocks">Latest Block#: {{currentBlockNumber}} </p>
    </section>
  </article>
</div>
</footer>

@@if (site === 'cew' ) { @@include( './footer-disclaimer-modal.tpl',   { "site": "cew" } ) }
@@if (site === 'cx'  ) { @@include( './footer-disclaimer-modal.tpl',   { "site": "cx"  } ) }

</main>
</body>
</html>
