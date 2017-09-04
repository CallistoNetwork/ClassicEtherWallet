## https://classicetherwallet.com - Content of ClassicEtherWallet.com is served directly from github.

### ClassicEtherWallet

ClassicEtherWallet is an open source, javascript, client-side tool for generating Ether wallets. It was forked from  [kvhnuke](https://github.com/kvhnuke).

- Official link: https://classicetherwallet.com
- Served from github link: https://ethereumproject.github.io/etherwallet/

### Purpose

ClassicEtherWallet was created because many users were having immense trouble setting up the command-line ethereum client on their computers. Therefore, created this browser-based GUI wallet to...
- Import client wallet files and presale wallet files.
- Generate wallets completely client side and provide raw private keys, JSON files, and paper version of the account.
- Bulk generate wallets
- Generate & send transactions
- We hope that it'll help most of us to accomplish day to day tasks without having a fully running client.

Version 2 expands on this vision to offer:
- Generate and send offline transactions, ensuring your private keys never leave your computer.
- Include custom gas / data in the standard send transaction tab.
- Rewritten in Angular in order to make it was easier to update and maintain.
- Crowdsale / Token Sale support on a case by case basis (Digix, Slock.it, etc.)
- New encryption method. Now matches geth / Mist keystore format (v3) to make moving between MyEtherWallet and Mist *much* easier.
- QR codes on the Offline Transaction page for easier transferring between computers.
- Ability to create a custom link that will pre-fill the send transaction tab with the to address, amount, data, and gas. All the user has to do is unlock their wallet and press send.



### Developers

If you want to help contribute, here's what you need to know to get it up and running and compiling.

- Both the Chrome Extension and the MyEtherWallet.com are compiling from the same codebase. This code is found in the `app` folder. Don't touch the `dist` or `chrome-extension` folders.
- We use angular and bootstrap. We used to use jQuery and Bootstrap until it was converted in April 2016. If you wonder why some things are set up funky, that's why.
- The mercury branch is currently the active development branch. We then push the dist folder live to gh-pages, which then gets served to MyEtherWallet.com.
- We use npm / gulp for compiling. There is a lot of stuff happening in the compliation.
- Old node setups can be found in in `json_relay_node` (node.js) & `json_relay_php` (php). These are great resources for developers looking to get started and launch a public node on a $40 linode instance.

**Getting Started**

- Start by running `npm install`.
- Run `npm run dev`. Gulp will then watch & compile everything and then watch for changes to the HTML, JS, or CSS.
- For distribution, run `npm run dist`.

**Folder Structure**
- `fonts` and `images` get moved into their respective folders. This isn't watched via gulp so if you add an image or font, you need to run `gulp` again.
- `includes` are the pieces of the pages / the pages themselves. These are pretty self explanatory and where you will make most frontend changes.
- `layouts` are the pages themselves. These basically take all the pieces of the pages and compile into one massive page. The navigation is also found here...sort of.
    * `index.html` is for MyEtherWallet.com.
    * `cx-wallet.html` is the main page for the Chrome Extension.
    * `embedded.html` is for https://www.myetherwallet.com/embedded.html.

- You can control what shows up on MyEtherWallet.com vs the Chrome Extension by using: `@@if (site === 'cx' )  {  ...  }` and `@@if (site === 'mew' ) { ... }`. Check out `sendTransaction.tpl` to see it in action. The former will only compile to the Chrome Extension. The latter only to MyEtherWallet.com.
- `embedded.html` is for embedding the wallet generation into third-party sites. [Read more about it and how to listen for the address generated here.](https://www.reddit.com/r/ethereum/comments/4gn37o/embeddable_myetherwallet_super_simple_wallet/)
- The wallet decrypt directives are at `scripts/directives/walletDecryptDrtv.js`. These show up on a lot of pages.
- The navigation is in `scripts/services/globalServices.js`. Again, we control which navigation items show up in which version of the site in this single file.
- As of September 2016, almost all the copy in the .tpl files are only there as placeholders. It all gets replaced via angular-translate. If you want to change some copy you need to do so in `scripts/translations/en.js` folder. You should also make a note about what you changed and move it to the top of the file so that we can make sure it gets translated if necessary.
- `styles` is all the less. It's a couple custom folders and bootstrap. This badly needs to be redone. Ugh.




### Contact
If you can think of any other features or run into bugs, let us know. 
