$(document).ready(function () {
    var channel = utils.getQueryString("channel");
    if (channel != null)
        GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(function (userinfo) {
        if (userinfo == null || userinfo == undefined) {
            return;
        }
        MOREACVIVITY_NEW.loadDefaultData();
    });
});
var MOREACVIVITY_NEW;
(function (MOREACVIVITY_NEW) {
    function loadDefaultData() {
        loadGameActivity();
        loadPlamActivity();
        eventBind();
    }
    MOREACVIVITY_NEW.loadDefaultData = loadDefaultData;
    function eventBind() {
    }
    MOREACVIVITY_NEW.eventBind = eventBind;
    function loadGameActivity() {
        var _this = this;
        var para = new GAMECENTER.GAMEACTIVITYINFOREQ();
        var gaclist = document.getElementById("gaclist");
        var gacitem = gaclist.firstElementChild;
        var gacitems = [];
        //var paclevellist: HTMLOListElement = <any>document.getElementById("ac_level");
        //var paclevelitem: HTMLLIElement = <any>paclevellist.firstElementChild;
        //var paclevelitems: HTMLLIElement[] = [];
        var pacsharelist = document.getElementById("ac_share");
        gacitem.style.display = "none";
        //paclevelitem.style.display = "none";
        for (var i = 0; i < gacitems.length; i++) {
            gaclist.removeChild(gacitems[i]);
        }
        //for (var i = 0; i < paclevelitems.length; i++) {
        //    paclevellist.removeChild(paclevelitems[i]);
        //}
        gacitems.splice(0);
        //paclevelitems.splice(0);
        para.loginid = GAMECENTER.userinfo.sdkloginid;
        para.id = utils.getQueryString("type").toString();
        GAMECENTER.getGameActivityInfo(para, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
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
            var gab_flexible = $(_this).siblings(".gab_content").children(".gab_flexible");
            if (gab_flexible.attr('style')) {
                gab_flexible.css('height', '.42rem');
                gab_flexible.removeAttr('style');
            }
            else {
                gab_flexible.css('height', 'auto');
            }
            $(_this).toggleClass("toggle");
        });
    }
    MOREACVIVITY_NEW.loadGameActivity = loadGameActivity;
    function loadPlamActivity() {
    }
    MOREACVIVITY_NEW.loadPlamActivity = loadPlamActivity;
    MOREACVIVITY_NEW.otherFunction = {};
    $(".back").click(function () {
        utils.setStorage("activity", "3", sessionStorage);
        window.location.href = "index.html";
    });
})(MOREACVIVITY_NEW || (MOREACVIVITY_NEW = {}));
//# sourceMappingURL=moreActivity.js.map