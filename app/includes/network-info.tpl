<div
    ng-if="globalService.currentTab === globalService.tabs.networkInfo.id"
>
    <h1>
        <span><coin-icon icon="{{ajaxReq.icon}}"></coin-icon></span>
        <span translate="NAV_Network_Info">Network Info</span>
    </h1>

    <div ng-switch="ajaxReq.type">
        <div ng-switch-when="CLO">
            <main class="tab-pane">
                <article>
                    <h1 class="text-center" translate="OC_OfficialityChecker">Callisto Officiality
                        Checker</h1>
                    <p class="text-center" translate="OC_Label_1">Allows you to check whether a certain media resource
                        is
                        considered "official" at Callisto or not.</p>

                    <section>
                        <div class="block">
                            <form officiality-checker name="officialityChecker" novalidate>
                            </form>
                        </div>
                    </section>
                </article>
            </main>
        </div>
    </div>
</div>
