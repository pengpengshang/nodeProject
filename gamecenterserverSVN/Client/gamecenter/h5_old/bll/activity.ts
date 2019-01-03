$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            return;
        }
        ACVIVITY_NEW.loadDefaultData();
    });
});
module ACVIVITY_NEW {
    export function loadDefaultData() {
        loadGameActivity();
        loadPlamActivity();
        eventBind();
    }
    export function eventBind() {

    }
    export function loadGameActivity() {
        var para: GAMECENTER.GAMEACTIVITYINFOREQ = new GAMECENTER.GAMEACTIVITYINFOREQ();
        var gaclist: HTMLUListElement = <any>document.getElementById("gaclist");
        var gacitem: HTMLLIElement = <any>gaclist.firstElementChild;
        var gacitems: HTMLLIElement[] = [];
        //var paclevellist: HTMLOListElement = <any>document.getElementById("ac_level");
        //var paclevelitem: HTMLLIElement = <any>paclevellist.firstElementChild;
        //var paclevelitems: HTMLLIElement[] = [];
        var pacsharelist: HTMLOListElement = <any>document.getElementById("ac_share");
        var pacshareitem: HTMLLIElement = <any>pacsharelist.firstElementChild;
        var pacshareitems: HTMLLIElement[] = [];
        var pacchargelist: HTMLOListElement = <any>document.getElementById("ac_charge");
        var pacchargeitem: HTMLLIElement = <any>pacchargelist.firstElementChild;
        var pacchargeitems: HTMLLIElement[] = [];
        gacitem.style.display = "none";
        //paclevelitem.style.display = "none";
        pacshareitem.style.display = "none";
        pacchargeitem.style.display = "none";
        for (var i = 0; i < gacitems.length; i++) {
            gaclist.removeChild(gacitems[i]);
        }
        //for (var i = 0; i < paclevelitems.length; i++) {
        //    paclevellist.removeChild(paclevelitems[i]);
        //}
        for (var i = 0; i < pacshareitems.length; i++) {
            pacsharelist.removeChild(pacshareitems[i]);
        }
        for (var i = 0; i < pacchargeitems.length; i++) {
            pacchargelist.removeChild(pacchargeitems[i]);
        }
        gacitems.splice(0);
        //paclevelitems.splice(0);
        pacshareitems.splice(0);
        pacchargeitems.splice(0);
        para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
        GAMECENTER.getGameActivityInfo(para, resp => {//获取H5游戏活动列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GAMEACTIVITYINFOLISTRESP = resp.data;
            for (var i = 0; i < dat.gameactivitylist.length; i++) {
                var activityinfo: GAMECENTER.GAMEACTIVITYINFO = dat.gameactivitylist[i];
                if (activityinfo.atype == 0) {//游戏活动
                    var items: HTMLLIElement = <any>gacitem.cloneNode(true);
                    var nameandtitle = "[" + activityinfo.appname + "]" + activityinfo.title;
                    $(items).find("#gnameandtitle").text(nameandtitle);
                    $(items).find("#gactivitydate").text(new Date(activityinfo.starttime).toLocaleDateString() + "至" + new Date(activityinfo.endtime).toLocaleDateString());
                    $(items).find("#gprise").text(activityinfo.prise);
                    $(items).find("#gserver").text(activityinfo.server);
                    $(items).find("#gdetail").text(activityinfo.detail);
                    $(items).find("#grule").text(activityinfo.rule);
                    $(items).find("#gico").attr("src", activityinfo.ico + "?" + Math.random());
                    items.style.display = "";
                    gaclist.appendChild(items);
                    gacitems.push(items);
                } else {//平台活动
                    if (activityinfo.atype == 1) {//冲级赛
                        //var items: HTMLLIElement = <any>paclevelitem.cloneNode(true);
                        //var nameandtitle = "[" + activityinfo.appname + "]" + activityinfo.title;
                        //if (activityinfo.loginid != null) {//当前账号报名情况
                        //    $(items).find("#enter").css("background", "#9B9B9B").text("已报名");
                        //}
                        //$(items).find("#pactivitytitle").text(nameandtitle);
                        //$(items).find("#pactivitydate").text(new Date(activityinfo.starttime).toLocaleDateString() + "至" + new Date(activityinfo.endtime).toLocaleDateString());
                        //$(items).find("#pprise").text(activityinfo.prise);
                        //$(items).find("#pserver").text(activityinfo.server);
                        //$(items).find("#pdetail").text(activityinfo.detail);
                        //$(items).find("#prule").text(activityinfo.rule);
                        //$(items).find("#pico").attr("src", activityinfo.ico + "?" + Math.random());
                        //(function (data: GAMECENTER.GAMEACTIVITYINFO) {
                        //    $(items).find("#enter").click(function () {
                        //        var getFlag = $(this).text();
                        //        if ("已报名" != getFlag) {
                        //            var para: GAMECENTER.GSENTERGAMEACREQ = new GAMECENTER.GSENTERGAMEACREQ();
                        //            para.gamaacid = data.id;
                        //            para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                        //            GAMECENTER.GSEnterGameAC(para, (resp) => {
                        //                if (resp.errno != 0) {
                        //                    utils.dialogBox(resp.message);
                        //                    return;
                        //                }
                        //                utils.dialogBox("报名成功");
                        //                $(this).css("background", "#9B9B9B").text("已报名");
                        //            });
                        //        } else {
                        //            return;
                        //        }
                        //    });
                        //})(activityinfo);
                        //items.style.display = "";
                        //paclevellist.appendChild(items);
                        //paclevelitems.push(items);
                    }
                    if (activityinfo.atype == 2) {//分享赛
                        var items: HTMLLIElement = <any>pacshareitem.cloneNode(true);
                        var nameandtitle = "[" + activityinfo.appname + "]" + activityinfo.title;
                        if (activityinfo.loginid != null) {//当前账号报名情况
                            $(items).find("#enter").css("background", "#9B9B9B").text("已报名");
                        }
                        $(items).find("#pactivitytitle").text(nameandtitle);
                        $(items).find("#pactivitydate").text(new Date(activityinfo.starttime).toLocaleDateString() + "至" + new Date(activityinfo.endtime).toLocaleDateString());
                        $(items).find("#pprise").text(activityinfo.prise);
                        $(items).find("#pserver").text(activityinfo.server);
                        $(items).find("#pdetail").text(activityinfo.detail);
                        $(items).find("#prule").text(activityinfo.rule);
                        $(items).find("#pico").attr("src", activityinfo.ico + "?" + Math.random());
                        (function (data: GAMECENTER.GAMEACTIVITYINFO) {
                            $(items).find("#enter").click(function () {
                                var getFlag = $(this).text();
                                if ("已报名" != getFlag) {
                                    var para: GAMECENTER.GSENTERGAMEACREQ = new GAMECENTER.GSENTERGAMEACREQ();
                                    para.gamaacid = data.id;
                                    para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                                    GAMECENTER.GSEnterGameAC(para, (resp) => {
                                        if (resp.errno != 0) {
                                            utils.dialogBox(resp.message);
                                            return;
                                        }
                                        utils.dialogBox("报名成功");
                                        $(this).css("background", "#9B9B9B").text("已报名");
                                    });
                                } else {
                                    return;
                                }
                            });
                        })(activityinfo);
                        items.style.display = "";
                        pacsharelist.appendChild(items);
                        pacchargeitems.push(items);
                    }
                    if (activityinfo.atype == 3) {//充值赛
                        var items: HTMLLIElement = <any>pacchargeitem.cloneNode(true);
                        var nameandtitle = "[" + activityinfo.appname + "]" + activityinfo.title;
                        if (activityinfo.loginid != null) {//当前账号报名情况
                            $(items).find("#enter").css("background", "#9B9B9B").text("已报名");
                        }
                        $(items).find("#pactivitytitle").text(nameandtitle);
                        $(items).find("#pactivitydate").text(new Date(activityinfo.starttime).toLocaleDateString() + "至" + new Date(activityinfo.endtime).toLocaleDateString());
                        $(items).find("#pprise").text(activityinfo.prise);
                        $(items).find("#pserver").text(activityinfo.server);
                        $(items).find("#pdetail").text(activityinfo.detail);
                        $(items).find("#prule").text(activityinfo.rule);
                        $(items).find("#pico").attr("src", activityinfo.ico + "?" + Math.random());
                        (function (data: GAMECENTER.GAMEACTIVITYINFO) {
                            $(items).find("#enter").click(function () {
                                var getFlag = $(this).text();
                                if ("已报名" != getFlag) {
                                    var para: GAMECENTER.GSENTERGAMEACREQ = new GAMECENTER.GSENTERGAMEACREQ();
                                    para.gamaacid = data.id;
                                    para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                                    GAMECENTER.GSEnterGameAC(para, (resp) => {
                                        if (resp.errno != 0) {
                                            utils.dialogBox(resp.message);
                                            return;
                                        }
                                        utils.dialogBox("报名成功");
                                        $(this).css("background", "#9B9B9B").text("已报名");
                                    });
                                } else {
                                    return;
                                }
                            });
                        })(activityinfo);
                        items.style.display = "";
                        pacchargelist.appendChild(items);
                        pacchargeitems.push(items);
                    }
                }
            }
            $(".right_top").on("click", function () {//切换显示区服及内容详情
                var gab_flexible = $(this).siblings(".gab_content").children(".gab_flexible");
                if (gab_flexible.attr('style')) {
                    gab_flexible.css('height', '.42rem');
                    gab_flexible.removeAttr('style');
                } else {
                    gab_flexible.css('height', 'auto');
                }
                $(this).toggleClass("toggle");
            })
        });
    }
    export function loadPlamActivity() {

    }
    export var otherFunction = {
       
    }
}