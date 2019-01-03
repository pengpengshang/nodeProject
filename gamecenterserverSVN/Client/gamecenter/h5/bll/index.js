window.addEventListener("message", function (e) {
    if (!!e.data) {
        var para = new GAMECENTER.GSUSERLOGINREQ();
        para.loginid = e.data.loginid;
        para.pwd = e.data.pwd;
        GAMECENTER.gsUserLogin_old(para, function (resp) {
            var dat = resp.data;
            GAMECENTER.userinfo = dat.userinfo;
            GAMECENTER.SaveUserInfo();
            parent.window.frames["rightFrame"].location.href = "http://5wanpk.com/h5_old";
        });
    }
});
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
        if (!!utils.getExpiresCookies("loginFlags")) {
        }
        else {
            $("#index_show_img").css("display", "block");
            utils.setExpiresCookies("loginFlags", "1");
        }
        INDEX_SECOND.loadDefaultData(userinfo);
        //if (navigator.userAgent.indexOf("FIVEGAME") >= 0 && (this.parent == this)) {
        //    if (!!utils.getExpiresCookies("loginFlags")) {
        //        window.location.href = "../../gamepage.html#423";
        //        //window.location.href = "http://www.baidu.com/"
        //    } else {
        //        INDEX_SECOND.loadDefaultData(userinfo);
        //    }
        //} else {
        //    INDEX_SECOND.loadDefaultData(userinfo);
        //}
    });
});
var INDEX_SECOND;
(function (INDEX_SECOND) {
    var rpgame;
    function loadDefaultData(userinfo) {
        loadBanner();
        //GAMECENTER.newMessage();
        getTjGame();
        ShowRecentPlay();
        loadGameData();
        loadHotGameList();
        loadTitleData();
        WXShare();
        loadTwoBanner();
    }
    INDEX_SECOND.loadDefaultData = loadDefaultData;
    /***********************获取推荐的游戏*******************************/
    function getTjGame() {
        var tjgame = document.getElementById("tj_game_list");
        var para = new GAMECENTER.GETACTIVEREQ();
        GAMECENTER.getTjGameList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var tjgamelist = resp.data;
            for (var i = 0; i < tjgamelist.length; i++) {
                var item = document.createElement("div");
                var link = document.createElement("a");
                var img = document.createElement("img");
                var appinfo = tjgamelist[i];
                (function fun(data) {
                    link.onclick = function () {
                        //utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        }
                        else {
                            window.location.href = "../../gamepage.html#" + data.id;
                        }
                    };
                })(appinfo);
                img.src = appinfo.ico;
                img.setAttribute("class", "show_img");
                link.appendChild(img);
                item.setAttribute("class", "swiper-slide img");
                item.appendChild(link);
                tjgame.appendChild(item);
            }
            var swiper = new Swiper('.tj_game', {
                pagination: '.swiper-pagination',
                slidesPerView: 5,
                autoplay: 2000,
                paginationClickable: true,
                grabCursor: true,
                loop: true,
                spaceBetween: 10
            });
        });
    }
    INDEX_SECOND.getTjGame = getTjGame;
    /***************************加载热门游戏列表**********************************/
    function loadHotGameList() {
        var top_hot = [];
        var bottom_hot = [];
        var tophotlist = document.getElementById("hotgame_top");
        var tophotitem = tophotlist.firstElementChild;
        var tophotitems = [];
        var bottomhotlist = document.getElementById("hotgame_bottom");
        var bottomhotitem = bottomhotlist.firstElementChild;
        var bottomhotitems = [];
        tophotitem.style.display = "none";
        bottomhotlist.firstElementChild.remove();
        for (var i = 0; i < tophotitems.length; i++) {
            tophotlist.removeChild(tophotitems[i]);
        }
        for (var i = 0; i < bottomhotitems.length; i++) {
            bottomhotlist.removeChild(bottomhotitems[i]);
        }
        tophotitems.splice(0);
        bottomhotitems.splice(0);
        var para = new GAMECENTER.HOTGAMELISTINFO();
        GAMECENTER.getHotGameList(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 'top') {
                    top_hot.push(data[i]);
                }
                else {
                    bottom_hot.push(data[i]);
                }
            }
            for (var i = 0; i < top_hot.length; i++) {
                var tophotinfo = top_hot[i];
                var topitem = tophotitem.cloneNode(true);
                $(topitem).find("#top_img").attr("src", tophotinfo.img);
                if (tophotinfo.gamename.length > 6) {
                    $(topitem).find("#top_gamename").text((tophotinfo.gamename).substr(0, 6));
                }
                else {
                    $(topitem).find("#top_gamename").text(tophotinfo.gamename);
                }
                (function fun(mdata) {
                    $(topitem).find("#top_startgame").click(function () {
                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + mdata.appid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        }
                        else {
                            window.location.href = "../../gamepage.html#" + mdata.appid;
                        }
                    });
                    $(topitem).find(".gift_bag").click(function () {
                        switch ($(this).parent().index()) {
                            case 1:
                                countBanner('top1', mdata.appid);
                                break;
                            case 2:
                                countBanner('top2', mdata.appid);
                                break;
                            case 3:
                                countBanner('top3', mdata.appid);
                                break;
                            default:
                                countBanner('top4', mdata.appid);
                        }
                        //window.location.href = 'gameDetail.html?gameid=' + mdata.appid;
                    });
                })(tophotinfo);
                topitem.style.display = "";
                tophotlist.appendChild(topitem);
                tophotitems.push(topitem);
            }
            for (var i = 0; i < bottom_hot.length; i++) {
                var bottomhotinfo = bottom_hot[i];
                var bottomitem = bottomhotitem.cloneNode(true);
                $(bottomitem).find("#bottom_img").attr("src", bottomhotinfo.img);
                if (bottomhotinfo.gamename.length > 6) {
                    $(bottomitem).find("#bottom_gamename").text((bottomhotinfo.gamename).substr(0, 6));
                }
                else {
                    $(bottomitem).find("#bottom_gamename").text(bottomhotinfo.gamename);
                }
                (function fun(mdata) {
                    $(bottomitem).find("#bottom_startgame").click(function () {
                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + mdata.appid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        }
                        else {
                            window.location.href = "../../gamepage.html#" + mdata.appid;
                        }
                    });
                    $(bottomitem).find(".gift_bag").click(function () {
                        switch ($(this).parent().index()) {
                            case 0:
                                countBanner('bottom1', mdata.appid);
                                break;
                            case 1:
                                countBanner('bottom2', mdata.appid);
                                break;
                            case 2:
                                countBanner('bottom3', mdata.appid);
                                break;
                            default:
                                countBanner('bottom4', mdata.appid);
                        }
                        //window.location.href = 'gameDetail.html?gameid=' + mdata.appid;
                    });
                })(bottomhotinfo);
                bottomhotitem.style.display = "";
                bottomhotlist.appendChild(bottomitem);
                bottomhotitems.push(bottomitem);
            }
        });
    }
    INDEX_SECOND.loadHotGameList = loadHotGameList;
    /*********************加载玩过的游戏************************/
    function ShowRecentPlay() {
        rpgame = document.getElementById("swiper-wrapper");
        var guicon = document.getElementById("head_img");
        guicon.src = GAMECENTER.userinfo.headico;
        var para = new H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ();
        para.userid = GAMECENTER.userinfo.userid;
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
                img.src = appinfo.ico;
                img.setAttribute("class", "show_img");
                link.appendChild(img);
                item.setAttribute("class", "swiper-slide img");
                item.appendChild(link);
                rpgame.appendChild(item);
            }
            var swiper2 = new Swiper('.history', {
                pagination: '.swiper-pagination',
                slidesPerView: 5,
                autoplay: 2000,
                paginationClickable: true,
                grabCursor: true,
                spaceBetween: 10
            });
        });
    }
    INDEX_SECOND.ShowRecentPlay = ShowRecentPlay;
    /*********************加载Banner图************************/
    function loadBanner() {
        var url;
        var banner = document.getElementById("top_banner");
        GAMECENTER.gsUserGetBannerData({}, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ads;
            var bannerdata = utils.getStorage("bannerdata", "sessionStorage");
            if (bannerdata == null) {
                utils.setStorage("bannerdata", resp.data.activityad, "sessionStorage");
                ads = resp.data.activityad;
            }
            else {
                ads = bannerdata;
            }
            for (var i = 0; i < ads.length; i++) {
                var adItem = document.createElement("div");
                var link = document.createElement("a");
                var img = document.createElement("img");
                var bannerinfo = ads[i];
                (function fun(data) {
                    if (bannerinfo.type == 1) {
                        link.onclick = function () {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        };
                        if (isSafari()) {
                            url = "../../gamepage.html#" + data.url + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        }
                        else {
                            url = "../../gamepage.html#" + data.url;
                        }
                    }
                    else {
                        if (isSafari()) {
                            url = "../../gamepage.html#" + data.url + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        }
                        else {
                            url = "../../gamepage.html#" + data.url;
                        }
                    }
                    link.href = url;
                })(bannerinfo);
                img.src = bannerinfo.img;
                img.setAttribute("class", "bannerImg");
                link.appendChild(img);
                adItem.setAttribute("class", "swiper-slide");
                adItem.appendChild(link);
                banner.appendChild(adItem);
            }
            $(".bannerImg").click(function () {
                switch ($(this).parent().parent().index()) {
                    case 1:
                        countBanner('banner1', null);
                        break;
                    case 2:
                        countBanner('banner2', null);
                        break;
                    case 3:
                        countBanner('banner3', null);
                        break;
                    case 4:
                        countBanner('banner4', null);
                        break;
                    case 5:
                        countBanner('banner5', null);
                        break;
                }
            });
            var swiper = new Swiper('.banner', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 3000,
                loop: true,
                autoplayDisableOnInteraction: false
            });
        });
    }
    INDEX_SECOND.loadBanner = loadBanner;
    /************************************列取不同类型的游戏**************************************************/
    var pc = IsPC();
    var xianxia = []; //仙侠游戏
    var juqing = []; //剧情游戏
    var xiuxian = []; //休闲游戏
    var celue = []; //策略游戏
    var moni = []; //模拟游戏
    var all = []; //所有游戏
    function loadGameData() {
        GAMECENTER.gsUserGetH5AppList({ id: null }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
            var h5games = dat.applist;
            for (var i = 0; i < h5games.length; i++) {
                var hs = h5games[i];
                if (hs.ico != null && hs.ico != '') {
                    if (hs.type == "1") {
                        xianxia.push(hs);
                    }
                    if (hs.type == "2") {
                        xiuxian.push(hs);
                    }
                    if (hs.type == "3") {
                        celue.push(hs);
                    }
                    if (hs.type == "4") {
                        juqing.push(hs);
                    }
                    if (hs.type == "5") {
                        moni.push(hs);
                    }
                }
            }
            addgametolist();
            var allgame_list = document.getElementById("all");
            for (var i = 0; i < h5games.length; i++) {
                var item = document.createElement("div");
                var link = document.createElement("a");
                var img = document.createElement("img");
                var span = document.createElement("span");
                var appinfo = h5games[i];
                if (appinfo.ico != null && appinfo.ico != '') {
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
                    img.src = appinfo.ico;
                    if (!!pc) {
                        span.textContent = (appinfo.name).substr(0, 6);
                        span.style.fontSize = '0.15rem';
                    }
                    else {
                        span.textContent = (appinfo.name).substr(0, 4);
                    }
                    img.setAttribute("class", "show_img");
                    span.setAttribute("class", "index_appname");
                    link.appendChild(img);
                    link.appendChild(span);
                    item.setAttribute("class", "swiper-slide img");
                    item.appendChild(link);
                    allgame_list.appendChild(item);
                }
            }
            var swiper2 = new Swiper('.banner_all', {
                pagination: '.swiper-pagination',
                slidesPerView: 5,
                paginationClickable: true,
                spaceBetween: 10
            });
        });
    }
    INDEX_SECOND.loadGameData = loadGameData;
    function addgametolist() {
        var xianxia_list = document.getElementById("xian");
        var juqing_list = document.getElementById("ju");
        var xiuxian_list = document.getElementById("xiu");
        var celue_list = document.getElementById("ce");
        var moni_list = document.getElementById("mo");
        for (var i = 0; i < xianxia.length; i++) {
            //仙侠游戏
            var item = document.createElement("div");
            var link = document.createElement("a");
            var img = document.createElement("img");
            var span = document.createElement("span");
            var appinfo = xianxia[i];
            (function fun(data1) {
                link.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data1.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + data1.id;
                    }
                };
            })(appinfo);
            img.src = appinfo.ico;
            if (!!pc) {
                span.textContent = (appinfo.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            }
            else {
                span.textContent = (appinfo.name).substr(0, 4);
            }
            span.setAttribute("class", "index_appname");
            img.setAttribute("class", "show_img");
            link.appendChild(img);
            link.appendChild(span);
            item.setAttribute("class", "swiper-slide img");
            item.appendChild(link);
            xianxia_list.appendChild(item);
        }
        var swiper2 = new Swiper('.banner_xianxia', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 10
        });
        //剧情游戏
        for (var i = 0; i < juqing.length; i++) {
            var item_juqing = document.createElement("div");
            var link_juqing = document.createElement("a");
            var img_juqing = document.createElement("img");
            var span = document.createElement("span");
            var appinfo_juqing = juqing[i];
            (function fun(data2) {
                link_juqing.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data2.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + data2.id;
                    }
                };
            })(appinfo_juqing);
            img_juqing.src = appinfo_juqing.ico;
            if (!!pc) {
                span.textContent = (appinfo_juqing.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            }
            else {
                span.textContent = (appinfo_juqing.name).substr(0, 4);
            }
            img_juqing.setAttribute("class", "show_img");
            span.setAttribute("class", "index_appname");
            link_juqing.appendChild(img_juqing);
            link_juqing.appendChild(span);
            item_juqing.setAttribute("class", "swiper-slide img");
            item_juqing.appendChild(link_juqing);
            juqing_list.appendChild(item_juqing);
        }
        var swiper2 = new Swiper('.banner_juqing', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 10
        });
        //休闲游戏
        for (var i = 0; i < xiuxian.length; i++) {
            var item_xiuxian = document.createElement("div");
            var link_xiuxian = document.createElement("a");
            var img_xiuxian = document.createElement("img");
            var span = document.createElement("span");
            var appinfo_xiuxian = xiuxian[i];
            (function fun(data3) {
                link_xiuxian.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data3.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + data3.id;
                    }
                };
            })(appinfo_xiuxian);
            img_xiuxian.src = appinfo_xiuxian.ico;
            if (!!pc) {
                span.textContent = (appinfo_xiuxian.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            }
            else {
                span.textContent = (appinfo_xiuxian.name).substr(0, 4);
            }
            span.setAttribute("class", "index_appname");
            img_xiuxian.setAttribute("class", "show_img");
            link_xiuxian.appendChild(img_xiuxian);
            link_xiuxian.appendChild(span);
            item_xiuxian.setAttribute("class", "swiper-slide img");
            item_xiuxian.appendChild(link_xiuxian);
            xiuxian_list.appendChild(item_xiuxian);
        }
        var swiper2 = new Swiper('.banner_xiuxian', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 10
        });
        //策略游戏
        for (var i = 0; i < celue.length; i++) {
            var item_celue = document.createElement("div");
            var link_celue = document.createElement("a");
            var img_celue = document.createElement("img");
            var span = document.createElement("span");
            var appinfo_celue = celue[i];
            (function fun(data4) {
                link_celue.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data4.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + data4.id;
                    }
                };
            })(appinfo_celue);
            img_celue.src = appinfo_celue.ico;
            if (!!pc) {
                span.textContent = (appinfo_celue.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            }
            else {
                span.textContent = (appinfo_celue.name).substr(0, 4);
            }
            span.setAttribute("class", "index_appname");
            img_celue.setAttribute("class", "show_img");
            link_celue.appendChild(img_celue);
            link_celue.appendChild(span);
            item_celue.setAttribute("class", "swiper-slide img");
            item_celue.appendChild(link_celue);
            celue_list.appendChild(item_celue);
        }
        var swiper2 = new Swiper('.banner_celue', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 10
        });
        //模拟游戏
        for (var i = 0; i < moni.length; i++) {
            var item_moni = document.createElement("div");
            var link_moni = document.createElement("a");
            var img_moni = document.createElement("img");
            var span = document.createElement("span");
            var appinfo_moni = moni[i];
            (function fun(data5) {
                link_moni.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data5.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    }
                    else {
                        window.location.href = "../../gamepage.html#" + data5.id;
                    }
                };
            })(appinfo_moni);
            img_moni.src = appinfo_moni.ico;
            if (!!pc) {
                span.textContent = (appinfo_moni.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            }
            else {
                span.textContent = (appinfo_moni.name).substr(0, 4);
            }
            img_moni.setAttribute("class", "show_img");
            span.setAttribute("class", "index_appname");
            link_moni.appendChild(img_moni);
            link_moni.appendChild(span);
            item_moni.setAttribute("class", "swiper-slide img");
            item_moni.appendChild(link_moni);
            moni_list.appendChild(item_moni);
        }
        var swiper2 = new Swiper('.banner_moni', {
            pagination: '.swiper-pagination',
            slidesPerView: 5,
            paginationClickable: true,
            spaceBetween: 10
        });
    }
    INDEX_SECOND.addgametolist = addgametolist;
    /***************************获取首页两个广告banner*****************************/
    function loadTwoBanner() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getAdBannerlist(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            $("#index_banner1").attr("src", data[0].banner);
            $("#index_banner2").attr("src", data[1].banner);
            $("#index_banner1").click(function () {
                window.location.href = 'gameDetail.html?gameid=' + data[0].gameid;
            });
            $("#index_banner2").click(function () {
                window.location.href = 'gameDetail.html?gameid=' + data[1].gameid;
            });
        });
    }
    INDEX_SECOND.loadTwoBanner = loadTwoBanner;
    /******************************列取活动banner*********************************/
    var showgamelist = document.getElementById("show_tjgame_all");
    var showgameitem = showgamelist.firstElementChild;
    var showgameitems = [];
    function loadShowTjgame() {
        var para = new GAMECENTER.GAMETYPEREQ();
        GAMECENTER.gsGetshowgamelist(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            showgameitem.style.display = "none";
            for (var i = 0; i < showgameitems.length; i++) {
                showgamelist.removeChild(showgameitem[i]);
            }
            showgameitems.splice(0);
            var stlist = resp.data;
            for (var i = 0; i < stlist.length; i++) {
                var data = stlist[i];
                var item = HTMLLIElement = showgameitem.cloneNode(true);
                $(item).find("#show_img_banner").attr("src", data.ico);
                $(item).find("#show_game_name").text(data.appname);
                $(item).find("#show_gamedetail").text(data.intro);
                $(item).find("#game_play_count").text(data.count);
                (function fun(appinfo) {
                    $(item).find("#show_game_btn").click(function (ev) {
                        if (isSafari()) {
                            window.location.href = '../../gamepage.html#' + appinfo.Id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        }
                        else {
                            window.location.href = '../../gamepage.html#' + appinfo.Id;
                        }
                    });
                    $(item).find("#show_img_banner").click(function (ev) {
                        window.location.href = 'gameDetail.html?gameid=' + appinfo.Id;
                    });
                    $(item).find("#gift_ico").click(function (ev) {
                        window.location.href = 'gameDetail.html?gameid=' + appinfo.Id;
                    });
                })(data);
                item.style.display = "";
                showgamelist.appendChild(item);
                showgameitems.push(item);
            }
        });
    }
    INDEX_SECOND.loadShowTjgame = loadShowTjgame;
    /************************************列取游戏结束**************************************************/
    /*************开服表数据展示***************/
    var openinglist = document.getElementById("opening_table");
    var openingitem = openinglist.firstElementChild;
    var openingitems = [];
    var wait_openlist = document.getElementById("wait_opening_table");
    var wait_openitem = wait_openlist.firstElementChild;
    var wait_openitems = [];
    function loadServerTable() {
        var para = new GAMECENTER.GSGETSERVERTABLEREQ();
        var now = new Date().getTime();
        GAMECENTER.gsGetServerTable(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            openingitem.style.display = "none";
            wait_openitem.style.display = "none";
            var stlist = resp.data;
            //元素清除操作
            for (var i = 0; i < openingitems.length; i++) {
                openinglist.removeChild(openingitems[i]);
            }
            for (var i = 0; i < wait_openitems.length; i++) {
                wait_openlist.removeChild(wait_openitems[i]);
            }
            openingitems.splice(0);
            wait_openitems.splice(0);
            for (var i = 0; i < stlist.length; i++) {
                var dat = stlist[i];
                var item = null;
                if (dat.openTime <= now) {
                    if (new Date(dat.openTime).toLocaleDateString() == new Date().toLocaleDateString()) {
                        item = HTMLLIElement = openingitem.cloneNode(true);
                        $(item).find("#gameName").text(dat.appname);
                        $(item).find("#game_mess").text(dat.serverName);
                        $(item).find("#gameheadshot").attr("src", dat.ico);
                        var arr = (new Date(dat.openTime).toLocaleString()).split(" ");
                        $(item).find("#opentime").text(arr[1]);
                        (function fun(data) {
                            $(item).find("#table_getingame").click(function () {
                                window.location.href = "http://5wanpk.com/open/h5game2.html#" + data.gameid;
                            });
                        })(dat);
                        item.style.display = "";
                        openinglist.appendChild(item);
                        openingitems.push(item);
                    }
                }
                if (dat.openTime > now) {
                    var now_new = new Date();
                    now_new.setDate(now_new.getDate() + 3);
                    if (new Date(dat.openTime).toLocaleDateString() < new Date((new Date().setDate(new Date().getDate() + 3))).toLocaleDateString()) {
                        item = HTMLLIElement = wait_openitem.cloneNode(true);
                        $(item).find("#gameName_wite").text(dat.appname);
                        //$(item).find("#save_gameid").attr("title", dat.gameid);
                        $(item).find("#game_mess").text(dat.serverName);
                        $(item).find("#gameheadshot").attr("src", dat.ico);
                        var arr = (new Date(dat.openTime).toLocaleString()).split(" ");
                        (function fun(data) {
                            $(item).find("#table_getingame").click(function () {
                                window.location.href = "http://5wanpk.com/open/h5game2.html#" + data.gameid;
                            });
                        })(dat);
                        if (arr[0] == new Date().toLocaleDateString()) {
                            $(item).find("#opentime").text("今日 " + arr[1]);
                        }
                        else {
                            $(item).find("#opentime").text(arr[0]);
                        }
                        item.style.display = "";
                        wait_openlist.appendChild(item);
                        wait_openitems.push(item);
                    }
                }
            }
        });
    }
    INDEX_SECOND.loadServerTable = loadServerTable;
    /*************开服表结束***************/
    /**********************************礼包列取********************************************/
    var newGift = []; //最新礼包
    var hotGift = []; //最热礼包
    var onlyGift = []; //独家礼包
    var newgiftlist = document.getElementById("new_gift");
    var newgiftitem = newgiftlist.firstElementChild;
    var newgiftitems = [];
    var hotgiftlist = document.getElementById("hot_gift");
    var hotgiftitem = hotgiftlist.firstElementChild;
    var hotgiftitems = [];
    var onlygiftlist = document.getElementById("only_gift");
    var onlygiftitem = onlygiftlist.firstElementChild;
    var onlygiftitems = [];
    function listGiftbagAll() {
        var para = new GAMECENTER.GETALLGIFTTYPEREQNEW();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        GAMECENTER.getAllGiftList(para, function (resp) {
            newgiftitem.style.display = 'none';
            for (var i = 0; i < newgiftitems.length; i++) {
                newgiftlist.removeChild(newgiftitems[i]);
            }
            newgiftitems.splice(0);
            hotgiftitem.style.display = 'none';
            for (var i = 0; i < hotgiftitems.length; i++) {
                hotgiftlist.removeChild(hotgiftitems[i]);
            }
            hotgiftitems.splice(0);
            onlygiftitem.style.display = 'none';
            for (var i = 0; i < onlygiftitems.length; i++) {
                onlygiftlist.removeChild(onlygiftitems[i]);
            }
            onlygiftitems.splice(0);
            var data = resp.data;
            fillType(data);
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < newGift.length; i++) {
                var newgiftinfo = newGift[i];
                var newitems = HTMLLIElement = newgiftitem.cloneNode(true);
                var prent = parseInt(((newgiftinfo.total - newgiftinfo.remainder) / newgiftinfo.total * 100).toString());
                $(newitems).find("#newgift_ico").attr("src", newgiftinfo.ico);
                $(newitems).find("#newgift_appname").text(newgiftinfo.name);
                $(newitems).find("#newgift_name").text(newgiftinfo.giftname);
                $(newitems).find("#newgift_createtime").text(new Date(newgiftinfo.endtime).toLocaleDateString());
                $(newitems).find("#newgift_left").attr("max", newgiftinfo.total);
                $(newitems).find("#newgift_left").attr("value", newgiftinfo.total - newgiftinfo.remainder);
                $(newitems).find("#newgift_baifen").text(prent + "%");
                if (newgiftinfo.groupqq == '' || newgiftinfo.groupqq == null) {
                    $(newitems).find("#get_in_together").attr("src", '../img/game/giftbag/nomall.png');
                    if (newgiftinfo.loginid == null) {
                        $(newitems).find(".together_qq").text("领取");
                        $(newitems).find(".together_qq").css({ "color": "white", "background-color": "red", "border": "none" });
                    }
                    else {
                        $(newitems).find(".together_qq").text("查看");
                    }
                }
                else {
                    $(newitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(newitems).find(".together_qq").text("加群");
                    $(newitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border": "2px solid #FA6828"
                    });
                }
                (function fun(data) {
                    $(newitems).find("#get_gift_code").on("click", function () {
                        var getFlag = $(this).text();
                        var loginid = GAMECENTER.userinfo.sdkloginid;
                        if ($(this).text() == "领取") {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                        if ($(this).text() == "查看") {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        }
                        if (($(this).text() == "加群")) {
                            window.location.href = data.groupqq;
                        }
                    });
                    $(newitems).find("#newgift_ico").on("click", function () {
                        window.location.href = 'gameDetail.html?gameid=' + data.gameid;
                    });
                })(newgiftinfo);
                newitems.style.display = '';
                newgiftlist.appendChild(newitems);
                newgiftitems.push(newitems);
            }
            for (var i = 0; i < hotGift.length; i++) {
                var hotgiftinfo = hotGift[i];
                var hotitems = HTMLLIElement = hotgiftitem.cloneNode(true);
                var prent = parseInt(((hotgiftinfo.total - hotgiftinfo.remainder) / hotgiftinfo.total * 100).toString());
                $(hotitems).find("#hotgift_ico").attr("src", hotgiftinfo.ico);
                $(hotitems).find("#hotgift_apname").text(hotgiftinfo.name);
                $(hotitems).find("#hotgift_name").text(hotgiftinfo.giftname);
                $(hotitems).find("#hotgift_createtime").text(new Date(hotgiftinfo.endtime).toLocaleDateString());
                $(hotitems).find("#hotgift_left").attr("max", hotgiftinfo.total);
                $(hotitems).find("#hotgift_left").attr("value", hotgiftinfo.total - hotgiftinfo.remainder);
                $(hotitems).find("#hotgift_baifen").text(prent + "%");
                if (hotgiftinfo.groupqq == '' || hotgiftinfo.groupqq == null) {
                    $(hotitems).find("#get_in_together").attr("src", '../img/game/giftbag/nomall.png');
                    if (hotgiftinfo.loginid == null) {
                        $(hotitems).find(".together_qq").text("领取");
                        $(hotitems).find(".together_qq").css({ "color": "white", "background-color": "red", "border": "none" });
                    }
                    else {
                        $(hotitems).find(".together_qq").text("查看");
                    }
                }
                else {
                    $(hotitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(hotitems).find(".together_qq").text("加群");
                    $(hotitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border": "2px solid #FA6828"
                    });
                }
                (function fun(data) {
                    $(hotitems).find("#get_gift_code").on("click", function () {
                        var getFlag = $(this).text();
                        var loginid = GAMECENTER.userinfo.sdkloginid;
                        if ($(this).text() == "领取") {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                        if ($(this).text() == "查看") {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        }
                        if (($(this).text() == "加群")) {
                            window.location.href = data.groupqq;
                        }
                    });
                    $(hotitems).find("#hotgift_ico").on("click", function () {
                        window.location.href = 'gameDetail.html?gameid=' + data.gameid;
                    });
                })(hotgiftinfo);
                hotitems.style.display = '';
                hotgiftlist.appendChild(hotitems);
                hotgiftitems.push(hotitems);
            }
            for (var i = 0; i < onlyGift.length; i++) {
                var onlygiftinfo = onlyGift[i];
                var onlyitems = HTMLLIElement = onlygiftitem.cloneNode(true);
                var prent = parseInt(((onlygiftinfo.total - onlygiftinfo.remainder) / onlygiftinfo.total * 100).toString());
                $(onlyitems).find("#onlygift_ico").attr("src", onlygiftinfo.ico);
                $(onlyitems).find("#onlygift_appname").text(onlygiftinfo.name);
                $(onlyitems).find("#onlygift_name").text(onlygiftinfo.giftname);
                $(onlyitems).find("#onlygift_createtime").text(new Date(onlygiftinfo.endtime).toLocaleDateString());
                $(onlyitems).find("#onlygift_left").attr("max", onlygiftinfo.total);
                $(onlyitems).find("#onlygift_left").attr("value", onlygiftinfo.total - onlygiftinfo.remainder);
                $(onlyitems).find("#onlygift_baifen").text(prent + "%");
                if (onlygiftinfo.groupqq == '' || onlygiftinfo.groupqq == null) {
                    $(onlyitems).find("#get_in_together").attr("src", '../img/game/giftbag/nomall.png');
                    if (onlygiftinfo.loginid == null) {
                        $(onlyitems).find(".together_qq").text("领取");
                        $(onlyitems).find(".together_qq").css({ "color": "white", "background-color": "red", "border": "none" });
                    }
                    else {
                        $(onlyitems).find(".together_qq").text("查看");
                    }
                }
                else {
                    $(onlyitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(onlyitems).find(".together_qq").text("加群");
                    $(onlyitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border": "2px solid #FA6828"
                    });
                }
                (function fun(data) {
                    $(onlyitems).find("#get_gift_code").on("click", function () {
                        var getFlag = $(this).text();
                        var loginid = GAMECENTER.userinfo.sdkloginid;
                        if ($(this).text() == "领取") {
                            getGiftCode(data.id, loginid, data.gameid, 0, $(this));
                        }
                        if ($(this).text() == "查看") {
                            getGiftCode(data.id, loginid, data.gameid, 1, $(this));
                        }
                        if (($(this).text() == "加群")) {
                            window.location.href = data.groupqq;
                        }
                    });
                    $(onlyitems).find("#onlygift_ico").on("click", function () {
                        window.location.href = 'gameDetail.html?gameid=' + data.gameid;
                    });
                })(onlygiftinfo);
                onlyitems.style.display = '';
                onlygiftlist.appendChild(onlyitems);
                onlygiftitems.push(onlyitems);
            }
        });
    }
    INDEX_SECOND.listGiftbagAll = listGiftbagAll;
    function getGiftCode(typeid, loginid, gameid, flags, doc) {
        var para = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getGifiCode(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var codeinfo = resp.data;
            if (!!codeinfo.code) {
                $("#one_code").text(codeinfo.code);
                $("#one_detail").text(codeinfo.instruction);
                $("#one_theway").text(codeinfo.useway);
                $("#zhezhao").css("display", "");
                doc.text("查看");
                doc.css({ "color": "skyblue", "background-color": "white", "border": "2px solid skyblue" });
            }
            else {
                utils.dialogBox("来晚了,请等待下次发放");
                doc.text("结束");
                doc.css({ "color": "#999999", "border": "2px solid #999999", "background-color": "white" });
                $("#zhezhao").css("display", "none");
            }
            $("#start_game").click(function () {
                if (GAMECENTER.userinfo) {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                }
                if (isSafari()) {
                    window.location.href = "../../gamepage.html#" + resp.data.gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                }
                else {
                    window.location.href = "../../gamepage.html#" + resp.data.gameid;
                }
            });
        });
    }
    INDEX_SECOND.getGiftCode = getGiftCode;
    function fillType(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].gifttype == "new") {
                newGift.push(data[i]);
            }
            if (data[i].gifttype == "hot") {
                hotGift.push(data[i]);
            }
            if (data[i].gifttype == "only") {
                onlyGift.push(data[i]);
            }
        }
        if (newGift.length > 3) {
            var height = $("#new_gift_li").height();
            $("#new_gift").css({ "height": "4.3rem", "overflow": "hidden" });
            $("#list_all_new").click(function () {
                if ($("#new_gift").height() >= height * 3.5) {
                    $("#list_all_new").css({ "transform": "rotate(0deg)" });
                    $("#new_gift").css({ "height": "4.3rem" });
                }
                else {
                    $("#new_gift").css("height", "auto");
                    $("#list_all_new").css({ "transform": "rotate(90deg)" });
                }
            });
        }
        else {
            $("#new_gift").css("height", "auto");
        }
        if (hotGift.length > 3) {
            var height = $("#hot_gift_li").height();
            $("#hot_gift").css({ "height": "4.3rem", "overflow": "hidden" });
            $("#list_all_hot").click(function () {
                if ($("#hot_gift").height() >= height * 3.5) {
                    $("#list_all_hot").css({ "transform": "rotate(0deg)" });
                    $("#hot_gift").css({ "height": "4.3rem" });
                }
                else {
                    $("#hot_gift").css("height", "auto");
                    $("#list_all_hot").css({ "transform": "rotate(90deg)" });
                }
            });
        }
        else {
            $("#hot_gift").css("height", "auto");
        }
        if (onlyGift.length > 3) {
            var height = $("#only_gift_li").height();
            $("#only_gift").css({ "height": "4.3rem", "overflow": "hidden" });
            $("#list_all_only").click(function () {
                if ($("#only_gift").height() >= height * 3.5) {
                    $("#list_all_only").css({ "transform": "rotate(0deg)" });
                    $("#only_gift").css({ "height": "4.3rem" });
                }
                else {
                    $("#only_gift").css("height", "auto");
                    $("#list_all_only").css({ "transform": "rotate(90deg)" });
                }
            });
        }
        else {
            $("#only_gift").css("height", "auto");
        }
    }
    INDEX_SECOND.fillType = fillType;
    /**********************************礼包界面结束********************************************/
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
    INDEX_SECOND.isSafari = isSafari;
    /*************************************获取分类标题**********************************/
    function loadTitleData() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getIndexTile(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data = resp.data;
            $("#gametitle1").text(data[0].title);
            $("#gametitle2").text(data[1].title);
            $("#gametitle3").text(data[2].title);
            $("#gametitle4").text(data[3].title);
            $("#gametitle5").text(data[4].title);
        });
    }
    INDEX_SECOND.loadTitleData = loadTitleData;
    //微信分享
    var data;
    function WXShare() {
        GAMECENTER.openShare("99999", function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            data = resp.data;
            InitWX();
        });
        function InitWX() {
            var wxinit = {
                debug: false,
                appId: 'wxe983a05c52c5188f',
                timestamp: new Date().getTime().toString(),
                nonceStr: Math.floor(Math.random() * 100000000).toString(),
                signature: '',
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };
            var parainit = new GAMECENTER.GETWXCONFIGSIGNREQ();
            parainit.data = wxinit;
            parainit.url = window.location.href;
            GAMECENTER.getWXConfigSign(parainit, function (resp) {
                if (resp.errno != 0) {
                    utils.dialogBox(resp.message);
                    return;
                }
                wxinit.signature = resp.data.sign;
                wx.config(wxinit);
                wx.ready(function () {
                    // utils.dialogBox("ready");
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                    wx.onMenuShareTimeline({
                        title: (!!data.sharetext) ? data.sharetext : data.appname,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        type: '',
                        dataUrl: '',
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQQ({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQZone({
                        title: data.appname,
                        desc: data.sharetext,
                        link: encodeURI(window.location.href),
                        imgUrl: data.shareico,
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                });
            });
        }
    }
    INDEX_SECOND.WXShare = WXShare;
    $("#window_banner").click(function () {
        if (isSafari()) {
            window.location.href = "../../gamepage.html#" + 451 + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
        }
        else {
            window.location.href = "../../gamepage.html#" + 451;
        }
    });
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
    INDEX_SECOND.IsPC = IsPC;
    /*********************图片banner位置点击统计***********************/
    function countBanner(type, appid) {
        var para = new GAMECENTER.COUNTBANNERREQ();
        para.type = type;
        GAMECENTER.countBanner(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            if (!!appid) {
                window.location.href = 'gameDetail.html?gameid=' + appid;
            }
        });
    }
    INDEX_SECOND.countBanner = countBanner;
})(INDEX_SECOND || (INDEX_SECOND = {}));
//# sourceMappingURL=index.js.map