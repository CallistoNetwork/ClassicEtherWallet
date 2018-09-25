"use strict";

var tabsCtrl = function(
    $http,
    $scope,
    globalService,
    walletService,
    $translate,
    $sce,
    $interval
) {
    $scope.gService = globalService;
    $scope.tabNames = $scope.gService.tabs;
    $scope.walletService = walletService;
    $scope.curLang = "English";
    $scope.customNodeModal = new Modal(
        document.getElementById("customNodeModal")
    );

    $scope.Validator = Validator;
    $scope.nodeList = nodes.nodeList;
    $scope.defaultNodeKey = globalFuncs.networks.ETC; // 'etc_ethereumcommonwealth_parity';

    const initNode = () => {
        $scope.customNode = {
            name: "",
            url: "",
            port: "",
            httpBasicAuth: null,
            eip155: ajaxReq.eip155,
            chainId: ajaxReq.chainId,
            type: ajaxReq.type
        };
    };

    $scope.customNodeCount = 0;
    $scope.nodeIsConnected = true;
    $scope.browserProtocol = window.location.protocol;
    const hval = window.location.hash;
    $scope.notifier = uiFuncs.notifier;
    $scope.notifier.sce = $sce;
    $scope.notifier.scope = $scope;
    $scope.ajaxReq = ajaxReq;
    $scope.nodeType = $scope.ajaxReq.type;
    $scope.nodeService = $scope.ajaxReq.service;

    initNode();

    $scope.setNodeMetadata = function setNodeData(nodeType) {
        const node = Object.keys(nodes.nodeList).find(
            node =>
                nodes.nodeList[node].type.toLowerCase() ===
                nodeType.toLowerCase()
        );

        const { eip155, chainId } = nodes.nodeList[node];

        Object.assign($scope.customNode, {
            eip155,
            chainId
        });
    };

    $scope.$watch("ajaxReq.type", function() {
        $scope.nodeType = $scope.ajaxReq.type;
    });
    $scope.$watch("ajaxReq.service", function() {
        $scope.nodeService = $scope.ajaxReq.service;
    });

    $scope.setArrowVisibility = function() {
        setTimeout(function() {
            if (
                document.querySelectorAll(".nav-inner")[0] &&
                document.querySelectorAll(".nav-scroll")[0]
            ) {
                $scope.showLeftArrow = false;
                $scope.showRightArrow = !(
                    document.querySelectorAll(".nav-inner")[0].clientWidth <=
                    document.querySelectorAll(".nav-scroll")[0].clientWidth
                );
                $scope.$apply();
            }
        }, 200);
    };

    const network = globalFuncs.urlGet("network", "");

    const gasPriceKey = "gasPrice";

    const defaultValue = 21;

    const gasValue =
        parseFloat(globalFuncs.localStorage.getItem(gasPriceKey)) ||
        defaultValue;

    $scope.gas = {
        defaultValue,
        curVal: gasValue,
        value: gasValue,
        max: 100,
        min: 0.1,
        step: 0.1,
        recommendedGas: {
            low: 10,
            high: 20
        }
    };

    const isValidPrice = price => 0.1 <= price && price <= 100;

    $scope.validateGasPrice = function validateGasPrice() {
        if (!isValidPrice($scope.gas.value)) {
            // $scope.notifier.danger(globalFuncs.errorMsgs[38]);
            $scope.notifier.danger(
                "Invalid gas price! Min gasPrice is 0.1 GWei. Max gasPrice is 100 GWei. GasPrice is resetted to 21GWei default value!"
            );
            $scope.gas.value = $scope.gas.defaultValue;
            globalFuncs.localStorage.setItem(
                gasPriceKey,
                $scope.gas.defaultValue
            );
        }
        // console.log($scope.gas.value, globalFuncs.localStorage.getItem(gasPriceKey), $scope.gas.curVal);
    };

    $scope.gasChanged = function() {
        const gasPrice =
            parseFloat($scope.gas.value) || $scope.gas.defaultValue;
        globalFuncs.localStorage.setItem(gasPriceKey, gasPrice);
        ethFuncs.gasAdjustment = gasPrice;
    };

    $scope.setGasPrice = function() {
        $scope.keyNode = globalFuncs.localStorage.getItem("curNode", null);
        if ($scope.keyNode == null) {
            return;
        }

        $scope.gasChanged();
    };

    $scope.$watch("keyNode", function() {
        $scope.setGasPrice();
    });

    $scope.setGasPrice();

    /*

        determines whether to apply grey border to bottom of list

        @param _node nodes.nodeList[key]
        @param index number index of the node in nodeList
        @returns 'grey-bottom-border' if n + 1 node type differs than current node else null

     */
    $scope.getBottomBorder = function(_node, index) {
        const _nodeList = Object.values(nodes.nodeList);
        if (_nodeList.length <= index + 1) {
            return null;
        } else if (_nodeList[index + 1].type !== _node.type) {
            return "grey-bottom-border";
        } else {
            return null;
        }
    };

    $scope.changeNode = function(key) {
        if ($scope.nodeList[key]) {
            $scope.curNode = $scope.nodeList[key];
        } else {
            $scope.curNode = $scope.nodeList[$scope.defaultNodeKey];
        }

        Token.popTokens = $scope.curNode.tokenList.map(token =>
            Object.assign(token, {
                node: key,
                network: $scope.curNode.type
            })
        );

        ajaxReq["key"] = key;
        for (var attrname in $scope.curNode.lib)
            ajaxReq[attrname] = $scope.curNode.lib[attrname];
        for (var attrname in $scope.curNode)
            if (
                attrname !== "name" &&
                attrname !== "tokenList" &&
                attrname !== "lib"
            )
                ajaxReq[attrname] = $scope.curNode[attrname];
        globalFuncs.localStorage.setItem(
            "curNode",
            JSON.stringify({
                key: key
            })
        );
        $scope.keyNode = globalFuncs.localStorage.getItem("curNode", null);

        $scope.curNode.lib
            .healthCheck()
            .then(result => {
                $scope.nodeIsConnected = true;
                $scope.notifier.info(
                    `${
                        globalFuncs.successMsgs[5]
                    } — Now, check the URL: <strong> ${
                        window.location.href
                    }.</strong> <br /> 
Network: <strong>${$scope.nodeType}</strong> provided by <strong>${
                        $scope.nodeService
                    }.</strong>`,
                    5000
                );
            })
            .catch(_handleErr);

        function _handleErr(err) {
            $scope.nodeIsConnected = false;

            $scope.notifier.danger(globalFuncs.errorMsgs[32]);
        }
    };
    $scope.checkNodeUrl = function(nodeUrl) {
        return $scope.Validator.isValidURL(nodeUrl);
    };
    $scope.setCurNodeFromStorage = function() {
        var node = globalFuncs.localStorage.getItem("curNode", null);
        if (node === JSON.stringify({ key: "eth_metamask" })) {
            node = JSON.stringify({ key: "eth_infura" });
        }
        if (node == null) {
            $scope.changeNode($scope.defaultNodeKey);
        } else {
            node = JSON.parse(node);
            var key = globalFuncs.stripTags(node.key);
            $scope.changeNode(key);
        }
    };
    $scope.addCustomNodeToList = function(nodeInfo) {
        let tempObj = null;

        let { type } = nodeInfo;
        type = type.toLowerCase();

        if (type === "etc")
            tempObj = JSON.parse(
                JSON.stringify(nodes.nodeList.etc_ethereumcommonwealth_parity)
            );
        else if (type === "eth")
            tempObj = JSON.parse(JSON.stringify(nodes.nodeList.eth_ethscan));
        else if (type === "rop")
            tempObj = JSON.parse(JSON.stringify(nodes.nodeList.rop_mew));
        else if (type === "kov")
            tempObj = JSON.parse(JSON.stringify(nodes.nodeList.kov_ethscan));
        else if (type === "rin")
            tempObj = JSON.parse(JSON.stringify(nodes.nodeList.rin_ethscan));
        else if (type === "cus") {
            tempObj = JSON.parse(JSON.stringify(nodes.customNodeObj));
            tempObj.eip155 = Boolean(nodeInfo.eip155);
            tempObj.chainId = parseInt(nodeInfo.chainId);
        }
        if (tempObj) {
            tempObj.name = nodeInfo.name + ":" + type;
            tempObj.service = "Custom";
            tempObj.lib = new nodes.customNode(
                nodeInfo.url,
                nodeInfo.port,
                nodeInfo.httpBasicAuth
            );
            $scope.nodeList[
                "cus_" + type + "_" + $scope.customNodeCount
            ] = tempObj;
            $scope.customNodeCount++;
        }
    };
    $scope.getCustomNodesFromStorage = function() {
        for (var key in $scope.nodeList) {
            if (key.indexOf("cus_") !== -1) delete $scope.nodeList[key];
        }
        var localNodes = globalFuncs.localStorage.getItem("localNodes", null);
        if (localNodes) {
            localNodes = JSON.parse(localNodes);
            for (var i = 0; i < localNodes.length; i++)
                $scope.addCustomNodeToList(localNodes[i]);
        }
    };

    $scope.saveCustomNode = function() {
        const { customNode } = $scope;
        let localNodes = globalFuncs.localStorage.getItem("localNodes", null);
        try {
            localNodes = !localNodes ? [] : JSON.parse(localNodes);
        } catch (e) {
            uiFuncs.notifier.danger(e);
        }
        localNodes.push(customNode);
        $scope.addCustomNodeToList(customNode);
        $scope.changeNode(
            "cus_" + customNode.options + "_" + ($scope.customNodeCount - 1)
        );
        globalFuncs.localStorage.setItem(
            "localNodes",
            JSON.stringify(localNodes)
        );
        $scope.customNodeModal.close();
        initNode();
    };

    $scope.removeNodeFromLocal = function(localNodeName) {
        let localNodes = globalFuncs.localStorage.getItem("localNodes", null);
        localNodes = !localNodes ? [] : JSON.parse(localNodes);
        for (let i = 0; i < localNodes.length; i++) {
            if (
                `${localNodes[i].name}:${localNodes[i].type}`.toLowerCase() ===
                localNodeName.toLowerCase()
            ) {
                localNodes.splice(i, 1);
            }
        }
        globalFuncs.localStorage.setItem(
            "localNodes",
            JSON.stringify(localNodes)
        );
        $scope.getCustomNodesFromStorage();
        $scope.setCurNodeFromStorage();
    };

    $scope.setTab = function(hval) {
        if (hval != "") {
            hval = hval.replace("#", "");
            //          //Check if URL contains Parameters
            //          if(hval.indexOf('=') != -1) {
            //              //Remove URL parameter from hval
            //              hval = hval.substring(0,hval.indexOf('='));
            //          }
            for (var key in $scope.tabNames) {
                if ($scope.tabNames[key].url == hval) {
                    $scope.activeTab = globalService.currentTab =
                        $scope.tabNames[key].id;
                    break;
                }
                $scope.activeTab = globalService.currentTab;
            }
        } else {
            $scope.activeTab = globalService.currentTab;
        }
    };

    $scope.tabClick = function(id) {
        $scope.activeTab = globalService.currentTab = id;
        for (var key in $scope.tabNames) {
            if ($scope.tabNames[key].id == id)
                location.hash = $scope.tabNames[key].url;
        }
    };

    $scope.setLanguageVal = function(id, varName, pos) {
        $translate(id).then(
            function(paragraph) {
                globalFuncs[varName][pos] = paragraph;
            },
            function(translationId) {
                globalFuncs[varName][pos] = translationId;
            }
        );
    };

    $scope.setErrorMsgLanguage = function() {
        for (var i = 0; i < globalFuncs.errorMsgs.length; i++)
            $scope.setLanguageVal("ERROR_" + i, "errorMsgs", i);
        for (var i = 0; i < globalFuncs.successMsgs.length; i++)
            $scope.setLanguageVal("SUCCESS_" + (i + 1), "successMsgs", i);
    };

    $scope.setGethErrMsgLanguage = function() {
        globalFuncs.gethErrorMsgs = {};
        for (var s in globalFuncs.gethErrors) {
            var key = globalFuncs.gethErrors[s];
            if (key.indexOf("GETH_") === 0) {
                $scope.setLanguageVal(key, "gethErrorMsgs", key);
            }
        }
    };

    $scope.setParityErrMsgLanguage = function() {
        globalFuncs.parityErrorMsgs = {};
        for (var s in globalFuncs.parityErrors) {
            var key = globalFuncs.parityErrors[s];
            if (key.indexOf("PARITY_") === 0 || key.indexOf("ERROR_17") === 0) {
                $scope.setLanguageVal(key, "parityErrorMsgs", key);
            }
        }
    };

    $scope.changeLanguage = function(key, value) {
        $translate.use(key);
        $scope.setErrorMsgLanguage();
        if (globalFuncs.getEthNodeName() == "geth")
            $scope.setGethErrMsgLanguage();
        else $scope.setParityErrMsgLanguage();
        $scope.curLang = value;
        $scope.setArrowVisibility();
        $scope.dropdown = false;
        globalFuncs.localStorage.setItem(
            "language",
            JSON.stringify({
                key: key,
                value: value
            })
        );
        globalFuncs.curLang = key;
    };
    $scope.setLanguageFromStorage = function() {
        var lang = globalFuncs.localStorage.getItem("language", null);
        if (lang == null) lang = '{"key":"en","value":"English"}';
        lang = JSON.parse(lang);
        var key = globalFuncs.stripTags(lang.key);
        var value = globalFuncs.stripTags(lang.value);
        $scope.changeLanguage(key, value);
    };
    $scope.setLanguageFromStorage();

    $scope.setHash = function(hash) {
        location.hash = hash;
        $scope.setTab(hash);
        $scope.$apply();
    };

    $scope.scrollHoverIn = function(isLeft, val) {
        clearInterval($scope.sHoverTimer);
        $scope.sHoverTimer = setInterval(function() {
            if (isLeft) $scope.scrollLeft(val);
            else $scope.scrollRight(val);
        }, 20);
    };

    $scope.scrollHoverOut = function() {
        clearInterval($scope.sHoverTimer);
    };

    $scope.setOnScrollArrows = function() {
        var ele = document.querySelectorAll(".nav-scroll")[0];
        $scope.showLeftArrow = ele.scrollLeft > 0;
        $scope.showRightArrow =
            document.querySelectorAll(".nav-inner")[0].clientWidth >
            ele.clientWidth + ele.scrollLeft;
        $scope.$apply();
    };

    $scope.scrollLeft = function(val) {
        var ele = document.querySelectorAll(".nav-scroll")[0];
        ele.scrollLeft -= val;
    };

    $scope.scrollRight = function(val) {
        var ele = document.querySelectorAll(".nav-scroll")[0];
        ele.scrollLeft += val;
    };

    $scope.$on("ChangeNode", function(event, nodeId) {
        $scope.changeNode(nodeId);
    });

    $scope.$on("ChangeGas", function($event, gasPrice) {
        $scope.gas.value = gasPrice;
        $scope.validateGasPrice();
    });

    $scope.setArrowVisibility();

    if (!network) {
        $scope.getCustomNodesFromStorage();
        $scope.setCurNodeFromStorage();
    } else {
        $scope.changeNode(globalFuncs.networks[network.toUpperCase()] || 0);
    }

    $scope.setTab(hval);
    angular
        .element(document.querySelectorAll(".nav-scroll")[0])
        .bind("scroll", $scope.setOnScrollArrows);
    globalFuncs.changeHash = $scope.setHash;

    const LOADING = "loading";
    const ERROR = "error";

    $scope.currentBlockNumber = LOADING;

    $scope.setBlockNumbers = function() {
        ajaxReq.getCurrentBlock(function(data) {
            if (data.error || !data.data) {
                $scope.currentBlockNumber = ERROR;
            } else {
                $scope.currentBlockNumber = parseInt(data.data);
            }
        });
    };

    $scope.$watch(
        function() {
            return globalFuncs.getCurNode();
        },
        function(newNode, oldNode) {
            if (!angular.equals(newNode, oldNode)) {
                $scope.currentBlockNumber = LOADING;
                $scope.setBlockNumbers();
            }
        }
    );

    $scope.setBlockNumbers();
    $interval($scope.setBlockNumbers, 1000 * 30);
    window.coinPriceService.initPrices();
};
module.exports = tabsCtrl;
