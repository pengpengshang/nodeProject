$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "loginIndex.html";
            });
            return;
        }
        SEARCH_NEW.loadDefaultData();
    });
});
var SEARCH_NEW;
(function (SEARCH_NEW) {
    var search_history = document.getElementById("search_history");
    var search_hot = document.getElementById("search_hot");
    var searchlist = document.getElementById("searchlist");
    var searchitem = searchlist.firstElementChild;
    var searchitems = [];
    function loadDefaultData() {
        initData();
        loadSearchHistory();
        loadHotTopGame();
    }
    SEARCH_NEW.loadDefaultData = loadDefaultData;
    function loadSearchHistory() {
        $(search_history).empty();
        var histories = utils.removeRepeat(utils.getStorage("searchHistory", "localStorage"));
        if (histories.length == 0) {
            $("#clearHistory").hide();
        }
        else {
            $("#clearHistory").show();
        }
        if (histories != null) {
            for (var i = 0; i < histories.length; i++) {
                var searchItem = document.createElement("li");
                searchItem.className = "search_li";
                searchItem.textContent = histories[i];
                searchItem.onclick = function () {
                    startSearch(this.textContent);
                };
                search_history.appendChild(searchItem);
            }
        }
    }
    SEARCH_NEW.loadSearchHistory = loadSearchHistory;
    function loadHotTopGame() {
        $(search_hot).empty();
        var para = new GAMECENTER.HOTTOPGAMEINFOREQ();
        GAMECENTER.getHotTopGame(para, function (resp) {
            var dat = resp.data;
            if (dat.hottopgamelist != null) {
                for (var i = 0; i < dat.hottopgamelist.length; i++) {
                    var searchItem = document.createElement("li");
                    searchItem.className = "search_li";
                    searchItem.textContent = dat.hottopgamelist[i].name;
                    searchItem.onclick = function () {
                        startSearch(this.textContent);
                    };
                    search_hot.appendChild(searchItem);
                }
            }
        });
    }
    SEARCH_NEW.loadHotTopGame = loadHotTopGame;
    function initData() {
        searchitem.style.display = "none";
        for (var i = 0; i < searchitems.length; i++) {
            searchlist.removeChild(searchitems[i]);
        }
        searchitems.splice(0);
        $("#search_input").bind("keydown", function (e) {
            var gamename = $("#search_input").val();
            if (e.keyCode == 13) {
                startSearch(gamename);
            }
        });
        $("#search").bind("click", function () {
            var gamename = $("#search_input").val();
            startSearch(gamename);
        });
        $("#close").bind("click", function () {
            hideSearch();
        });
        $("#searchBtn").bind("click", function () {
            showSearch();
        });
        $("#clearHistory").bind("click", function () {
            utils.removeStorag("searchHistory", "localStorage");
            $("#search_history").empty();
            $(this).hide();
        });
    }
    SEARCH_NEW.initData = initData;
    function startSearch(gamename) {
        if (!gamename) {
            utils.dialogBox("请输入需要查询的内容", function () {
                $("#search_input").focus();
            });
            return;
        }
        var searchHistory = utils.getStorage("searchHistory", "localStorage");
        var searchList = [];
        if (searchHistory != null) {
            searchList = searchHistory;
        }
        searchList.push(gamename);
        utils.setStorage("searchHistory", searchList, "localStorage");
        loadSearchHistory();
        GAMECENTER.gsusergeth5applistbyname(gamename, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < searchitems.length; i++) {
                searchlist.removeChild(searchitems[i]);
            }
            searchitems.splice(0);
            var h5infoAddImage = resp.data;
            if (h5infoAddImage.length == 0) {
                utils.dialogBox("查无数据！！！", function () {
                    $("#search_input").val(null).focus();
                });
                return;
            }
            else {
                hideSearch();
                var today = new Date();
                for (var i = 0; i < h5infoAddImage.length; i++) {
                    var tjImage = document.createElement("i"); //推荐图标生成
                    var giftImage = document.createElement("i"); //礼包图标生成
                    var newImage = document.createElement("img"); //新游tag
                    tjImage.textContent = "推荐";
                    giftImage.textContent = "礼包";
                    tjImage.setAttribute("class", "tagtj");
                    giftImage.setAttribute("class", "taggb");
                    newImage.setAttribute("src", "../style/img/index/gameTag.png");
                    newImage.setAttribute("class", "gameTag");
                    var appinfo = h5infoAddImage[i];
                    var items = searchitem.cloneNode(true);
                    items.id = "giftlistitem" + i;
                    $(items).find("#name").text(appinfo.name);
                    $(items).find("#detail").text(appinfo.detail).attr("title", appinfo.detail);
                    $(items).find("#gamepeople").text(appinfo.playcount);
                    var gameDate = new Date(appinfo.createtime);
                    if ((today.getFullYear() == gameDate.getFullYear()) && (today.getMonth() <= gameDate.getMonth() + 2)) {
                        $(items).find("#hg_img").append(newImage);
                    }
                    if (appinfo.isrec == 1) {
                        $(items).find("#gameName").append(tjImage);
                    }
                    if (appinfo.hasgift == 1) {
                        $(items).find("#gameName").append(giftImage);
                    }
                    (function fun(data) {
                        $(items).find("#btn").click(function (ev) {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            window.location.href = "../../gamepage.html#" + data.id;
                        });
                        $(items).find("#gameheadshot").attr("src", appinfo.ico + "?" + Math.random()).attr("title", appinfo.name).click(function (ev) {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                                if (utils.isMobileBrowser()) {
                                    window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                }
                                else {
                                    window.location.href = "../../gamepage.html#" + data.id;
                                }
                            }
                            else {
                                if (utils.isMobileBrowser()) {
                                    window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                    setTimeout(function () { window.parent.location.reload(); }, 500);
                                }
                                else {
                                    window.parent.location.href = "../../gamepage.html#" + data.id;
                                    setTimeout(function () { window.parent.location.reload(); }, 500);
                                }
                            }
                        });
                        GAMECENTER.getGameAllGift({ loginid: GAMECENTER.userinfo.sdkloginid, gname: data.name, itemid: items.id }, function (resp) {
                            if (resp.errno != 0) {
                                utils.dialogBox(resp.message);
                                return;
                            }
                            var itemId = document.getElementById(resp.data.itemid);
                            var dat = resp.data.datalist.datalist;
                            var giftlist = itemId.querySelector("#giftlist");
                            var giftitem = giftlist.firstElementChild;
                            var giftitems = [];
                            giftitem.style.display = "none";
                            for (var i = 0; i < giftitems.length; i++) {
                                giftlist.removeChild(giftitems[i]);
                            }
                            giftitems.splice(0);
                            for (var j = 0; dat != null && j < dat.length; j++) {
                                var gift = dat[j];
                                var item = giftitem.cloneNode(true);
                                if (gift.loginid != null) {
                                    $(item).find("#SR_gb_btn").css("background", "#E55659").text("已领取");
                                }
                                $(item).find("#giftname").text(gift.giftname);
                                $(item).find("#giftdetail").text(gift.instruction);
                                $(item).find("#searchgameshot").attr("src", gift.ico + "?" + Math.random());
                                (function fun(data) {
                                    $(item).find("#SR_gb_btn").on("click", function () {
                                        var loginid = GAMECENTER.userinfo.sdkloginid;
                                        var getFlag = $(this).text();
                                        if ("已领取" == getFlag) {
                                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                                        }
                                        else {
                                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                                        }
                                    });
                                })(gift);
                                item.style.display = "";
                                giftlist.appendChild(item);
                                giftitems.push(item);
                            }
                        });
                    })(appinfo);
                    items.style.display = "";
                    searchlist.appendChild(items);
                    searchitems.push(items);
                }
            }
        });
    }
    function getGiftCode(typeid, loginid, gameid, flags, doc) {
        var para = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getCodeInfo(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                ;
                return;
            }
            SEARCH_NEW.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            }
            else {
                $("#copyCode").text("来晚了,请等待下次发放");
                $("#copyto").css("display", "none");
            }
            $("#close").click(function () {
                SEARCH_NEW.hideMask();
                if ($("#copyCode").text() != "来晚了,请等待下次发放") {
                    doc.css("background", "#E55659").text("已领取");
                }
            });
            $("#start").click(function () {
                SEARCH_NEW.hideMask();
                if (GAMECENTER.userinfo) {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                }
                if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                    if (utils.isMobileBrowser()) {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid;
                    }
                }
                else {
                    if (utils.isMobileBrowser()) {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        setTimeout(function () { window.parent.location.reload(); }, 500);
                    }
                    else {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid;
                        setTimeout(function () { window.parent.location.reload(); }, 500);
                    }
                }
            });
        });
    }
    SEARCH_NEW.getGiftCode = getGiftCode;
    function showMask() {
        $(".mask").css("display", "block");
    }
    SEARCH_NEW.showMask = showMask;
    function hideMask() {
        $(".mask").css("display", "none");
    }
    SEARCH_NEW.hideMask = hideMask;
    function hideSearch() {
        $(".search_result").show();
        $('#search_title').hide();
    }
    function showSearch() {
        SEARCH_NEW.loadSearchHistory();
        $("#search_input").val(null);
        $(".search_result").hide();
        $('#search_title').fadeIn(500, function () {
            $(this).show();
        });
    }
})(SEARCH_NEW || (SEARCH_NEW = {}));
//# sourceMappingURL=search.js.map