$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if ((this.parent == this) || (utils.isMobileBrowser())) {
            if (userinfo == null) {
                alert("尚未登入，请先登入");
                window.location.href = "loginIndex.html"
            } else {
                GAMECENTERPAGE.ShowBannerData();
                GAMECENTERPAGE.ShowHtml5GameList();
            }
        } else {
            GAMECENTERPAGE.ShowBannerData();
            GAMECENTERPAGE.ShowHtml5GameList();
        }
    });
});
module GAMECENTERPAGE {//游戏中心模块
    var url;
    var muigroup = $(".mui-slider-group.mui-slider-loop");
    var muiindicator = $(".mui-slider-indicator.mui-text-center");
    export function ShowBannerData() {
        GAMECENTER.gsUserGetBannerData({}, resp => {//获取banner数据
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            muiindicator.find("*").remove();//移除指示点元素内容
            muigroup.find("*").remove();//移除banner项元素内容
            var ads: ActivityADEntity.ActivityAD[] = resp.data.activityad;
            //var bannerdata = utils.getStorage("bannerdata" , "sessionStorage");
            //if (bannerdata == null) {//判断sessionStorage是否为空，不为空取本地
            //    utils.setStorage("bannerdata", resp.data.activityad, "sessionStorage");
            //    ads = resp.data.activityad;
            //} else {
            //    ads = bannerdata;
            //}
            var noRecList: ActivityADEntity.ActivityAD[] = [], recList: ActivityADEntity.ActivityAD[] = [];//noRecList非推荐广告列表，recList推荐广告列表
            for (var divide = 0; divide < ads.length; divide++) {
                if (ads[divide].isrec == 0) {
                    noRecList.push(ads[divide]);
                } else {
                    recList.push(ads[divide]);
                }
            }
            //utils.setStorage("reclist", recList, "sessionStorage");//在这里存入sessionStorage，用于推荐广告列表使用的（recommend页里）
            var ad: ActivityADEntity.ActivityAD[] = noRecList;
            var adItem: HTMLDivElement = document.createElement("div");
            var link: HTMLLinkElement = <any>document.createElement("a");
            var img: HTMLImageElement = document.createElement("img");
            img.src = ad[ad.length - 1].img;
            img.setAttribute("style", "width:100%;height:400px");//动态生成图片属性
            link.appendChild(img);
            adItem.setAttribute("class", "mui-slider-item mui-slider-item-duplicate");
            adItem.appendChild(link);
            muigroup.append(adItem);
            for (var i = 0; i < ad.length; i++) {
                var indicatorPoint: HTMLDivElement = document.createElement("div");
                var adItem: HTMLDivElement = document.createElement("div");
                var link: HTMLLinkElement = <any>document.createElement("a");
                var img: HTMLImageElement = document.createElement("img");
                if (ad[i].type == 1) {//H5游戏
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                    };
                    url = "../../gamepage.html#" + ad[i].url;
                } else {
                    url = ad[i].url;
                }
                link.href = url;
                img.src = ad[i].img;
                img.setAttribute("style", "width:100%;height:400px");
                link.appendChild(img);
                if (i == 0) {
                    indicatorPoint.setAttribute("class", "mui-indicator mui-active");
                    adItem.setAttribute("class", "mui-slider-item mui-active");
                } else {
                    adItem.setAttribute("class", "mui-slider-item");
                    indicatorPoint.setAttribute("class", "mui-indicator");
                }
                muiindicator.append(indicatorPoint);
                adItem.appendChild(link);
                muigroup.append(adItem);
            }
            var adItem: HTMLDivElement = document.createElement("div");
            var link: HTMLLinkElement = <any>document.createElement("a");
            var img: HTMLImageElement = document.createElement("img");
            img.src = ad[0].img;
            img.setAttribute("style", "width:100%;height:400px");
            link.appendChild(img);
            adItem.setAttribute("class", "mui-slider-item mui-slider-item-duplicate");
            adItem.appendChild(link);
            muigroup.append(adItem);
        })
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
    export function ShowHtml5GameList() {
        h5gameitem.style.display = "none";
        h5phgameitem.style.display = "none";
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {//获取H5游戏相关列表
            if (resp.errno != 0) {
                alert(resp.message);
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
                if (hs.ishot == 1 ) {//如果热门则添加到热门列表上
                    lisHotGame.push(hs);
                }
                if (hs.ico!=""&&hs.ico!=null) {//如果新游则添加到新游列表上
                    lisNewGame.push(hs);
                }
                if (hs.rank != null) {
                    lisRankGame.push(hs);
                }
            }
            AddH5GameToList(0, Math.min(lisHotGame.length, 10), "HOT");
            if (lisHotGame.length <= 10) {
                $("#rmorepkgame").hide();
            }
            AddH5GameToList(0, Math.min(lisNewGame.length, 10), "NEW");
            if (lisNewGame.length <= 10) {
                $("#xmorepkgame").hide();
            }
            AddH5GameToList(0, Math.min(lisRankGame.length, 10), "RANK");
            if (lisRankGame.length <= 10) {
                $("#pmorepkgame").hide();
            }
        });
    }

    //添加游戏数据到列表，start:开始索引，count:添加数量
    function AddH5GameToList(start: number, count: number, flag: string) {
        var today = new Date();
        for (var i = start; i < start + count; i++) {
            var tjImage: HTMLImageElement = document.createElement("img");//推荐图标生成
            var giftImage: HTMLImageElement = document.createElement("img");//礼包图标生成
            tjImage.setAttribute("src", "../style/img/游戏信息/推荐图标.png");
            tjImage.setAttribute("class", "gamecenter_content_tuijain");
            giftImage.setAttribute("src", "../style/img/游戏信息/礼包图标.png");
            giftImage.setAttribute("class", "gamecenter_content_libao");
            if ("NEW" == flag) {//新游数据填充
                lisNewGame.sort((firstEle, nextEle) => {//根据玩游戏设定好顺序进行排序
                    if (firstEle.createtime <= nextEle.createtime) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                var appinfo: GAMECENTER.H5APPINFO = lisNewGame[i];
                var items: HTMLLIElement = <any>h5gameitem.cloneNode(true);
                items.querySelector(".gamecenter_content_left_img")["src"] = appinfo.ico;
                items.querySelector(".gamecenter_content_title").textContent = appinfo.name;
                items.querySelector(".gamecenter_content_people").textContent = appinfo.playcount.toString();
                items.querySelector(".gamecenter_content_info").textContent = utils.DotString(appinfo.detail, 30);
                items.querySelector(".gamecenter_content_info")["title"] = appinfo.detail;
                items.querySelector("#redTape").setAttribute("style", "display:none");
                if (appinfo.isrec == 1) {
                    items.querySelector(".gamecenter_content_title").appendChild(tjImage);
                }
                if (appinfo.hasgift == 1) {
                    items.querySelector(".gamecenter_content_title").appendChild(giftImage);
                }
                (function fun(data: GAMECENTER.H5APPINFO) {
                    $(items).find(".gamecenter_content_left_img").click(ev => {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        window.location.href = "../../gamepage.html#" + data.id;
                    });
                    $(items).find(".gamecenter_content_playing_img").click(ev => {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        window.location.href = "../../gamepage.html#" + data.id;
                    });
                })(appinfo);
                items.style.display = "";
                h5xygamelist.appendChild(items);
                h5xygameitems.push(items);
            }
            if ("HOT" == flag) {//热游数据填充
                var appinfo: GAMECENTER.H5APPINFO = lisHotGame[i];
                var items: HTMLLIElement = <any>h5gameitem.cloneNode(true);
                items.querySelector(".gamecenter_content_left_img")["src"] = appinfo.ico;
                items.querySelector(".gamecenter_content_title").textContent = appinfo.name;
                items.querySelector(".gamecenter_content_people").textContent = appinfo.playcount.toString();
                items.querySelector(".gamecenter_content_info").textContent = utils.DotString(appinfo.detail, 30);
                items.querySelector(".gamecenter_content_info")["title"] = appinfo.detail;
                items.querySelector("#redTape").setAttribute("style", "display:none");
                if (appinfo.isrec == 1) {
                    items.querySelector(".gamecenter_content_title").appendChild(tjImage);
                }
                if (appinfo.hasgift == 1) {
                    items.querySelector(".gamecenter_content_title").appendChild(giftImage);
                }
                (function fun(data: GAMECENTER.H5APPINFO) {
                    $(items).find(".gamecenter_content_left_img").click(ev => {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        window.location.href = "../../gamepage.html#" + data.id;
                    });
                    $(items).find(".gamecenter_content_playing_img").click(ev => {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        window.location.href = "../../gamepage.html#" + data.id;
                    });
                })(appinfo);
                items.style.display = "";
                h5rmgamelist.appendChild(items);
                h5rmgameitems.push(items);
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
                var rank = items.querySelector(".gamecenter_content_phflags");
                items.querySelector(".gamecenter_content_left_img")["src"] = appinfo.ico;
                items.querySelector(".gamecenter_content_title").textContent = appinfo.name;
                items.querySelector(".gamecenter_content_info").textContent = utils.DotString(appinfo.detail, 30);
                items.querySelector(".gamecenter_content_info")["title"] = appinfo.detail;
                switch (i) {
                    case 0:
                        rank.firstElementChild.setAttribute("src", "../style/img/平台中心，排行榜/名次 icon.png");
                        break;
                    case 1:
                        rank.firstElementChild.setAttribute("src", "../style/img/平台中心，排行榜/名次 icon 2.png");
                        break;
                    case 2:
                        rank.firstElementChild.setAttribute("src", "../style/img/平台中心，排行榜/名次 icon 3.png");
                        break;
                    default:
                        rank["style"]["padding-top"] = "45px";//排行为数字是往下偏移一些
                        rank["style"]["font-size"] = "42px"
                        rank.textContent = "TOP" + (i + 1);
                        break;
                }
                var apptime = new Date(appinfo.createtime);
                if (appinfo.isrec == 1) {
                    items.querySelector(".gamecenter_content_title").appendChild(tjImage);
                }
                if (appinfo.hasgift == 1) {
                    items.querySelector(".gamecenter_content_title").appendChild(giftImage);
                }
                (function fun(data: GAMECENTER.H5APPINFO) {
                    $(items).find(".gamecenter_content_playing_img").click(ev => {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        window.location.href = "../../gamepage.html#" + data.id;
                    });
                    $(items).find(".gamecenter_content_left_img").click(ev => {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        window.location.href = "../../gamepage.html#" + data.id;
                    });
                })(appinfo);
                items.style.display = "";
                h5phgamelist.appendChild(items);
                h5phgameitems.push(items);
            }
        }
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
            alert("unknown error");
        }
    }
}