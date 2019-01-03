declare var wx, Swiper;

window.addEventListener("message", (e) => {
    if (!!e.data) {
        var para = new GAMECENTER.GSUSERLOGINREQ();
        para.loginid = e.data.loginid;
        para.pwd = e.data.pwd;
        GAMECENTER.gsUserLogin_old(para, resp => {
            var dat: GAMECENTER.GSUSERLOGINRESP = resp.data;
            GAMECENTER.userinfo = dat.userinfo;
            GAMECENTER.SaveUserInfo();
            parent.window.frames["rightFrame"].location.href = "http://5wanpk.com/h5_old"
        });
    }
})

$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "login.html";
            });
            return;
        }

        if (!!utils.getExpiresCookies("loginFlags")) {

        } else {
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
module INDEX_SECOND {
    var rpgame: HTMLDivElement;
    export function loadDefaultData(userinfo) {
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


    /***********************获取推荐的游戏*******************************/

    export function getTjGame() {
        var tjgame: HTMLDivElement = <any>document.getElementById("tj_game_list");
        var para: GAMECENTER.GETACTIVEREQ = new GAMECENTER.GETACTIVEREQ();
        GAMECENTER.getTjGameList(para,resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var tjgamelist: GAMECENTER.H5APPINFO[] = resp.data;
            for (var i = 0; i < tjgamelist.length; i++) {
                var item: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var appinfo: GAMECENTER.H5APPINFO = tjgamelist[i];
                (function fun(data: GAMECENTER.H5APPINFO) {
                    link.onclick = function () {
                        //utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");

                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
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
                loop:true,
                spaceBetween: 10
            });
        })
    }
    /***************************加载热门游戏列表**********************************/



    export function loadHotGameList() {

        var top_hot: GAMECENTER.HOTGAMELISTINFO[] = [];
        var bottom_hot: GAMECENTER.HOTGAMELISTINFO[] = [];
        var tophotlist: HTMLUListElement = <any>document.getElementById("hotgame_top");
        var tophotitem: HTMLLIElement = <any>tophotlist.firstElementChild;
        var tophotitems: HTMLLIElement[] = [];

        var bottomhotlist: HTMLUListElement = <any>document.getElementById("hotgame_bottom");
        var bottomhotitem: HTMLLIElement = <any>bottomhotlist.firstElementChild;
        var bottomhotitems: HTMLLIElement[] = [];
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
        var para: GAMECENTER.HOTGAMELISTINFO = new GAMECENTER.HOTGAMELISTINFO();
        GAMECENTER.getHotGameList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.HOTGAMELISTINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 'top') {
                    top_hot.push(data[i]);
                } else {
                    bottom_hot.push(data[i]);
                }
            }
            for (var i = 0; i < top_hot.length; i++) {
                var tophotinfo: GAMECENTER.HOTGAMELISTINFO = top_hot[i];
                var topitem: HTMLLIElement = <any>tophotitem.cloneNode(true);
                $(topitem).find("#top_img").attr("src", tophotinfo.img);

                if (tophotinfo.gamename.length > 6) {
                    $(topitem).find("#top_gamename").text((tophotinfo.gamename).substr(0,6));
                } else {
                    $(topitem).find("#top_gamename").text(tophotinfo.gamename);
                }

                
                (function fun(mdata: GAMECENTER.HOTGAMELISTINFO) {
                    $(topitem).find("#top_startgame").click(function () {

                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + mdata.appid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
                            window.location.href = "../../gamepage.html#" + mdata.appid;
                        }

                       
                    })
                    $(topitem).find(".gift_bag").click(function () {
                        switch ($(this).parent().index()) {
                            case 1:
                                countBanner('top1', mdata.appid);
                                break;
                            case 2:
                                countBanner('top2', mdata.appid); break;
                            case 3:
                                countBanner('top3', mdata.appid); break;
                            default:
                                countBanner('top4', mdata.appid);
                        }
                        //window.location.href = 'gameDetail.html?gameid=' + mdata.appid;
                    })
                })(tophotinfo)
                topitem.style.display = "";
                tophotlist.appendChild(topitem);
                tophotitems.push(topitem);
            }

            for (var i = 0; i < bottom_hot.length; i++) {
                var bottomhotinfo: GAMECENTER.HOTGAMELISTINFO = bottom_hot[i];
                var bottomitem: HTMLLIElement = <any>bottomhotitem.cloneNode(true);
                $(bottomitem).find("#bottom_img").attr("src", bottomhotinfo.img);

                if (bottomhotinfo.gamename.length > 6) {
                    $(bottomitem).find("#bottom_gamename").text((bottomhotinfo.gamename).substr(0,6));
                } else {
                    $(bottomitem).find("#bottom_gamename").text(bottomhotinfo.gamename);
                }

                
                (function fun(mdata: GAMECENTER.HOTGAMELISTINFO) {
                    $(bottomitem).find("#bottom_startgame").click(function () {


                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + mdata.appid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
                            window.location.href = "../../gamepage.html#" + mdata.appid;
                        }

                        
                    })
                    $(bottomitem).find(".gift_bag").click(function () {

                        switch ($(this).parent().index()) {
                            case 0:
                                countBanner('bottom1', mdata.appid); break;
                            case 1:
                                countBanner('bottom2', mdata.appid); break;
                            case 2:
                                countBanner('bottom3', mdata.appid); break;
                            default:
                                countBanner('bottom4', mdata.appid);
                        }
                        //window.location.href = 'gameDetail.html?gameid=' + mdata.appid;
                    })
                })(bottomhotinfo)

                bottomhotitem.style.display = "";
                bottomhotlist.appendChild(bottomitem);
                bottomhotitems.push(bottomitem);
            }
        })
    }

    /*********************加载玩过的游戏************************/
    export function ShowRecentPlay() {
        rpgame = <any>document.getElementById("swiper-wrapper");
        var guicon: HTMLImageElement = <any>document.getElementById("head_img");
        guicon.src = GAMECENTER.userinfo.headico;
        var para: H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ = new H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ();
        para.userid = GAMECENTER.userinfo.userid;
        GAMECENTER.getRecentPlayH5AppList(para, resp => {//获取所有玩过的游戏列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var h5gameRPlist: GAMECENTER.H5APPINFO[] = resp.data;
            utils.setStorage("h5rps", resp.data, "sessionStorage");
            for (var i = 0; i < h5gameRPlist.length; i++) {
                var item: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var appinfo: GAMECENTER.H5APPINFO = h5gameRPlist[i];
                (function fun(data: GAMECENTER.H5APPINFO) {
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");

                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
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
                autoplay:2000,
                paginationClickable: true,
                grabCursor: true,
                spaceBetween: 10
            });
        });
    }
    

    /*********************加载Banner图************************/

    export function loadBanner() {
        var url;
        var banner: HTMLDivElement = <any>document.getElementById("top_banner");
        GAMECENTER.gsUserGetBannerData({}, resp => {//获取banner数据
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var ads: GAMECENTER.ACTIVITYAD[];
            var bannerdata = utils.getStorage("bannerdata", "sessionStorage");
            if (bannerdata == null) {//判断sessionStorage是否为空，不为空取本地
                utils.setStorage("bannerdata", resp.data.activityad, "sessionStorage");
                ads = resp.data.activityad;
            } else {
                ads = bannerdata;
            }
            for (var i = 0; i < ads.length; i++) {
                var adItem: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var bannerinfo: GAMECENTER.ACTIVITYAD = ads[i];
                (function fun(data: GAMECENTER.ACTIVITYAD) {
                    if (bannerinfo.type == 1) {//H5游戏
                        link.onclick = function () {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        };
                        if (isSafari()) {
                            url = "../../gamepage.html#" + data.url + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
                            url = "../../gamepage.html#" + data.url;
                        }
                    } else {

                        if (isSafari()) {
                            url = "../../gamepage.html#" + data.url + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
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
                        countBanner('banner1', null); break;
                    case 2:
                        countBanner('banner2', null); break;
                    case 3:
                        countBanner('banner3', null); break;
                    case 4:
                        countBanner('banner4', null); break;
                    case 5:
                        countBanner('banner5', null); break;
                }

            })


            var swiper = new Swiper('.banner', {
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 3000,
                loop:true,
                autoplayDisableOnInteraction: false
            });
        });
    }


    /************************************列取不同类型的游戏**************************************************/
    var pc = IsPC();
    var xianxia: GAMECENTER.H5APPINFO[] = [];//仙侠游戏
    var juqing: GAMECENTER.H5APPINFO[] = [];//剧情游戏
    var xiuxian: GAMECENTER.H5APPINFO[] = [];//休闲游戏
    var celue: GAMECENTER.H5APPINFO[] = [];//策略游戏
    var moni: GAMECENTER.H5APPINFO[] = [];//模拟游戏
    var all: GAMECENTER.H5APPINFO[] = [];//所有游戏
    export function loadGameData() {//加载游戏列表数据
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {//获取H5游戏相关列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            var h5games: GAMECENTER.H5APPINFO[] = dat.applist;
            for (var i = 0; i < h5games.length; i++) {
                var hs: GAMECENTER.H5APPINFO = h5games[i];
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


            var allgame_list: HTMLDivElement = <any>document.getElementById("all");
            for (var i = 0; i < h5games.length; i++) {//全部
                var item: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                var span: HTMLSpanElement = document.createElement("span");
                var appinfo: GAMECENTER.H5APPINFO = h5games[i];
                if (appinfo.ico != null && appinfo.ico != '') {
                    (function fun(data: GAMECENTER.H5APPINFO) {
                        link.onclick = function () {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");

                            if (isSafari()) {
                                window.location.href = "../../gamepage.html#" + data.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                            } else {
                                window.location.href = "../../gamepage.html#" + data.id;
                            }

                        };
                    })(appinfo);
                    img.src = appinfo.ico;

                    if (!!pc) {
                        span.textContent = (appinfo.name).substr(0, 6);
                        span.style.fontSize = '0.15rem';
                    } else {
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
    export function addgametolist() {
        var xianxia_list: HTMLDivElement = <any>document.getElementById("xian");
        var juqing_list: HTMLDivElement = <any>document.getElementById("ju");
        var xiuxian_list: HTMLDivElement = <any>document.getElementById("xiu");
        var celue_list: HTMLDivElement = <any>document.getElementById("ce");
        var moni_list: HTMLDivElement = <any>document.getElementById("mo");
        for (var i = 0; i < xianxia.length; i++) {
            //仙侠游戏
            var item: HTMLDivElement = document.createElement("div");
            var link: HTMLLinkElement = <any>document.createElement("a");
            var img: HTMLImageElement = document.createElement("img");
            var span: HTMLSpanElement = document.createElement("span");
            var appinfo: GAMECENTER.H5APPINFO = xianxia[i];
            (function fun(data1: GAMECENTER.H5APPINFO) {
                link.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");

                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data1.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    } else {
                        window.location.href = "../../gamepage.html#" + data1.id;
                    }

                    
                };
            })(appinfo);
            img.src = appinfo.ico;
            if (!!pc) {
                span.textContent = (appinfo.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            } else {
                span.textContent = (appinfo.name).substr(0, 4);
            }
            
            span.setAttribute("class","index_appname");
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
            var item_juqing: HTMLDivElement = document.createElement("div");
            var link_juqing: HTMLLinkElement = <any>document.createElement("a");
            var img_juqing: HTMLImageElement = document.createElement("img");
            var span: HTMLSpanElement = document.createElement("span");
            var appinfo_juqing: GAMECENTER.H5APPINFO = juqing[i];
            (function fun(data2: GAMECENTER.H5APPINFO) {
                link_juqing.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data2.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    } else {
                        window.location.href = "../../gamepage.html#" + data2.id;
                    }
                    
                };
            })(appinfo_juqing);
            img_juqing.src = appinfo_juqing.ico;

            if (!!pc) {
                span.textContent = (appinfo_juqing.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            } else {
                span.textContent = (appinfo_juqing.name).substr(0, 4);
            }

            
            img_juqing.setAttribute("class", "show_img");
            span.setAttribute("class","index_appname");
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
            var item_xiuxian: HTMLDivElement = document.createElement("div");
            var link_xiuxian: HTMLLinkElement = <any>document.createElement("a");
            var img_xiuxian: HTMLImageElement = document.createElement("img");
            var span: HTMLSpanElement = document.createElement("span");
            var appinfo_xiuxian: GAMECENTER.H5APPINFO = xiuxian[i];
            (function fun(data3: GAMECENTER.H5APPINFO) {
                link_xiuxian.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data3.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    } else {
                        window.location.href = "../../gamepage.html#" + data3.id;
                    }

                    
                };
            })(appinfo_xiuxian);
            img_xiuxian.src = appinfo_xiuxian.ico;

            if (!!pc) {
                span.textContent = (appinfo_xiuxian.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            } else {
                span.textContent = (appinfo_xiuxian.name).substr(0, 4);
            }

            
            span.setAttribute("class","index_appname");
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
            var item_celue: HTMLDivElement = document.createElement("div");
            var link_celue: HTMLLinkElement = <any>document.createElement("a");
            var img_celue: HTMLImageElement = document.createElement("img");
            var span: HTMLSpanElement = document.createElement("span");
            var appinfo_celue: GAMECENTER.H5APPINFO = celue[i];
            (function fun(data4: GAMECENTER.H5APPINFO) {
                link_celue.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");

                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data4.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    } else {
                        window.location.href = "../../gamepage.html#" + data4.id;
                    }

                    
                };
            })(appinfo_celue);
            img_celue.src = appinfo_celue.ico;

            if (!!pc) {
                span.textContent = (appinfo_celue.name).substr(0, 6);
                span.style.fontSize = '0.15rem';
            } else {
                span.textContent = (appinfo_celue.name).substr(0, 4);
            }

            
            span.setAttribute("class","index_appname");
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
            var item_moni: HTMLDivElement = document.createElement("div");
            var link_moni: HTMLLinkElement = <any>document.createElement("a");
            var img_moni: HTMLImageElement = document.createElement("img");
            var span: HTMLSpanElement = document.createElement("span");
            var appinfo_moni: GAMECENTER.H5APPINFO = moni[i];
            (function fun(data5: GAMECENTER.H5APPINFO) {
                link_moni.onclick = function () {
                    utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");

                    if (isSafari()) {
                        window.location.href = "../../gamepage.html#" + data5.id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                    } else {
                        window.location.href = "../../gamepage.html#" + data5.id;
                    }

                    
                };
            })(appinfo_moni);
            img_moni.src = appinfo_moni.ico;

            if (!!pc) {
                span.textContent = (appinfo_moni.name).substr(0,6);
                span.style.fontSize = '0.15rem';
            } else {
                span.textContent = (appinfo_moni.name).substr(0, 4);
            }

            
            img_moni.setAttribute("class", "show_img");
            span.setAttribute("class","index_appname");
            link_moni.appendChild(img_moni);
            link_moni.appendChild(span);
            item_moni.setAttribute("class", "swiper-slide img");
            item_moni.appendChild(link_moni);
            moni_list.appendChild(item_moni);

        }
        var swiper2 = new Swiper('.banner_moni', {
            pagination: '.swiper-pagination',
            slidesPerView:5,
            paginationClickable: true,
            spaceBetween: 10
        });
    }

    /***************************获取首页两个广告banner*****************************/
    export function loadTwoBanner() {
        var para: ADMIN.ACTIVITYINFO = new ADMIN.ACTIVITYINFO();
        ADMIN.getAdBannerlist(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.ADBANNERINFO[] = resp.data;
            $("#index_banner1").attr("src", data[0].banner);
            $("#index_banner2").attr("src", data[1].banner);
            $("#index_banner1").click(function () {
                window.location.href = 'gameDetail.html?gameid=' + data[0].gameid;
            })
            $("#index_banner2").click(function () {
                window.location.href = 'gameDetail.html?gameid=' + data[1].gameid;
            })
        })
    }


    /******************************列取活动banner*********************************/
    var showgamelist: HTMLUListElement = <any>document.getElementById("show_tjgame_all");
    var showgameitem: HTMLLIElement = <any>showgamelist.firstElementChild;
    var showgameitems: HTMLLIElement[] = [];
    export function loadShowTjgame() {
        var para: GAMECENTER.GAMETYPEREQ = new GAMECENTER.GAMETYPEREQ();
        GAMECENTER.gsGetshowgamelist(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            showgameitem.style.display = "none";
            for (var i = 0; i < showgameitems.length; i++) {
                showgamelist.removeChild(showgameitem[i]);
            }
            showgameitems.splice(0);
            var stlist: GAMECENTER.APPINFO[] = resp.data;
            for (var i = 0; i < stlist.length; i++) {
                var data: GAMECENTER.APPINFO = stlist[i];
                var item = HTMLLIElement = <any>showgameitem.cloneNode(true);
                $(item).find("#show_img_banner").attr("src", data.ico);
                $(item).find("#show_game_name").text(data.appname);
                $(item).find("#show_gamedetail").text(data.intro);
                $(item).find("#game_play_count").text(data.count);
                (function fun(appinfo: GAMECENTER.APPINFO) {
                    $(item).find("#show_game_btn").click(ev => {

                        if (isSafari()) {
                            window.location.href = '../../gamepage.html#' + appinfo.Id + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
                            window.location.href = '../../gamepage.html#' + appinfo.Id;
                        }

                        
                    });
                    $(item).find("#show_img_banner").click(ev => {
                        window.location.href = 'gameDetail.html?gameid=' + appinfo.Id;
                    });
                    $(item).find("#gift_ico").click(ev => {
                        window.location.href = 'gameDetail.html?gameid=' + appinfo.Id;
                    })
                })(data);
                item.style.display = "";
                showgamelist.appendChild(item);
                showgameitems.push(item);

            }
        })
    }
    /************************************列取游戏结束**************************************************/



    /*************开服表数据展示***************/

    var openinglist: HTMLUListElement = <any>document.getElementById("opening_table");
    var openingitem: HTMLLIElement = <any>openinglist.firstElementChild;
    var openingitems: HTMLLIElement[] = [];
    var wait_openlist: HTMLUListElement = <any>document.getElementById("wait_opening_table");
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
                        $(item).find("#opentime").text(arr[1]);

                        (function fun(data: GAMECENTER.GSSERVERTABLEINFO) {
                            $(item).find("#table_getingame").click(function () {
                                window.location.href = "http://5wanpk.com/open/h5game2.html#" + data.gameid;
                            })
                        })(dat)

                        
                        item.style.display = "";
                        openinglist.appendChild(item);
                        openingitems.push(item);
                    }

                }
                if (dat.openTime > now) {
                    var now_new = new Date();
                    now_new.setDate(now_new.getDate() + 3);
                    if (new Date(dat.openTime).toLocaleDateString() < new Date((new Date().setDate(new Date().getDate() + 3))).toLocaleDateString()) {
                        item = HTMLLIElement = <any>wait_openitem.cloneNode(true);
                        $(item).find("#gameName_wite").text(dat.appname);
                        //$(item).find("#save_gameid").attr("title", dat.gameid);
                        $(item).find("#game_mess").text(dat.serverName);
                        $(item).find("#gameheadshot").attr("src", dat.ico);
                        var arr = (new Date(dat.openTime).toLocaleString()).split(" ");

                        (function fun(data: GAMECENTER.GSSERVERTABLEINFO) {
                            $(item).find("#table_getingame").click(function () {
                                window.location.href = "http://5wanpk.com/open/h5game2.html#" + data.gameid;
                            })
                        })(dat)

                        if (arr[0] == new Date().toLocaleDateString()) {
                            $(item).find("#opentime").text("今日 " + arr[1]);
                        } else {
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
    /*************开服表结束***************/


    /**********************************礼包列取********************************************/
    var newGift: GAMECENTER.GETALLGIFTTYPEINFONEW[] = [];//最新礼包
    var hotGift: GAMECENTER.GETALLGIFTTYPEINFONEW[] = [];//最热礼包
    var onlyGift: GAMECENTER.GETALLGIFTTYPEINFONEW[] = [];//独家礼包

    var newgiftlist: HTMLUListElement = <any>document.getElementById("new_gift");
    var newgiftitem: HTMLLIElement = <any>newgiftlist.firstElementChild;
    var newgiftitems: HTMLLIElement[] = [];

    var hotgiftlist : HTMLUListElement = <any>document.getElementById("hot_gift");
    var hotgiftitem: HTMLLIElement = <any>hotgiftlist.firstElementChild;
    var hotgiftitems: HTMLLIElement[] = [];

    var onlygiftlist: HTMLUListElement = <any>document.getElementById("only_gift");
    var onlygiftitem: HTMLLIElement = <any>onlygiftlist.firstElementChild;
    var onlygiftitems: HTMLLIElement[] = [];


    export function listGiftbagAll() {
        var para: GAMECENTER.GETALLGIFTTYPEREQNEW = new GAMECENTER.GETALLGIFTTYPEREQNEW();
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        GAMECENTER.getAllGiftList(para, resp => {
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
            var data: GAMECENTER.GETALLGIFTTYPEINFONEW[] = resp.data;
            fillType(data);
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            for (var i = 0; i < newGift.length; i++) {
                var newgiftinfo: GAMECENTER.GETALLGIFTTYPEINFONEW = newGift[i];
                var newitems = HTMLLIElement = <any>newgiftitem.cloneNode(true);
                var prent = parseInt(((newgiftinfo.total - newgiftinfo.remainder) / newgiftinfo.total * 100).toString());
                $(newitems).find("#newgift_ico").attr("src", newgiftinfo.ico);
                $(newitems).find("#newgift_appname").text(newgiftinfo.name);
                $(newitems).find("#newgift_name").text(newgiftinfo.giftname);
                $(newitems).find("#newgift_createtime").text(new Date(newgiftinfo.endtime).toLocaleDateString());
                $(newitems).find("#newgift_left").attr("max", newgiftinfo.total);
                $(newitems).find("#newgift_left").attr("value", newgiftinfo.total-newgiftinfo.remainder);
                $(newitems).find("#newgift_baifen").text(prent +"%");
                if (newgiftinfo.groupqq == '' || newgiftinfo.groupqq == null) {
                    $(newitems).find("#get_in_together").attr("src", '../img/game/giftbag/nomall.png');
                    if (newgiftinfo.loginid == null) {
                        $(newitems).find(".together_qq").text("领取");
                        $(newitems).find(".together_qq").css({ "color": "white", "background-color": "red", "border": "none" });
                    } else {
                        $(newitems).find(".together_qq").text("查看");
                    }
                }else{
                    $(newitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(newitems).find(".together_qq").text("加群");
                    $(newitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border": "2px solid #FA6828"
                    });
                }
                (function fun(data: GAMECENTER.GETALLGIFTTYPEINFONEW) {

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
                    })

                })(newgiftinfo)
                newitems.style.display = '';
                newgiftlist.appendChild(newitems);
                newgiftitems.push(newitems);
            }

            for (var i = 0; i < hotGift.length; i++) {
                var hotgiftinfo: GAMECENTER.GETALLGIFTTYPEINFONEW = hotGift[i];
                var hotitems = HTMLLIElement = <any>hotgiftitem.cloneNode(true);
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
                    } else {
                        $(hotitems).find(".together_qq").text("查看");
                    }
                }else{
                    $(hotitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(hotitems).find(".together_qq").text("加群");
                    $(hotitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border": "2px solid #FA6828"
                    });
                }
                (function fun(data: GAMECENTER.GETALLGIFTTYPEINFONEW) {
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
                    })


                })(hotgiftinfo)
                hotitems.style.display = '';
                hotgiftlist.appendChild(hotitems);
                hotgiftitems.push(hotitems);
            }
            for (var i = 0; i < onlyGift.length; i++) {
                var onlygiftinfo: GAMECENTER.GETALLGIFTTYPEINFONEW = onlyGift[i];
                var onlyitems = HTMLLIElement = <any>onlygiftitem.cloneNode(true);
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
                    } else {
                        $(onlyitems).find(".together_qq").text("查看");
                    }
                }else{
                    $(onlyitems).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                    $(onlyitems).find(".together_qq").text("加群");
                    $(onlyitems).find(".together_qq").css({
                        "color": "#FA6828",
                        "border":"2px solid #FA6828"
                    });
                }


                (function fun(data: GAMECENTER.GETALLGIFTTYPEINFONEW) {

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
                    })


                })(onlygiftinfo)
                onlyitems.style.display = '';
                onlygiftlist.appendChild(onlyitems);
                onlygiftitems.push(onlyitems);
            }
        })
    }


    export function getGiftCode(typeid, loginid, gameid, flags, doc) {//获取礼包码
        var para: GAMECENTER.GETCODEINFOREQ = new GAMECENTER.GETCODEINFOREQ();
        para.typeid = typeid;
        para.loginid = loginid;
        para.gameid = gameid;
        para.flags = flags;
        GAMECENTER.getGifiCode(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var codeinfo: GAMECENTER.GETGIFTCODEINFO = resp.data;
            if (!!codeinfo.code) {
                $("#one_code").text(codeinfo.code);
                $("#one_detail").text(codeinfo.instruction);
                $("#one_theway").text(codeinfo.useway);
                $("#zhezhao").css("display", "");
                doc.text("查看");
                doc.css({ "color": "skyblue", "background-color": "white", "border":"2px solid skyblue"});
            } else {
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
                } else {
                    window.location.href = "../../gamepage.html#" + resp.data.gameid;
                }

                
            });
        });
    }
    export function fillType(data: GAMECENTER.GETALLGIFTTYPEINFONEW[]) {
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
                    $("#list_all_new").css({ "transform": "rotate(0deg)" })
                    $("#new_gift").css({ "height": "4.3rem" })
                } else {
                    $("#new_gift").css("height", "auto");
                    $("#list_all_new").css({ "transform": "rotate(90deg)" })
                }
            })
        } else {
            $("#new_gift").css("height", "auto");
        }

        if (hotGift.length > 3) {
            var height = $("#hot_gift_li").height();
            $("#hot_gift").css({ "height": "4.3rem", "overflow": "hidden" });
            $("#list_all_hot").click(function () {
                if ($("#hot_gift").height() >= height * 3.5) {
                    $("#list_all_hot").css({ "transform": "rotate(0deg)" })
                    $("#hot_gift").css({ "height": "4.3rem" })
                } else {
                    $("#hot_gift").css("height", "auto");
                    $("#list_all_hot").css({ "transform": "rotate(90deg)" })
                }
            })
        } else {
            $("#hot_gift").css("height", "auto");
        }

        if (onlyGift.length > 3) {
            var height = $("#only_gift_li").height();
            $("#only_gift").css({ "height": "4.3rem", "overflow": "hidden" });
            $("#list_all_only").click(function () {
                if ($("#only_gift").height() >= height * 3.5) {
                    $("#list_all_only").css({ "transform": "rotate(0deg)" })
                    $("#only_gift").css({ "height": "4.3rem" })
                } else {
                    $("#only_gift").css("height", "auto");
                    $("#list_all_only").css({ "transform": "rotate(90deg)" })
                }
            })
        } else {
            $("#only_gift").css("height", "auto");
        }
    }
    /**********************************礼包界面结束********************************************/
    export function isSafari() {
        var ua = navigator.userAgent;
        var gbshare = document.querySelector("#gb-share");
        var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios
        var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (isiOS) {
            if (userAgent.indexOf("Safari") > -1) {
                return true;
            } else {
                return false;
            }
        }
    }


    /*************************************获取分类标题**********************************/
    export function loadTitleData() {
        var para: ADMIN.ACTIVITYINFO = new ADMIN.ACTIVITYINFO();
        ADMIN.getIndexTile(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: ADMIN.INDEXTITLEINFO[] = resp.data;
            $("#gametitle1").text(data[0].title);
            $("#gametitle2").text(data[1].title);
            $("#gametitle3").text(data[2].title);
            $("#gametitle4").text(data[3].title);
            $("#gametitle5").text(data[4].title);
        })
    }




    //微信分享
    var data: GAMECENTER.OPENAPPRESP;
    export function WXShare() {
        GAMECENTER.openShare("99999", resp => {//9999临时数据，为了函数执行
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            data = resp.data;
            InitWX();
        });
        function InitWX() {
            var wxinit: GAMECENTER.WXCONFIG = {
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端utils.dialogBox出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wxe983a05c52c5188f', // 必填，公众号的唯一标识
                timestamp: new Date().getTime().toString(), // 必填，生成签名的时间戳
                nonceStr: Math.floor(Math.random() * 100000000).toString(), // 必填，生成签名的随机串
                signature: '',// 必填，签名，见附录1
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            };
            var parainit = new GAMECENTER.GETWXCONFIGSIGNREQ();
            parainit.data = wxinit;
            parainit.url = window.location.href;
            GAMECENTER.getWXConfigSign(parainit, resp => {
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
                        title: (!!data.sharetext) ? data.sharetext : data.appname, // 分享标题
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQQ({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareWeibo({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
                        success: function () {
                            utils.dialogBox("分享成功");
                        },
                        cancel: function () {
                            utils.dialogBox("分享取消");
                        }
                    });
                    wx.onMenuShareQZone({
                        title: data.appname,// 分享标题
                        desc: data.sharetext, // 分享描述
                        link: encodeURI(window.location.href), // 分享链接
                        imgUrl: data.shareico, // 分享图标
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


    $("#window_banner").click(function () {
        if (isSafari()) {
            window.location.href = "../../gamepage.html#" + 451 + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
        } else {
            window.location.href = "../../gamepage.html#" + 451;
        }
    })




    export function IsPC() {
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


    /*********************图片banner位置点击统计***********************/
    export function countBanner(type,appid) {
        var para: GAMECENTER.COUNTBANNERREQ = new GAMECENTER.COUNTBANNERREQ();
        para.type = type;
        GAMECENTER.countBanner(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            if (!!appid) {
                window.location.href = 'gameDetail.html?gameid=' + appid;
            }
        })
    }




}