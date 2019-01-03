$(document).ready(() => {
    var channel = utils.getQueryString("channel");
    if (channel != null) GAMECENTER.SetChannel(channel);
    GAMECENTER.UserAutoLogin(userinfo => {
        if (userinfo == null || userinfo == undefined) {
            return;
        }
        MOREACVIVITY_NEW.loadDefaultData();
    });
});
module MOREACVIVITY_NEW {
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
        GAMECENTER.getGameActivityInfo(para, resp => {//获取H5游戏活动列表
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GAMEACTIVITYINFOLISTRESP = resp.data;

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
                } 


                var gab_flexible = $(this).siblings(".gab_content").children(".gab_flexible");
                if (gab_flexible.attr('style')) {
                    gab_flexible.css('height', '.42rem');
                    gab_flexible.removeAttr('style');
                } else {
                    gab_flexible.css('height', 'auto');
                }
                $(this).toggleClass("toggle");
            })

    }
    export function loadPlamActivity() {

    }
    export var otherFunction = {
       
    }
    $(".back").click(function () {
        utils.setStorage("activity", "3", sessionStorage);
        window.location.href = "index.html";
    })


}