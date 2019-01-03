﻿$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            utils.dialogBox("尚未登入，请先登入", () => {
                window.location.href = "login.html";
            });
            return;
        }
        GAMEDETAILDATA.loadgamedetaildata();
        GAMEDETAILDATA.loadgameactivitydata();
        GAMEDETAILDATA.ShowRecentPlay(userinfo);
    });
});
module GAMEDETAILDATA {
    var gamedetailgiftlist: HTMLUListElement = <any>document.getElementById("gamedetail_giftbag");
    var gamedetailgiftitem: HTMLLIElement = <any>gamedetailgiftlist.firstElementChild;
    var gamedetailgiftitems: HTMLLIElement[] = [];



    /*******************************获取游戏具体数据****************************************/
    export function loadgamedetaildata() {
        var para: GAMECENTER.GAMEDETAILREQ = new GAMECENTER.GAMEDETAILREQ();
        para.gameid = utils.getQueryString("gameid");
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        gamedetailgiftitem.style.display = "none";
        for (var i = 0; i < gamedetailgiftitems.length; i++) {
            gamedetailgiftlist.removeChild(gamedetailgiftitems[i]);
        }
        gamedetailgiftitems.splice(0);
        GAMECENTER.getGameDetailList(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.GAMEDETAILINFO[] = resp.data;

            $("#play_person").text(data[0].playcount);

            $("#gmico").attr("src", data[0].ico);
            $(".gmname").text(data[0].name);
            $("#gmintro").text(data[0].detail);
            $("#gamedetail_itro").text(data[0].gameint);
            $("#getin_game").click(ev => {

                if (isSafari()) {
                    window.location.href = '../../gamepage.html#' + data[0].gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                } else {
                    window.location.href = '../../gamepage.html#' + data[0].gameid;
                }

                
            })
            $(".gamedetail_start_game").click(ev => {

                if (isSafari()) {
                    window.location.href = '../../gamepage.html#' + data[0].gameid + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                } else {
                    window.location.href = '../../gamepage.html#' + data[0].gameid;
                }

                
            })
            $("#game_lable").text(data[0].remark);


            if (!(data.length == 1 && data[0].giftname == null)) {
                for (var i = 0; i < data.length; i++) {
                    var giftinfo: GAMECENTER.GAMEDETAILINFO = data[i];
                    var item = HTMLLIElement = <any>gamedetailgiftitem.cloneNode(true);
                    $(item).find("#gift_bag_ico").attr("src", giftinfo.ico);
                    $(item).find("#game_name").text(giftinfo.name);
                    $(item).find("#gift_name").text(giftinfo.giftname);
                    $(item).find("#gift_jindu").attr("max", giftinfo.total);
                    $(item).find("#gift_jindu").attr("value", (giftinfo.total - giftinfo.remainder));
                    $(item).find("#baifen").text(parseInt(((giftinfo.total - giftinfo.remainder) / giftinfo.total * 100).toString()) + "%");
                    $(item).find("#createtime").text(new Date(giftinfo.endtime).toLocaleDateString());
                    if (giftinfo.groupqq == null || giftinfo.groupqq == '') {
                        $(item).find("#get_in_together").attr("src", '../img/game/giftbag/nomall.png');
                        if (giftinfo.loginid == null) {
                            $(item).find("#get_gift_code").text("领取");
                            $(item).find("#get_gift_code").css({ "color": "white", "background-color": "red", "border": "none" });
                        } else {
                            $(item).find("#get_gift_code").text("查看");
                        }
                    } else {
                        $(item).find("#get_in_together").attr("src", '../img/game/giftbag/get_in_together.png');
                        $(item).find("#get_gift_code").text("加群");
                        $(item).find(".together_qq").css({
                            "color": "#FA6828",
                            "border": "2px solid #FA6828"
                        });
                    }

                    (function fun(data: GAMECENTER.GAMEDETAILINFO) {

                        $(item).find("#get_gift_code").on("click", function () {
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

                    })(giftinfo)

                    item.style.display = "";
                    gamedetailgiftlist.appendChild(item);
                    gamedetailgiftitems.push(item);
                }
            } 
            if (data.length > 1) {
                $("#gamedetail_giftbag").css({ "height": "3rem", "overflow":"hidden" })
            } else {
                $("#gamedetail_giftbag").css({ "height": "auto" })
            }
            $("#list_all").click(function () {
                var height = $("#gamedetail_giftbag_list").height();
                if ($("#gamedetail_giftbag").height() > height * 3) {
                    $("#list_all").css({ "transform": "rotate(0deg)", "top": "0.04rem" })
                    $("#gamedetail_giftbag").css({ "height": "3rem" })
                } else {
                    $("#list_all").css({ "transform": "rotate(90deg)", "top": "0.26rem" })
                    $("#gamedetail_giftbag").css({ "height": "auto" })
                }

            })
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
                doc.css({ "color": "skyblue", "background-color": "white", "border": "2px solid skyblue" });
            } else {
                utils.dialogBox("来晚了,请等待下次发放");
                doc.text("结束");
                doc.css({ "color": "#999999", "border": "2px solid #999999","background-color":"white" });
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

    /*********根据游戏的id获取游戏活动列表***************/
    var activitylist: HTMLUListElement = <any>document.getElementById("gamedetail_news");
    var activityitem: HTMLLIElement = <any>activitylist.firstElementChild;
    var activityitems: HTMLLIElement[] = [];

    export function loadgameactivitydata() {
        var para: GAMECENTER.GAMEDETAILREQ = new GAMECENTER.GAMEDETAILREQ();
        para.gameid = utils.getQueryString("gameid");
        activityitem.style.display = "none";
        for (var i = 0; i < activityitems.length; i++) {
            activitylist.removeChild(activityitems[i]);
        }
        activityitems.splice(0);
        GAMECENTER.getGameDetailAT(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var data: GAMECENTER.GAMEDETAILACTIVITYINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var giftinfo: GAMECENTER.GAMEDETAILACTIVITYINFO = data[i];
                var item = HTMLLIElement = <any>activityitem.cloneNode(true);
                $(item).find("#gamname").text(giftinfo.name);

                if ((giftinfo.title).length > 20) {
                    $(item).find("#ac_title").text((giftinfo.title).substr(0, 20) + "...");
                } else {
                    $(item).find("#ac_title").text(giftinfo.title);
                }
                if (giftinfo.ishot == 1) {
                    $(item).find("#ishot").attr("src", "../img/game/gamedetail/HOT_lable.png");
                } else {
                    $(item).find("#ishot").css("display", "none");
                }
                if (giftinfo.lable == '更新') {
                    $(item).find("#lable").attr("src", "../img/game/activity/activity_gengxin.png");
                }
                if (giftinfo.lable == '热闻') {
                    $(item).find("#lable").attr("src", "../img/game/activity/activity_news.png");
                }
                if (giftinfo.lable == '维护') {
                    $(item).find("#lable").attr("src", "../img/game/activity/activity_weihu.png");
                }
                if (giftinfo.lable == '攻略') {
                    $(item).find("#lable").attr("src", "../img/game/activity/activity_huodong.png");
                }

                (function fun(data: GAMECENTER.GAMEDETAILACTIVITYINFO) {

                    $(item).find("#ac_title").click(ev => {
                        window.location.href = 'activitydetail.html?acId=' + data.id;
                    });
                })(giftinfo);
                item.style.display = "";
                activitylist.appendChild(item);
                activityitems.push(item);
            }




            if (data.length > 3) {
                $("#gamedetail_news").css({ "height": "2.7rem", "overflow": "hidden" })
            } else {
                $("#gamedetail_news").css({ "height": "auto" })
            }
            $("#ac_list_all").click(function () {
                var height = $("#gamedetail_news_list").height();
                if ($("#gamedetail_news").height() > height * 11) {
                    $("#ac_list_all").css({ "transform": "rotate(0deg)", "top": "0.04rem" })
                    $("#gamedetail_news").css({ "height": "2.7rem" })
                } else {
                    $("#ac_list_all").css({ "transform": "rotate(90deg)", "top": "0.26rem" })
                    $("#gamedetail_news").css({ "height": "auto" })
                }

            })










        })
    }
    export function ShowRecentPlay(userinfo: GAMECENTER.GSUSERINFO) {
        var rpgame: HTMLDivElement = <any>document.getElementById("swiper-wrapper");
        var para: H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ = new H5LOGINFOEntity_SECOND.GSUSERGETH5LOGLISTREQ();
        para.userid = userinfo.userid;
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
                var span: HTMLSpanElement = <any>document.createElement("span");
                var img: HTMLImageElement = document.createElement("img");
                var appinfo: GAMECENTER.H5APPINFO = h5gameRPlist[i];
                (function fun(data: GAMECENTER.H5APPINFO) {
                    link.onclick = function () {
                        utils.setStorage("session", "&session=" + GAMECENTER.userinfo.session, "sessionStorage");

                        if (isSafari()) {
                            window.location.href = "../../gamepage.html#" + "?userInfo=" + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(utils.getCookie("GSUSERINFO")))));
                        } else {
                            window.location.href = "../../gamepage.html#" + data.id;
                        }

                        
                    };
                })(appinfo);

                if (!!IsPC()) {
                    span.textContent = (appinfo.name).substr(0, 6);
                    span.style.fontSize = '0.15rem';
                } else {
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
            var swiper = new Swiper('.well_like', {
                pagination: '.swiper-pagination',
                slidesPerView: 5,
                paginationClickable: true,
                spaceBetween: 10
            });
        });
    }

    /**********************收藏游戏*****************************/
    export function collectgame() {
        var para: GAMECENTER.COLLECTGAMEREQ = new GAMECENTER.COLLECTGAMEREQ();
        para.gameid = utils.getQueryString("gameid");
        para.userid = GAMECENTER.userinfo.sdkuserid;
        GAMECENTER.getCollectGame(para, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
        })

    }


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

}