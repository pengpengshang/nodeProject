declare var Swiper;
$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            return;
        }
        GAMEPAGE_NEW.loadDefaultData();
    });
});
module GAMEPAGE_NEW {
    export function loadDefaultData() {
        loadBanner();
        loadGameData();
        loadServerTable();
    }

    export function loadBanner() {//加载Banner图
        var url;
        var banner: HTMLDivElement = <any>document.getElementById("swiper-wrapper2");
        GAMECENTER.gsUserGetBannerData({}, resp => {//获取banner数据
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ads: GAMECENTER.ACTIVITYAD[];
            ads = resp.data.activityad;
            /*var bannerdata = utils.getStorage("bannerdata", "sessionStorage");
            if (bannerdata == null) {//判断sessionStorage是否为空，不为空取本地
                utils.setStorage("bannerdata", resp.data.activityad, "sessionStorage");
                ads = resp.data.activityad;
            } else {
                ads = bannerdata;
            }*/
            for (var i = 0; i < ads.length; i++) {
                var adItem: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var bannerinfo: GAMECENTER.ACTIVITYAD = ads[i];
                (function fun(data: GAMECENTER.ACTIVITYAD) {
                    if (bannerinfo.type == 1) {//H5游戏
                        link.onclick = function () {
                            utils.setCookie("appid", data.url.toString());
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                            if ((window.parent != window)) {
                                setTimeout(function () {
                                    setTimeout(() => { window.parent.location.reload(); }, 500);
                                }, 500);
                            }
                        };
                        if (utils.isMobileBrowser()) {
                            url = "../../gamepage.html#" + data.url + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
                            url = "../../gamepage.html#" + data.url;
                        }
                    } else {
                        url = data.url;
                    }
                })(bannerinfo);
                link.href = url;
                link.target = "_parent";
                img.src = bannerinfo.img;
                img.setAttribute("class", "bannerImg");
                link.appendChild(img);
                adItem.setAttribute("class", "swiper-slide");
                adItem.appendChild(link);
                banner.appendChild(adItem);
            }
            new Swiper('#swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                centeredSlides: true,
                autoplay: 1500,
                autoplayDisableOnInteraction: false,
                loop: true,
                grabCursor: true
            });
        });
    }
    var h5rmgamelist: HTMLUListElement = <any>document.getElementById("rmlist");
    var h5xygamelist: HTMLUListElement = <any>document.getElementById("xylist");
    var h5phgamelist: HTMLDivElement = <any>document.getElementById("phlist");
    var h5gameitem: HTMLLIElement = <any>h5rmgamelist.firstElementChild;
    var h5phgameitem: HTMLLIElement = <any>h5phgamelist.firstElementChild;
    var h5rmgameitems: HTMLLIElement[] = [];
    var h5xygameitems: HTMLLIElement[] = [];
    var h5phgameitems: HTMLLIElement[] = [];
    var rmorepkgame: HTMLDivElement = <any>document.getElementById("rmorepkgame");
    var xmorepkgame: HTMLDivElement = <any>document.getElementById("xmorepkgame");
    var pmorepkgame: HTMLDivElement = <any>document.getElementById("pmorepkgame");
    var lisNewGame: GAMECENTER.H5APPINFO[] = [];//新游
    var lisHotGame: GAMECENTER.H5APPINFO[] = [];//热游
    var lisRankGame: GAMECENTER.H5APPINFO[] = [];//排行榜
    export function loadGameData() {//加载游戏列表数据
        h5gameitem.style.display = "none";
        h5phgameitem.style.display = "none";
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {//获取H5游戏相关列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            //元素清除操作
            for (var i = 0; i < h5rmgameitems.length; i++) {
                h5rmgamelist.removeChild(h5rmgameitems[i]);
            }
            for (var i = 0; i < h5xygameitems.length; i++) {
                h5xygamelist.removeChild(h5xygameitems[i]);
            }
            for (var i = 0; i < h5phgameitems.length; i++) {
                h5phgamelist.removeChild(h5phgameitems[i]);
            }
            h5rmgameitems.splice(0);
            h5xygameitems.splice(0);
            h5phgameitems.splice(0);
            var dat: GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            var h5games: GAMECENTER.H5APPINFO[] = dat.applist;
            for (var i = 0; i < h5games.length; i++) {
                var hs: GAMECENTER.H5APPINFO = h5games[i];
                if (hs.ishot == 1 && !!hs.ico) {//如果热门则添加到热门列表上
                    lisHotGame.push(hs);
                }
                if (!!hs.ico) {//如果新游则添加到新游列表上
                    lisNewGame.push(hs);
                }
                if (hs.rank != null && !!hs.ico) {
                    lisRankGame.push(hs);
                }
            }
            AddH5GameToList(0, Math.min(lisHotGame.length, 10), "HOT");
            AddH5GameToList(0, Math.min(lisNewGame.length, 10), "NEW");
            AddH5GameToList(0, Math.min(lisRankGame.length, 10), "RANK");
            if (lisHotGame.length <= 10) {
                $("#rmorepkgame").hide();
            }
            if (lisNewGame.length <= 10) {
                $("#xmorepkgame").hide(); .3
            }
            if (lisRankGame.length <= 10) {
                $("#pmorepkgame").hide();
            }
        });
    }
    //添加游戏数据到列表，start:开始索引，count:添加数量
    function AddH5GameToList(start: number, count: number, flag: string) {
        var today = new Date();
        for (var i = start; i < start + count; i++) {
            var tjImage = document.createElement("i");//推荐图标生成
            var giftImage = document.createElement("i");//礼包图标生成
            var newImage: HTMLImageElement = document.createElement("img");//新游tag
            tjImage.textContent = "推荐";
            giftImage.textContent = "礼包";
            tjImage.setAttribute("class", "tagtj");
            giftImage.setAttribute("class", "taggb");
            newImage.setAttribute("src", "../style/img/index/gameTag.png");
            newImage.setAttribute("class", "gameTag");
            if ("HOT" == flag) {//热游数据填充
                var appinfo: GAMECENTER.H5APPINFO = lisHotGame[i];
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
                        utils.setStorage("appid", data.id.toString(), "sessionStorage");
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                    $(items).find("#gameheadshot").attr("src", appinfo.ico).attr("title", appinfo.name).click(ev => {
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                })(appinfo);
                items.style.display = "";
                h5rmgamelist.appendChild(items);
                h5rmgameitems.push(items);
            }
            if ("NEW" == flag) {//新游数据填充
                lisNewGame.sort((firstEle, nextEle) => {//根据玩游戏设定好顺序进行排序
                    return nextEle.newsort - firstEle.newsort;
                });
                var appinfo: GAMECENTER.H5APPINFO = lisNewGame[i];
                var items: HTMLLIElement = <any>h5gameitem.cloneNode(true);
                $(items).find("#name").text(appinfo.name);
                $(items).find("#detail").text(appinfo.detail).attr("title", appinfo.detail);
                $(items).find("#gamepeople").text(appinfo.playcount);
                if (appinfo.isrec == 1) {
                    $(items).find("#gameName").append(tjImage);
                }
                if (appinfo.hasgift == 1) {
                    $(items).find("#gameName").append(giftImage);
                }
                (function fun(data: GAMECENTER.H5APPINFO) {
                    $(items).find("#btn").click(ev => {
                        utils.setStorage("appid", data.id.toString(), "sessionStorage");
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                    $(items).find("#gameheadshot").attr("src", appinfo.ico).attr("title", appinfo.name).click(ev => {
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                })(appinfo);
                items.style.display = "";
                h5xygamelist.appendChild(items);
                h5xygameitems.push(items);
            }
            if ("RANK" == flag) {//排行数据填充
                lisRankGame.sort((firstEle, nextEle) => {//根据玩游戏设定好顺序进行排序
                    if (firstEle.rank > nextEle.rank) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                var appinfo: GAMECENTER.H5APPINFO = lisRankGame[i];
                var items: HTMLLIElement = <any>h5phgameitem.cloneNode(true);
                $(items).find("#name").text(appinfo.name);
                $(items).find("#detail").text(appinfo.detail).attr("title", appinfo.detail);
                $(items).find("#gamepeople").text(appinfo.playcount);
                if (appinfo.isrec == 1) {
                    $(items).find("#gameName").append(tjImage);
                }
                if (appinfo.hasgift == 1) {
                    $(items).find("#gameName").append(giftImage);
                }
                (function fun(data: GAMECENTER.H5APPINFO) {
                    $(items).find("#btn").click(ev => {
                        utils.setStorage("appid", data.id.toString(), "sessionStorage");
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                    $(items).find("#gameheadshot").attr("src", appinfo.ico).attr("title", appinfo.name).click(ev => {
                        if (utils.getCookie("GSUSERINFO")) {
                            utils.setStorage("session", "&session=" + utils.getCookie("GSUSERINFO").session, "sessionStorage");
                        }
                        if ((window.parent == window) || (window.parent.location.href.indexOf("gameCenter.html") >= 0)) {
                            if (utils.isMobileBrowser()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }
                        } else {
                            if (utils.isMobileBrowser()) {
                                window.parent.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            } else {
                                window.parent.location.href = "../../gamepage.html#" + data.id;
                                setTimeout(() => { window.parent.location.reload(); }, 500);
                            }
                        }
                    });
                })(appinfo);
                switch (i) {
                    case 0:
                        $(items).find("#gameLv").find("img").attr("src", "../style/img/index/gameLv1.png");
                        break;
                    case 1:
                        $(items).find("#gameLv").find("img").attr("src", "../style/img/index/gameLv2.png");
                        break;
                    case 2:
                        $(items).find("#gameLv").find("img").attr("src", "../style/img/index/gameLv3.png");
                        break;
                    default:
                        $(items).find("#gameLv").first().attr("style", "padding-top:30px").text("TOP" + (i + 1));
                        break;
                }
                items.style.display = "";
                h5phgamelist.appendChild(items);
                h5phgameitems.push(items);
            }
        }
    }


    var openinglist: HTMLUListElement = <any>document.getElementById("opening");
    var openingitem: HTMLLIElement = <any>openinglist.firstElementChild;
    var openingitems: HTMLLIElement[] = [];
    var wait_openlist: HTMLUListElement = <any>document.getElementById("wait_open");
    var wait_openitem: HTMLLIElement = <any>wait_openlist.firstElementChild;
    var wait_openitems: HTMLLIElement[] = [];
    export function loadServerTable() {
        var para: GAMECENTER.GSGETSERVERTABLEREQ = new GAMECENTER.GSGETSERVERTABLEREQ();
        var now = new Date().getTime();
        GAMECENTER.gsGetServerTable(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            openingitem.style.display = "none";
            wait_openitem.style.display = "none";
            var stlist: GAMECENTER.GSSERVERTABLEINFO[] = resp.data;
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
                var dat: GAMECENTER.GSSERVERTABLEINFO = stlist[i];
                var item = null;
                if (dat.openTime <= now) {
                    if (new Date(dat.openTime).toLocaleDateString() == new Date().toLocaleDateString()) {
                        item = HTMLLIElement = <any>openingitem.cloneNode(true);
                        $(item).find("#gameName").text(dat.appname);
                        $(item).find("#game_mess").text(dat.serverName);
                        $(item).find("#gameheadshot").attr("src", dat.ico);
                        var arr = (new Date(dat.openTime).toLocaleString()).split(" ");
                        $(item).find("#opentime").text(arr[1] + "开服");
                        $(item).find("#btn").click(function () {
                            window.location.href = "http://5wanpk.com/open/h5game2.html#" + dat.gameid;
                        })
                        item.style.display = "";
                        openinglist.appendChild(item);
                        openingitems.push(item);
                    }
                }
                if (dat.openTime > now) {
                    var now_new = new Date();
                    now_new.setDate(now_new.getDate() + 1);
                    //alert(new Date(dat.openTime).toLocaleDateString());
                    //alert(new Date((new Date().setDate(new Date().getDate() +2))).toLocaleDateString());
                    if (new Date(dat.openTime).toLocaleDateString() < new Date((new Date().setDate(new Date().getDate() + 3))).toLocaleDateString()) {
                        item = HTMLLIElement = <any>wait_openitem.cloneNode(true);
                        $(item).find("#gameName").text(dat.appname);
                        $(item).find("#save_gameid").attr("title", dat.gameid);
                        $(item).find("#game_mess").text(dat.serverName);
                        $(item).find("#gameheadshot").attr("src", dat.ico);
                        $(item).find("#opentime").text(new Date(dat.openTime).toLocaleString() + "开服");
                        item.style.display = "";
                        wait_openlist.appendChild(item);
                        wait_openitems.push(item);
                    }
                }
            }
        });
    }

    //更多游戏
    export function onMorePkGame(flag) {//通过flag判断是来自哪个按钮的点击事件，并作对应处理
        if (flag == "NEW") {
            var count = lisNewGame.length - h5xygameitems.length;
            if (count <= 0) return;
            AddH5GameToList(h5xygameitems.length, count, "NEW");
            $("#xmorepkgame").hide();
        } else if (flag == "HOT") {
            var count = lisHotGame.length - h5rmgameitems.length;
            if (count <= 0) return;
            AddH5GameToList(h5rmgameitems.length, count, "HOT");
            $("#rmorepkgame").hide();
        } else if (flag == "RANK") {
            var count = lisRankGame.length - h5phgameitems.length;
            if (count <= 0) return;
            AddH5GameToList(h5phgameitems.length, count, "RANK");
            $("#pmorepkgame").hide();
        } else {
            utils.dialogBox("unknown error");
        }
    }
}