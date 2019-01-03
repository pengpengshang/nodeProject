$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            return;
        }
        ACVIVITY_NEW.loadDefaultData();
    });
});
var ACVIVITY_NEW;
(function (ACVIVITY_NEW) {
    function loadDefaultData() {
        loadGameActivity();
        loadPlamActivity();
        eventBind();
    }
    ACVIVITY_NEW.loadDefaultData = loadDefaultData;
    function eventBind() {
    }
    ACVIVITY_NEW.eventBind = eventBind;
    function loadGameActivity() {
        var para = new GAMECENTER.GAMEACTIVITYINFOREQ();
        var gaclist = document.getElementById("gaclist");
        var gacitem = gaclist.firstElementChild;
        var gacitems = [];
        //var paclevellist: HTMLOListElement = <any>document.getElementById("ac_level");
        //var paclevelitem: HTMLLIElement = <any>paclevellist.firstElementChild;
        //var paclevelitems: HTMLLIElement[] = [];
        var pacsharelist = document.getElementById("ac_share");
        var pacshareitem = pacsharelist.firstElementChild;
        var pacshareitems = [];
        var pacchargelist = document.getElementById("ac_charge");
        var pacchargeitem = pacchargelist.firstElementChild;
        var pacchargeitems = [];
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
        GAMECENTER.getGameActivityInfo(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
            for (var i = 0; i < dat.gameactivitylist.length; i++) {
                var activityinfo = dat.gameactivitylist[i];
                if (activityinfo.atype == 0) {
                    var items = gacitem.cloneNode(true);
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
                }
                else {
                    if (activityinfo.atype == 1) {
                    }
                    if (activityinfo.atype == 2) {
                        var items = pacshareitem.cloneNode(true);
                        var nameandtitle = "[" + activityinfo.appname + "]" + activityinfo.title;
                        if (activityinfo.loginid != null) {
                            $(items).find("#enter").css("background", "#9B9B9B").text("已报名");
                        }
                        $(items).find("#pactivitytitle").text(nameandtitle);
                        $(items).find("#pactivitydate").text(new Date(activityinfo.starttime).toLocaleDateString() + "至" + new Date(activityinfo.endtime).toLocaleDateString());
                        $(items).find("#pprise").text(activityinfo.prise);
                        $(items).find("#pserver").text(activityinfo.server);
                        $(items).find("#pdetail").text(activityinfo.detail);
                        $(items).find("#prule").text(activityinfo.rule);
                        $(items).find("#pico").attr("src", activityinfo.ico + "?" + Math.random());
                        (function (data) {
                            $(items).find("#enter").click(function () {
                                var _this = this;
                                var getFlag = $(this).text();
                                if ("已报名" != getFlag) {
                                    var para = new GAMECENTER.GSENTERGAMEACREQ();
                                    para.gamaacid = data.id;
                                    para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                                    GAMECENTER.GSEnterGameAC(para, function (resp) {
                                        if (resp.errno != 0) {
                                            utils.dialogBox(resp.message);
                                            return;
                                        }
                                        utils.dialogBox("报名成功");
                                        $(_this).css("background", "#9B9B9B").text("已报名");
                                    });
                                }
                                else {
                                    return;
                                }
                            });
                        })(activityinfo);
                        items.style.display = "";
                        pacsharelist.appendChild(items);
                        pacchargeitems.push(items);
                    }
                    if (activityinfo.atype == 3) {
                        var items = pacchargeitem.cloneNode(true);
                        var nameandtitle = "[" + activityinfo.appname + "]" + activityinfo.title;
                        if (activityinfo.loginid != null) {
                            $(items).find("#enter").css("background", "#9B9B9B").text("已报名");
                        }
                        $(items).find("#pactivitytitle").text(nameandtitle);
                        $(items).find("#pactivitydate").text(new Date(activityinfo.starttime).toLocaleDateString() + "至" + new Date(activityinfo.endtime).toLocaleDateString());
                        $(items).find("#pprise").text(activityinfo.prise);
                        $(items).find("#pserver").text(activityinfo.server);
                        $(items).find("#pdetail").text(activityinfo.detail);
                        $(items).find("#prule").text(activityinfo.rule);
                        $(items).find("#pico").attr("src", activityinfo.ico + "?" + Math.random());
                        (function (data) {
                            $(items).find("#enter").click(function () {
                                var _this = this;
                                var getFlag = $(this).text();
                                if ("已报名" != getFlag) {
                                    var para = new GAMECENTER.GSENTERGAMEACREQ();
                                    para.gamaacid = data.id;
                                    para.loginid = utils.getCookie("GSUSERINFO").sdkloginid;
                                    GAMECENTER.GSEnterGameAC(para, function (resp) {
                                        if (resp.errno != 0) {
                                            utils.dialogBox(resp.message);
                                            return;
                                        }
                                        utils.dialogBox("报名成功");
                                        $(_this).css("background", "#9B9B9B").text("已报名");
                                    });
                                }
                                else {
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
            $(".right_top").on("click", function () {
                var gab_flexible = $(this).siblings(".gab_content").children(".gab_flexible");
                if (gab_flexible.attr('style')) {
                    gab_flexible.css('height', '.42rem');
                    gab_flexible.removeAttr('style');
                }
                else {
                    gab_flexible.css('height', 'auto');
                }
                $(this).toggleClass("toggle");
            });
        });
    }
    ACVIVITY_NEW.loadGameActivity = loadGameActivity;
    function loadPlamActivity() {
    }
    ACVIVITY_NEW.loadPlamActivity = loadPlamActivity;
    ACVIVITY_NEW.otherFunction = {};
})(ACVIVITY_NEW || (ACVIVITY_NEW = {}));
//# sourceMappingURL=activity.js.map