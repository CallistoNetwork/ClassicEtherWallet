<div
    ng-if="globalService.currentTab === globalService.tabs.networkInfo.id">

    <h1>{{ajaxReq.type}} Network Info</h1>

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
        </div>
    </div>
</div>
