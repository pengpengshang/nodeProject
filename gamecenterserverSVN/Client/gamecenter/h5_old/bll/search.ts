$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "loginIndex.html";
            });
            return;
        }
        SEARCH_NEW.loadDefaultData();
    });
});
module SEARCH_NEW {
    var search_history: HTMLUListElement = <any>document.getElementById("search_history");
    var search_hot: HTMLUListElement = <any>document.getElementById("search_hot");
    var searchlist: HTMLUListElement = <any>document.getElementById("searchlist");
    var searchitem: HTMLLIElement = <any>searchlist.firstElementChild;
    var searchitems: HTMLLIElement[] = [];
    export function loadDefaultData() {
        initData();
        loadSearchHistory();
        loadHotTopGame();
    }
    export function loadSearchHistory() {//加载搜索历史
        $(search_history).empty();
        var histories: string[] = utils.removeRepeat(utils.getStorage("searchHistory", "localStorage"));
        if (histories.length == 0) {
            $("#clearHistory").hide();
        } else {
            $("#clearHistory").show();
        }
        if (histories != null) {
            for (var i = 0; i < histories.length; i++) {
                var searchItem: HTMLLIElement = document.createElement("li");
                searchItem.className = "search_li";
                searchItem.textContent = histories[i];
                searchItem.onclick = function () {
                    startSearch(this.textContent);
                }
                search_history.appendChild(searchItem);
            }
        }
    }
    export function loadHotTopGame() {//加载热门搜索
        $(search_hot).empty();
        var para: GAMECENTER.HOTTOPGAMEINFOREQ = new GAMECENTER.HOTTOPGAMEINFOREQ();
        GAMECENTER.getHotTopGame(para, resp => {
            var dat: GAMECENTER.HOTTOPGAMEINFOLISTRESP = resp.data;
            if (dat.hottopgamelist != null) {
                for (var i = 0; i < dat.hottopgamelist.length; i++) {
                    var searchItem: HTMLLIElement = document.createElement("li");
                    searchItem.className = "search_li";
                    searchItem.textContent = dat.hottopgamelist[i].name;
                    searchItem.onclick = function () {
                        startSearch(this.textContent);
                    }
                    search_hot.appendChild(searchItem);
                }
            }
        });
    }

    export function initData() {//初始化数据
        searchitem.style.display = "none";
        for (var i = 0; i < searchitems.length; i++) {
            searchlist.removeChild(searchitems[i]);
        }
        searchitems.splice(0);
        $("#search_input").bind("keydown", function (e) {//绑定回车事件
            var gamename = $("#search_input").val();
            if (e.keyCode == 13) {
                startSearch(gamename);
            }
        })
        $("#search").bind("click", function () {//触摸点击事件
            var gamename = $("#search_input").val();
            startSearch(gamename);
        });
        $("#close").bind("click", function () {//触摸点击事件
            hideSearch();
        });
        $("#searchBtn").bind("click", function () {//触摸点击事件
            showSearch();
        });
        $("#clearHistory").bind("click", function () {//清空搜索缓存
            utils.removeStorag("searchHistory", "localStorage");
            $("#search_history").empty();
            $(this).hide();
        });
    }

    function startSearch(gamename) {//开始搜索
        if (!gamename) {
            utils.dialogBox("请输入需要查询的内容", () => {
                $("#search_input").focus();
            });
            return;
        }
        var searchHistory = utils.getStorage("searchHistory", "localStorage");
        var searchList: string[] = [];
        if (searchHistory != null) {
            searchList = searchHistory;
        }
        searchList.push(gamename);
        utils.setStorage("searchHistory", searchList, "localStorage");
        loadSearchHistory();
        GAMECENTER.gsusergeth5applistbyname(gamename, function (resp) {//根据游戏名搜索游戏
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < searchitems.length; i++) {
                searchlist.removeChild(searchitems[i]);
            }
            searchitems.splice(0);
            var h5infoAddImage: GAMECENTER.H5APPINFOADDIMG[] = resp.data;
            if (h5infoAddImage.length == 0) {
                utils.dialogBox("查无数据！！！", () => {
                    $("#search_input").val(null).focus();
                });
                return;
            } else {
                hideSearch();
                var today = new Date();
                for (var i = 0; i < h5infoAddImage.length; i++) {
                    var tjImage = document.createElement("i");//推荐图标生成
                    var giftImage = document.createElement("i");//礼包图标生成
                    var newImage: HTMLImageElement = document.createElement("img");//新游tag
                    tjImage.textContent = "推荐";
                    giftImage.textContent = "礼包";
                    tjImage.setAttribute("class", "tagtj");
                    giftImage.setAttribute("class", "taggb");
                    newImage.setAttribute("src", "../style/img/index/gameTag.png");
                    newImage.setAttribute("class", "gameTag");
                    var appinfo: GAMECENTER.H5APPINFO = h5infoAddImage[i];
                    var items: HTMLLIElement = <any>searchitem.cloneNode(true);
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
                    (function fun(data: GAMECENTER.H5APPINFO) {
                        $(items).find("#btn").click(ev => {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            window.location.href = "../../gamepage.html#" + data.id;
                        });
                        $(items).find("#gameheadshot").attr("src", appinfo.ico+"?"+Math.random()).attr("title", appinfo.name).click(ev => {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                                if (utils.isMobileBrowser()) {
                                    window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                } else {
                                    window.location.href = "../../gamepage.html#" + data.id;
                                }
                            } else {
                                if (utils.isMobileBrowser()) {
                                    window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                    setTimeout(() => {window.parent.location.reload();}, 500);
                                } else {
                                    window.parent.location.href = "../../gamepage.html#" + data.id;
                                    setTimeout(() => {window.parent.location.reload();}, 500);
                                }
                            }
                        });
                        GAMECENTER.getGameAllGift({ loginid: GAMECENTER.userinfo.sdkloginid, gname: data.name,itemid:items.id }, (resp) => {
                            if (resp.errno != 0) {
                                utils.dialogBox(resp.message);
                                return;
                            }
                            var itemId = document.getElementById(resp.data.itemid);
                            var dat: GAMECENTER.GSGETGAMEALLGIFTINFO[] = resp.data.datalist.datalist;
                            var giftlist: HTMLOListElement = <any>itemId.querySelector("#giftlist");
                            var giftitem: HTMLLIElement = <any>giftlist.firstElementChild;
                            var giftitems: HTMLLIElement[] = [];
                            giftitem.style.display = "none";
                            for (var i = 0; i < giftitems.length; i++) {
                                giftlist.removeChild(giftitems[i]);
                            }
                            giftitems.splice(0);
                            for (var j = 0; dat != null && j < dat.length; j++) {
                                var gift: GAMECENTER.GSGETGAMEALLGIFTINFO = dat[j];
                                var item: HTMLLIElement = <any>giftitem.cloneNode(true);
                                if (gift.loginid != null) {//当前账号领取礼包情况
                                    $(item).find("#SR_gb_btn").css("background", "#E55659").text("已领取");
                                }
                                $(item).find("#giftname").text(gift.giftname);
                                $(item).find("#giftdetail").text(gift.instruction);
                                $(item).find("#searchgameshot").attr("src", gift.ico + "?" + Math.random());
                                (function fun(data: GAMECENTER.GSGETGAMEALLGIFTINFO) {
                                    $(item).find("#SR_gb_btn").on("click", function () {
                                        var loginid = GAMECENTER.userinfo.sdkloginid;
                                        var getFlag = $(this).text();
                                        if ("已领取" == getFlag) {
                                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                                        } else {
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

    export function getGiftCode(typeid, loginid, gameid, flags, doc) {//获取礼包码
        var para: GAMECENTER.GETCODEINFOREQ = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getCodeInfo(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);;
                return;
            }
            SEARCH_NEW.showMask();
            if (!!resp.data.code) {
                $("#copyCode").text(resp.data.code);
                $("#copyto").css("display", "");
            } else {
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
                if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html")>=0)) {
                    if (utils.isMobileBrowser()) {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    } else {
                        window.location.href = "../../gamepage.html#" + resp.data.gameid;
                    }
                } else {
                    if (utils.isMobileBrowser()) {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        setTimeout(() => {window.parent.location.reload();}, 500);
                    } else {
                        window.parent.location.href = "../../gamepage.html#" + resp.data.gameid;
                        setTimeout(() => {window.parent.location.reload();}, 500);
                    }
                }
            });
        });
    }

    export function showMask() {
        $(".mask").css("display", "block");
    }
    export function hideMask() {
        $(".mask").css("display", "none");
    }

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
}