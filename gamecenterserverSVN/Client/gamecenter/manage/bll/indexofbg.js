$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        INDEXOFBG_NEW.loadData();
    });
});
var INDEXOFBG_NEW;
(function (INDEXOFBG_NEW) {
    var totalGameCount, totalGameCountForWeek, totalGameOLCountForWeek, waitpass, totalUserCount, totalIncomeCount, totalChannelUserCount, totalChannelIncomeCount, totalChannelCountForShz, totalChannelCount, totalChannelCountForZs;
    var servicetable;
    var serviceitem;
    var serviceitems = [];
    var servicetable2;
    var serviceitem2;
    var serviceitems2 = [];
    var servicetable3;
    var serviceitem3;
    var serviceitems3 = [];
    var servicetable4;
    var serviceitem4;
    var serviceitems4 = [];
    var servicetable5;
    var serviceitem5;
    var serviceitems5 = [];
    function loadData() {
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
    INDEXOFBG_NEW.loadData = loadData;
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
    function loadTablenew(time, tablename) {
        servicetable = document.getElementById("checkitems");
        serviceitem = document.getElementById("checkitem");
        var para = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetChannelCount_NEW(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var data = dat.gamename;
            waitpass.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo = data[i];
                var item = serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#appname").text(tableinfo.appname);
                servicetable.appendChild(item);
                serviceitems.push(item);
            }
        });
    }
    INDEXOFBG_NEW.loadTablenew = loadTablenew;
    function loadTablenew2(time, tablename) {
        servicetable2 = document.getElementById("checkitems2");
        serviceitem2 = document.getElementById("checkitem2");
        var para = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetALLGAMENAME_NEW(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var data = dat.gamename;
            totalGameCount.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo = data[i];
                var item2 = serviceitem2.cloneNode(true);
                item2.style.display = "";
                $(item2).find("#appname2").text(tableinfo.appname);
                servicetable2.appendChild(item2);
                serviceitems2.push(item2);
            }
        });
    }
    INDEXOFBG_NEW.loadTablenew2 = loadTablenew2;
    function loadTablenew3(time, tablename) {
        servicetable3 = document.getElementById("checkitems3");
        serviceitem3 = document.getElementById("checkitem3");
        var para = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetNEWGAMENAME_NEW(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var data = dat.gamename;
            totalGameCountForWeek.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo = data[i];
                var item3 = serviceitem3.cloneNode(true);
                item3.style.display = "";
                $(item3).find("#appname3").text(tableinfo.appname);
                servicetable3.appendChild(item3);
                serviceitems3.push(item3);
            }
        });
    }
    INDEXOFBG_NEW.loadTablenew3 = loadTablenew3;
    function loadTablenew4(time, tablename) {
        servicetable4 = document.getElementById("checkitems4");
        serviceitem4 = document.getElementById("checkitem4");
        var para = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetNEWGAMENAMEUP_NEW(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var data = dat.gamename;
            totalGameOLCountForWeek.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo = data[i];
                var item4 = serviceitem4.cloneNode(true);
                item4.style.display = "";
                $(item4).find("#appname4").text(tableinfo.appname);
                servicetable4.appendChild(item4);
                serviceitems4.push(item4);
            }
        });
    }
    INDEXOFBG_NEW.loadTablenew4 = loadTablenew4;
    function loadTablenew5(time, tablename) {
        servicetable5 = document.getElementById("checkitems5");
        serviceitem5 = document.getElementById("checkitem5");
        var para = new ADMIN.ADMINGETGAMECOUNTREQ();
        ADMIN.adminGetAllSdkName_NEW(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var data = dat.gamename;
            totalChannelCount.textContent = data.length + "";
            for (var i = 0; i < data.length; i++) {
                var tableinfo = data[i];
                var item5 = serviceitem5.cloneNode(true);
                item5.style.display = "";
                $(item5).find("#sdkname").text(tableinfo.sdkname);
                servicetable5.appendChild(item5);
                serviceitems5.push(item5);
            }
        });
    }
    INDEXOFBG_NEW.loadTablenew5 = loadTablenew5;
})(INDEXOFBG_NEW || (INDEXOFBG_NEW = {}));
//# sourceMappingURL=indexofbg.js.map