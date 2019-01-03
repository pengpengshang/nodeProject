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
        SEARCH2_NEW.loadDefaultData();
    });
});
var SEARCH2_NEW;
(function (SEARCH2_NEW) {
    var search_history = document.getElementById("search_history");
    var search_hot = document.getElementById("search_hot");
    var h5gamelist = document.getElementById("gamelist");
    var h5gameitem = h5gamelist.firstElementChild;
    var h5gameitems = [];
    function loadDefaultData() {
        initData();
        loadSearchHistory();
        loadHotTopGame();
    }
    SEARCH2_NEW.loadDefaultData = loadDefaultData;
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
    SEARCH2_NEW.loadSearchHistory = loadSearchHistory;
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
    SEARCH2_NEW.loadHotTopGame = loadHotTopGame;
    function initData() {
        h5gameitem.style.display = "none";
        for (var i = 0; i < h5gameitems.length; i++) {
            h5gamelist.removeChild(h5gameitems[i]);
        }
        h5gameitems.splice(0);
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
    SEARCH2_NEW.initData = initData;
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
            for (var i = 0; i < h5gameitems.length; i++) {
                h5gamelist.removeChild(h5gameitems[i]);
            }
            h5gameitems.splice(0);
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
                    var items = h5gameitem.cloneNode(true);
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
                        $(items).find("#gameheadshot").attr("src", appinfo.ico).attr("title", appinfo.name).click(function (ev) {
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
})(SEARCH2_NEW || (SEARCH2_NEW = {}));
//# sourceMappingURL=search2.js.map