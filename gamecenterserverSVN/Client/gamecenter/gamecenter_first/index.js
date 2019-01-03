///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcindex.LoadData();
    });
});
var gcindex;
(function (gcindex) {
    var pkgameitem;
    var pkgamelist;
    var pkgameitems = [];
    var h5gamelist;
    var h5gameitem;
    var h5gameitems = [];
    var winpool;
    var shopbannernum;
    var pkapplist;
    //	var pkrecord: HTMLDivElement;
    //	var pkrecorditem: HTMLDivElement;
    //	var pkrecorditems: HTMLDivElement[] = [];
    var nologin;
    var activityad;
    var h5applist;
    function LoadData() {
        pkgameitem = document.getElementById("pkgameitem");
        pkgameitem.style.display = "none";
        pkgamelist = document.getElementById("pkgamelist");
        h5gamelist = document.getElementById("h5gamelist");
        h5gameitem = document.getElementById("h5gameitem");
        h5gameitem.style.display = "none";
        winpool = document.getElementById("winpool");
        shopbannernum = document.getElementById("shopbannernum");
        //		pkrecord = <any>document.getElementById("pkrecord");
        //		pkrecorditem = <any>document.getElementById("pkrecorditem");
        //		pkrecorditem.style.display = "none";
        activityad = document.getElementById("activityad");
        nologin = document.getElementById("nologin");
        ShowUserInfo();
        ShowBanner();
        //		ShowShopBannerNum();
        LoadPkGameList();
        LoadH5GameList();
    }
    gcindex.LoadData = LoadData;
    //显示账号
    function ShowUserInfo() {
        if (GAMECENTER.userinfo) {
            if (GAMECENTER.userinfo.phone) {
                nologin.src = "style/img/修改.png";
            }
            else {
                nologin.src = "style/img/未绑定.png";
            }
            document.getElementById("headico")["src"] = GAMECENTER.userinfo.headico;
            $("#nickname").text(GAMECENTER.userinfo.nickname);
            $("#usergold").text(GAMECENTER.userinfo.gold);
        }
        else {
            nologin.src = "style/img/未登录.png";
            $("#nickname").text("未登录");
            $("#usergold").text(0);
        }
    }
    //显示奖池数字/广告
    function ShowBanner() {
        /*		$(winpool).find("*").remove();
                for (var i = 0; i < pkrecorditems.length; i++) {
                    pkrecord.removeChild(pkrecorditems[i]);
                }
                pkrecorditems.splice(0);
        */
        GAMECENTER.gsUserGetBannerData({}, function (resp) {
            //			var oldnum = getCookie("totalAwardPool");
            var dat = resp.data;
            var num = utils.__prefix(8, dat.totalAwardPool);
            for (var i = 0; i < num.length; i++) {
                var n = parseInt(num.substr(i, 1));
                (function (i, n) {
                    var img = document.createElement("img");
                    img.src = "style/img/奖池金额  数字.png";
                    img.style.position = "absolute";
                    img.style.left = 5 + (i * 90) + "px";
                    img.style.top = "0px";
                    winpool.appendChild(img);
                    setTimeout(function () {
                        img.style.transitionProperty = "top";
                        img.style.transitionDuration = "2s";
                        img.style.top = -126 * n + "px";
                    }, 0);
                })(i, n);
            }
            var exchangeinfo = document.getElementById("exchangeinfo");
            var exchangeinfoitem = exchangeinfo.querySelector("#exchangeinfoitem");
            $("#exchangeinfo").find("*").remove();
            var transitions = {
                'transition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'MozTransition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
                'MsTransition': 'msTransitionEnd'
            };
            var tranend;
            for (var t in transitions) {
                if (exchangeinfo.style[t] !== undefined) {
                    tranend = transitions[t];
                    break;
                }
            }
            exchangeinfo.addEventListener(tranend, function (ev) {
                //将第一条移到最后一条
                var item = exchangeinfo.children[0];
                var top = parseInt(item.style.top);
                if (top >= 0)
                    return;
                item.style.display = "none";
                exchangeinfo.removeChild(item);
                exchangeinfo.appendChild(item);
                item.style.top = parseInt(exchangeinfo.children[exchangeinfo.children.length - 2]["style"].top) + exchangeinfo.clientHeight + "px";
            });
            if (dat.exchangeInfo.length > 0) {
                for (var i = 0; i < dat.exchangeInfo.length; i++) {
                    var info = dat.exchangeInfo[i];
                    if (!info.phone)
                        continue;
                    var phone = info.phone.substr(0, 4) + "****" + info.phone.substr(info.phone.length - 3);
                    var item = exchangeinfoitem.cloneNode(true);
                    item.innerText = "【5玩快报】  " + phone + "成功兑换" + info.goods;
                    item.style.top = exchangeinfo.clientHeight * i + "px";
                    exchangeinfo.appendChild(item);
                }
                //设置3秒滚动
                if (dat.exchangeInfo.length > 1) {
                    var exinfotimer = setInterval(function () {
                        var firstidx = 0;
                        for (var i = 0; i < exchangeinfo.children.length; i++) {
                            var item = exchangeinfo.children[i];
                            item.style.display = "";
                            var top = parseInt(item.style.top) - exchangeinfo.clientHeight;
                            item.style.top = top + "px";
                            if (top == 0)
                                firstidx = i;
                        }
                    }, 3000);
                }
            }
            //本周兑换 
            if (dat.weeklygoods) {
                $("#weeklygoodsimg").get(0)["src"] = dat.weeklygoods.img;
                ShowShopBannerNum(dat.weeklygoods.stock);
                $("#weeklygoodsgo").click(function (ev) {
                    window.location.href = "exchangegoods.shtml?id=" + dat.weeklygoods.goodsid;
                });
            }
            //显示XXX VS YYY 1000K币
            /*			for (var i = 0; i < dat.pkrecord.length; i++) {
                            var item: HTMLDivElement = <any>pkrecorditem.cloneNode(true);
                            item.style.display = "";
                            $(item).find("#pkuser1").text(dat.pkrecord[i].user1);
                            $(item).find("#pkuser2").text(dat.pkrecord[i].user2);
                            $(item).find("#pkgold").text(dat.pkrecord[i].gold + "K币");
                            pkrecord.appendChild(item);
                            pkrecorditems.push(item);
                        }
            
                        var rectimer=setInterval(() => {
                            pkrecord.scrollTop++;
                        },50);
            */
            //活动
            var flicking = activityad.querySelector("#flicking");
            var adul = activityad.querySelector("#adul");
            var aditem = activityad.querySelector("#aditem");
            $(flicking).find("*").remove();
            while (adul.children.length > 0)
                adul.removeChild(adul.lastChild);
            for (var i = 0; i < dat.activityad.length; i++) {
                var fli = document.createElement("a");
                fli.href = "javascript://";
                flicking.appendChild(fli);
                var liitem = aditem.cloneNode(true);
                liitem.style.display = "";
                $(liitem).find("img").get(0)["src"] = dat.activityad[i].img;
                (function (ad) {
                    liitem.onclick = function (ev) {
                        if (ad.type == 0) {
                            window.location.href = ad.url;
                        }
                        else if (ad.type == 1) {
                            if (GAMECENTER.userinfo) {
                                utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                            }
                            window.location.href = "../gamepage.html#" + ad.url;
                        }
                    };
                })(dat.activityad[i]);
                adul.appendChild(liitem);
            }
            SetAdEvent();
        });
    }
    //显示本周兑换广告上的数字
    function ShowShopBannerNum(count) {
        $(shopbannernum).find("*").remove();
        var num = utils.__prefix(2, count);
        for (var i = 0; i < num.length; i++) {
            var n = parseInt(num.substr(i, 1));
            (function (i) {
                utils.CreateNumberImg("style/img/兑换商城 数字.png", n.toString(), false, function (img, offsetx, offsety) {
                    img.style.left = 112 + (i * 75 - offsetx) + "px";
                    img.style.top = 4 + offsety + "px";
                    shopbannernum.appendChild(img);
                });
            })(i);
        }
    }
    //加载PK游戏列表
    function LoadPkGameList() {
        GAMECENTER.gsUserGetPkAppList({ id: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < pkgameitems.length; i++) {
                pkgamelist.removeChild(pkgameitems[i]);
            }
            pkgameitems.splice(0);
            var dat = resp.data;
            pkapplist = dat.applist;
            AddPkGameToList(0, Math.min(pkapplist.length, 4));
            if (pkapplist.length <= 4) {
                $("#morepkgame").hide();
            }
        });
    }
    //加载联运H5游戏列表 
    function LoadH5GameList() {
        GAMECENTER.gsUserGetH5AppList({ id: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < h5gameitems.length; i++) {
                h5gamelist.removeChild(h5gameitems[i]);
            }
            h5gameitems.splice(0);
            var dat = GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            h5applist = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var item = h5gameitem.cloneNode(true);
                item.style.display = "";
                var data = h5applist[i];
                item.querySelector("#gameico")["src"] = data.ico;
                if (data.getgold == 0)
                    $(item).find("#getgoldbg").hide();
                else
                    $(item).find("#getgold").text("首送" + data.getgold + "K币");
                item.querySelector("#appname").textContent = data.name;
                item.querySelector("#playcount").textContent = data.playcount.toString();
                item.querySelector("#detail").textContent = data.detail;
                (function (data) {
                    item.querySelector("#btnplay")["onclick"] = function (ev) {
                        if (GAMECENTER.userinfo) {
                            utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");
                        }
                        window.location.href = "../gamepage.html#" + data.id;
                    };
                })(data);
                h5gamelist.appendChild(item);
                h5gameitems.push(item);
            }
        });
    }
    function DotString(str, maxlen) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255)
                len += 2;
            else
                len++;
            if (len > maxlen) {
                return str.substr(0, i) + "...";
            }
        }
        return str;
    }
    //添加游戏数据到列表，start:开始索引，count:添加数量
    function AddPkGameToList(start, count) {
        var today = new Date();
        for (var i = start; i < start + count; i++) {
            var appinfo = pkapplist[i];
            var item = pkgameitem.cloneNode(true);
            item.querySelector("#pkgameico")["src"] = appinfo.ico;
            item.querySelector("#pkappname").textContent = DotString(appinfo.name, 10);
            item.querySelector("#pkplaycount").textContent = appinfo.playcount.toString();
            item.querySelector("#pkappdetail").textContent = appinfo.detail;
            var apptime = new Date(appinfo.createtime);
            if (apptime.getFullYear() == today.getFullYear() && apptime.getMonth() == today.getMonth()) {
                item.querySelector("#pknew").textContent = today.getMonth() + 1 + "月新游";
            }
            else {
                item.querySelector("#pkflag")["style"].display = "none";
            }
            function fun(data) {
                $(item).find("#pkenter").click(function (ev) {
                    window.location.href = "chipin.shtml?id=" + data.id;
                });
            }
            fun(appinfo);
            item.style.display = "";
            pkgamelist.appendChild(item);
            pkgameitems.push(item);
        }
    }
    //更多游戏
    function onMorePkGame() {
        var count = pkapplist.length - pkgameitems.length;
        if (count <= 0)
            return;
        AddPkGameToList(pkgameitems.length, count);
        $("#morepkgame").hide();
    }
    gcindex.onMorePkGame = onMorePkGame;
    function SetAdEvent() {
        $(".main_visual").hover(function () {
            $("#btn_prev,#btn_next").fadeIn();
        }, function () {
            $("#btn_prev,#btn_next").fadeOut();
        });
        var dragBln = false;
        $(".main_image").touchSlider({
            flexible: true,
            speed: 200,
            btn_prev: $("#btn_prev"),
            btn_next: $("#btn_next"),
            paging: $(".flicking_con a"),
            counter: function (e) {
                $(".flicking_con a").removeClass("on").eq(e.current - 1).addClass("on");
            }
        });
        $(".main_image").bind("mousedown", function () {
            dragBln = false;
        });
        $(".main_image").bind("dragstart", function () {
            dragBln = true;
        });
        $(".main_image a").click(function () {
            if (dragBln) {
                return false;
            }
        });
        var timer = setInterval(function () {
            $("#btn_next").click();
        }, 5000);
        $(".main_visual").hover(function () {
            clearInterval(timer);
        }, function () {
            timer = setInterval(function () {
                $("#btn_next").click();
            }, 5000);
        });
        $(".main_image").bind("touchstart", function () {
            clearInterval(timer);
        }).bind("touchend", function () {
            timer = setInterval(function () {
                $("#btn_next").click();
            }, 5000);
        });
    }
    function onNologin() {
        if (GAMECENTER.userinfo) {
            window.location.href = "usercenter.shtml";
        }
        else {
            window.location.href = 'login.shtml';
        }
    }
    gcindex.onNologin = onNologin;
})(gcindex || (gcindex = {}));
//# sourceMappingURL=index.js.map