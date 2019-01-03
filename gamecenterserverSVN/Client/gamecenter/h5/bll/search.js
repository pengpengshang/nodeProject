$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", function () {
                window.location.href = "login.html";
            });
            return;
        }
        SEARCH_SECOND.loadDefaultData(userinfo);
    });
});
var SEARCH_SECOND;
(function (SEARCH_SECOND) {
    function loadDefaultData(userinfo) {
        getHotGameList();
        ShowRecentPlay(userinfo);
        loadTitleData();
        loadTwoBanner();
    }
    SEARCH_SECOND.loadDefaultData = loadDefaultData;
    var reg = /^[1-9]\d*$|^0$/;
    var search_hot = document.getElementById("hot_search");
    function getHotGameList() {
        $(search_hot).empty();
        var para = new GAMECENTER.HOTTOPGAMEINFOREQ();
        GAMECENTER.getHotTopGame(para, function (resp) {
            var dat = resp.data;
            var data = [];
            for (var i = 0; i < dat.hottopgamelist.length; i++) {
                if (reg.test(dat.hottopgamelist[i].name) == true) {
                    continue;
                }
                else {
                    data.push(dat.hottopgamelist[i]);
                }
            }
            for (var i = 0; i < data.length; i++) {
                var searchItem = document.createElement("li");
                searchItem.className = "search_li";
                searchItem.textContent = dat.hottopgamelist[i].name;
                searchItem.onclick = function () {
                    startSearch(this.textContent);
                    $(".artical").css("display", "none");
                    $(".type_game_list").css("display", "");
                };
                search_hot.appendChild(searchItem);
            }
        });
    }
    SEARCH_SECOND.getHotGameList = getHotGameList;
    function loadTitleData() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getIndexTile(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            $("#type1").text((data[0].title).substr(0, 2));
            $("#type2").text((data[1].title).substr(0, 2));
            $("#type3").text((data[2].title).substr(0, 2));
            $("#type4").text((data[3].title).substr(0, 2));
            $("#type5").text((data[4].title).substr(0, 2));
        });
    }
    SEARCH_SECOND.loadTitleData = loadTitleData;
    var searchlist = document.getElementById("searchlist");
    var searchitem = searchlist.firstElementChild;
    var searchitems = [];
    function startSearch(gamename) {
        if (!gamename) {
            utils.dialogBox("请输入需要查询的内容", function () {
                $("#search_input").focus();
            });
            return;
        }
        GAMECENTER.gsusergeth5applistbyname(gamename, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            searchitem.style.display = "none";
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
                for (var i = 0; i < h5infoAddImage.length; i++) {
                    var appinfo = h5infoAddImage[i];
                    var items = searchitem.cloneNode(true);
                    items.id = "giftlistitem" + i;
                    $(items).find("#gametype_ico").attr("src", appinfo.ico);
                    $(items).find("#gametype_name").text(appinfo.name);
                    $(items).find("#gametype_detail").text(appinfo.detail);
                    var gameDate = new Date(appinfo.createtime);
                    (function fun(data) {
                        $(items).find("#gametype_ingame").click(function (ev) {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            if (isSafari()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            }
                            else {
                                window.location.href = "../../gamepage.html#" + data.id;
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
    /******************获取玩过的游戏列表*********************/
    function ShowRecentPlay(userinfo) {
        var rpgame = document.getElementById("search_play");
        var para = new H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var h5gameRPlist = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            for (var i = 0; i < h5gameRPlist.length; i++) {
                var item = document.createElement("div");
                var link = document.createElement("a");
                var img = document.createElement("img");
                var span = document.createElement("span");
                var appinfo = h5gameRPlist[i];
                (function fun(data) {
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        }
                        else {
                            window.location.href = "../../gamepage.html#" + data.id;
                        }
                    };
                })(appinfo);
                if (!!IsPC()) {
                    span.textContent = (appinfo.name).substr(0, 6);
                    span.style.fontSize = '0.15rem';
                }
                else {
                    span.textContent = (appinfo.name).substr(0, 4);
                }
                img.src = appinfo.ico;
                img.setAttribute("class", "show_img");
                span.setAttribute("class", "index_appname");
                link.appendChild(img);
                link.appendChild(span);
                item.setAttribute("class", "swiper-slide img");
                item.appendChild(link);
                rpgame.appendChild(item);
            }
            var swiper = new Swiper('.search_play', {
                pagination: '.swiper-pagination',
                slidesPerView: 5,
                paginationClickable: true,
                spaceBetween: 10
            });
        });
    }
    SEARCH_SECOND.ShowRecentPlay = ShowRecentPlay;
    $("#search").bind("click", function () {
        var gamename = $("#search_input").val();
        startSearch(gamename);
        $(".artical").css("display", "none");
        $(".type_game_list").css("display", "");
    });
    $("#search_input").keypress(function (e) {
        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (eCode == 13) {
            var gamename = $("#search_input").val();
            startSearch(gamename);
            $(".artical").css("display", "none");
            $(".type_game_list").css("display", "");
        }
    });
    function isSafari() {
        var ua = navigator.userAgent;
        var gbshare = document.querySelector("#gb-share");
        var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
        var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (isiOS) {
            if (userAgent.indexOf("Safari") > -1) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    SEARCH_SECOND.isSafari = isSafari;
    /***********************加载搜索页底部banner图***************************************/
    function loadTwoBanner() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getAdBannerlist(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            $("#search_banner").attr("src", data[2].banner);
            $("#search_banner").click(function () {
                window.location.href = 'gameDetail.html?gameid=' + data[2].gameid;
            });
        });
    }
    SEARCH_SECOND.loadTwoBanner = loadTwoBanner;
    /********************判断是否是pc端*****************************/
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
    SEARCH_SECOND.IsPC = IsPC;
})(SEARCH_SECOND || (SEARCH_SECOND = {}));
//# sourceMappingURL=search.js.map