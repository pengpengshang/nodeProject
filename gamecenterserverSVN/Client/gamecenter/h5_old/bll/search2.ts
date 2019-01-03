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
        SEARCH2_NEW.loadDefaultData();
    });
});
module SEARCH2_NEW {
    var search_history: HTMLUListElement = <any>document.getElementById("search_history");
    var search_hot: HTMLUListElement = <any>document.getElementById("search_hot");
    var h5gamelist: HTMLUListElement = <any>document.getElementById("gamelist");
    var h5gameitem: HTMLLIElement = <any>h5gamelist.firstElementChild;
    var h5gameitems: HTMLLIElement[] = [];
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
        if (histories!=null) {
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
        h5gameitem.style.display = "none";
        for (var i = 0; i < h5gameitems.length; i++) {
            h5gamelist.removeChild(h5gameitems[i]);
        }
        h5gameitems.splice(0);
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
            for (var i = 0; i < h5gameitems.length; i++) {
                h5gamelist.removeChild(h5gameitems[i]);
            }
            h5gameitems.splice(0);
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
                    var items: HTMLLIElement = <any>h5gameitem.cloneNode(true);
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
                        $(items).find("#gameheadshot").attr("src", appinfo.ico).attr("title", appinfo.name).click(ev => {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            window.location.href = "../../gamepage.html#" + data.id;
                        });
                    })(appinfo);
                    items.style.display = "";
                    h5gamelist.appendChild(items);
                    h5gameitems.push(items);
                }
            }
        });
    }
    function hideSearch() {
        $(".searchGame").show();
        $('#search_title').hide();
    }
    function showSearch() {
        SEARCH2_NEW.loadSearchHistory();
        $("#search_input").val(null);
        $(".searchGame").hide();
        $('#search_title').fadeIn(500, function () {
            $(this).show();
        });
    }
}