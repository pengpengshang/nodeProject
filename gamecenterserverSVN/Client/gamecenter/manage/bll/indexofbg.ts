$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        INDEXOFBG_NEW.loadData();
    })
});
module INDEXOFBG_NEW {
    var totalGameCount: HTMLSpanElement, totalGameCountForWeek: HTMLSpanElement, totalGameOLCountForWeek: HTMLSpanElement, waitpass: HTMLSpanElement
        , totalUserCount: HTMLSpanElement, totalIncomeCount: HTMLSpanElement
        , totalChannelUserCount: HTMLSpanElement, totalChannelIncomeCount: HTMLSpanElement
        , totalChannelCountForShz: HTMLSpanElement, totalChannelCount: HTMLSpanElement, totalChannelCountForZs: HTMLSpanElement;

    var servicetable: HTMLUListElement;
    var serviceitem: HTMLLIElement;
    var serviceitems: HTMLLIElement[] = [];

    var servicetable2: HTMLUListElement;
    var serviceitem2: HTMLLIElement;
    var serviceitems2: HTMLLIElement[] = [];
    var servicetable3: HTMLUListElement;
    var serviceitem3: HTMLLIElement;
    var serviceitems3: HTMLLIElement[] = [];
    var servicetable4: HTMLUListElement;
    var serviceitem4: HTMLLIElement;
    var serviceitems4: HTMLLIElement[] = [];
    var servicetable5: HTMLUListElement;
    var serviceitem5: HTMLLIElement;
    var serviceitems5: HTMLLIElement[] = [];

    export function loadData() {
        totalGameCount = document.getElementById("totalGameCount");
        totalGameCountForWeek = document.getElementById("totalGameCountForWeek");
        totalGameOLCountForWeek = document.getElementById("totalGameOLCountForWeek");
        waitpass = document.getElementById("waitpass");
        totalChannelCountForShz = document.getElementById("totalChannelCountForShz");
        totalChannelCount = document.getElementById("totalChannelCount");
        totalChannelCountForZs = document.getElementById("totalChannelCountForZs");
        INDEXOFBG_NEW.loadTablenew(null, null);
        INDEXOFBG_NEW.loadTablenew2(null, null);
        INDEXOFBG_NEW.loadTablenew3(null, null);
        INDEXOFBG_NEW.loadTablenew4(null, null);
        INDEXOFBG_NEW.loadTablenew5(null, null);
        //initData();
        //getTotalGameCount();
        //getTotalGameCountForWeek();
        //getTotalGameOLCountForWeek();
        //getTotalWaitPassCount();
        //getTotalChannelCount();
    }
    //function initData() {
    //    var param: ADMIN.ADMINGETPLAMFORMDATAREQ = new ADMIN.ADMINGETPKAPPLISTREQ();
    //    ADMIN.adminGetPlameformData(param, (resp) => {
    //        if (resp.errno != 0) {
    //            alert(resp.message);
    //            return;
    //        }
    //        var dat: ADMIN.ADMINGETPLAMEFORMDATARESP = resp.data;
    //        $("#totalIncome").text(dat.totalIncome);
    //        $("#todayIncome").text(dat.todayIncome);
    //        $("#weekIncome").text(dat.weekIncome);
    //        $("#monthIncome").text(dat.monthIncome);
    //        $("#totalUser").text(dat.totalUser);
    //        $("#todayUser").text(dat.todayUser);
    //        $("#weekUser").text(dat.weekUser);
    //        $("#monthUser").text(dat.monthUser);
    //    })
    //}

    export function loadTablenew(time, tablename) {
        servicetable = <any>document.getElementById("checkitems");
        serviceitem = <any>document.getElementById("checkitem");
        var para: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetChannelCount_NEW(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETALLGAMENAMERESP = resp.data;
            var data = dat.gamename;
            waitpass.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo: ADMIN.ADMINGETALLGAMENAMEINFO = data[i];
                var item: HTMLLIElement = <any>serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#appname").text(tableinfo.appname);
                servicetable.appendChild(item);
                serviceitems.push(item);
            }
        });
    }
    export function loadTablenew2(time, tablename) {
        servicetable2 = <any>document.getElementById("checkitems2");
        serviceitem2 = <any>document.getElementById("checkitem2");
        var para: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetALLGAMENAME_NEW(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETALLGAMENAMERESP = resp.data;
            var data = dat.gamename;
            totalGameCount.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo: ADMIN.ADMINGETALLGAMENAMEINFO = data[i];
                var item2: HTMLLIElement = <any>serviceitem2.cloneNode(true);
                item2.style.display = "";
                $(item2).find("#appname2").text(tableinfo.appname);
                servicetable2.appendChild(item2);
                serviceitems2.push(item2);
            }
        });
    }

    export function loadTablenew3(time, tablename) {
        servicetable3 = <any>document.getElementById("checkitems3");
        serviceitem3 = <any>document.getElementById("checkitem3");
        var para: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetNEWGAMENAME_NEW(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETALLGAMENAMERESP = resp.data;
            var data = dat.gamename;
            totalGameCountForWeek.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo: ADMIN.ADMINGETALLGAMENAMEINFO = data[i];
                var item3: HTMLLIElement = <any>serviceitem3.cloneNode(true);
                item3.style.display = "";
                $(item3).find("#appname3").text(tableinfo.appname);
                servicetable3.appendChild(item3);
                serviceitems3.push(item3);
            }
        });
    }
    export function loadTablenew4(time, tablename) {
        servicetable4 = <any>document.getElementById("checkitems4");
        serviceitem4 = <any>document.getElementById("checkitem4");
        var para: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetNEWGAMENAMEUP_NEW(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETALLGAMENAMERESP = resp.data;
            var data = dat.gamename;
            totalGameOLCountForWeek.textContent = data.length+"";
            for (var i = 0; i < data.length; i++) {
                var tableinfo: ADMIN.ADMINGETALLGAMENAMEINFO = data[i];
                var item4: HTMLLIElement = <any>serviceitem4.cloneNode(true);
                item4.style.display = "";
                $(item4).find("#appname4").text(tableinfo.appname);
                servicetable4.appendChild(item4);
                serviceitems4.push(item4);
            }
        });
    }

    export function loadTablenew5(time, tablename) {
        servicetable5 = <any>document.getElementById("checkitems5");
        serviceitem5 = <any>document.getElementById("checkitem5");
        var para: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetAllSdkName_NEW(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETALLGAMENAMERESP = resp.data;
            var data = dat.gamename;
            totalChannelCount.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo: ADMIN.ADMINGETALLGAMENAMEINFO = data[i];
                var item5: HTMLLIElement = <any>serviceitem5.cloneNode(true);
                item5.style.display = "";
                $(item5).find("#sdkname").text(tableinfo.sdkname);
                servicetable5.appendChild(item5);
                serviceitems5.push(item5);
            }
        });
    }


    //function getTotalChannelCount() {//所有渠道数目,不包括子渠道
    //    var param: ADMIN.ADMINGETCHANNELCOUNTREQ = new ADMIN.ADMINGETCHANNELCOUNTREQ();
    //    ADMIN.adminGetChannelCount(param, resp => {
    //        if (resp.errno != 0) {
    //            alert(resp.message);
    //            return;
    //        }
    //        var channelcount = resp.data.channelcount;

    //        totalChannelCount.textContent = channelcount;
    //    });
    //}
    //function getTotalGameCount() {//所有游戏数目
    //    var param: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
    //    ADMIN.adminGetGameCount(param, resp => {
    //        if (resp.errno != 0) {
    //            alert(resp.message);
    //            return;
    //        }
    //        var gamecount = resp.data.gamecount;
    //        totalGameCount.textContent = gamecount;
    //    });
    //}


    //function getTotalWaitPassCount() {//待审核游戏数目
    //    var param: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
    //    param.flags = "WAIT";
    //    ADMIN.adminGetGameCount(param, resp => {
    //        if (resp.errno != 0) {
    //            alert(resp.message);
    //            return;
    //        }
    //        var gamecount = resp.data.gamecount;
    //        waitpass.textContent = gamecount;
    //    });
    //}


    //function getTotalGameCountForWeek() {//本周添加游戏数
    //    var param: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
    //    param.flags = "WEEK";
    //    ADMIN.adminGetGameCount(param, resp => {
    //        if (resp.errno != 0) {
    //            alert(resp.message);
    //            return;
    //        }
    //        var gamecount = resp.data.gamecount;
    //        totalGameCountForWeek.textContent = gamecount;
    //    });
    //}
    //function getTotalGameOLCountForWeek() {//本周上线游戏数
    //    var param: ADMIN.ADMINGETGAMECOUNTREQ = new ADMIN.ADMINGETGAMECOUNTREQ();
    //    param.flags = "OL";
    //    ADMIN.adminGetGameCount(param, resp => {
    //        if (resp.errno != 0) {
    //            alert(resp.message);
    //            return;
    //        }
    //        var gamecount = resp.data.gamecount;
    //        totalGameOLCountForWeek.textContent = gamecount;
    //    });
    //}
}