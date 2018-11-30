<article class="row text-center" ng-show="objENS.status==ensModes.owned ">

  <br /><br />

  <h4>It appears this name has already been finalized.</h4>
  <h1><strong>{{objENS.name}}{{objENS.tld}}</strong> is owned by the highest bidder.</h1>

  @@if (site === 'cew' ) { @@include( './ens-resolve-information.tpl', { "site": "cew" } ) }
  @@if (site === 'cx'  ) { @@include( './ens-resolve-information.tpl', { "site": "cx"  } ) }

</article>


