$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        KINDOFGAME_NEW.loadData();
        KINDOFGAME_NEW.adminPPDS();
    });
});
var KINDOFGAME_NEW;
(function (KINDOFGAME_NEW) {
    var datatable, datatable2, datatable3;
    var dataheader, dataheader2, dataheader3;
    var dataitem, dataitem2, dataitem3;
    var dataitems = [];
    var servicetable;
    var serviceitem;
    var serviceitems = [];
    function loadData() {
        $("#timestart").val(new Date().toLocaleDateString());
        $("#timeend").val(new Date().toLocaleDateString());
        $("#timestart2").val(new Date().toLocaleDateString());
        $("#timeend2").val(new Date().toLocaleDateString());
        $("#timestart3").val(new Date().toLocaleDateString());
        $("#timeend3").val(new Date().toLocaleDateString());
        datatable = document.getElementById("datatable");
        dataheader = document.getElementById("dataheader");
        dataitem = document.getElementById("dataitem");
        datatable2 = document.getElementById("datatable2");
        dataheader2 = document.getElementById("dataheader2");
        dataitem2 = document.getElementById("dataitem2");
        datatable3 = document.getElementById("datatable3");
        dataheader3 = document.getElementById("dataheader3");
        dataitem3 = document.getElementById("dataitem3");
        dataitem.style.display = "none";
        dataitem2.style.display = "none";
        dataitem3.style.display = "none";
    }
    KINDOFGAME_NEW.loadData = loadData;
    //创建一个datarow
    function NewRow(fields, defaultvalue) {
        var dat = {};
        for (var i = 0; i < fields.length; i++) {
            dat[fields[i]] = defaultvalue[i];
        }
        return dat;
    }
    function adminPPDS() {
        var para = new ADMIN.ADMINPLAFORMCDSREQ();
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val() + " 23:59:59";
        var timestart = new Date(para.timestart);
        var timeend = new Date(para.timeend);
        ADMIN.adminPCDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var datfields = ["时间", "访问量", "注册用户", "付费用户", "金额"];
            var defaultvalue = [null, 0, 0, 0, 0];
            //将数据转成map
            var _MAPCOUNT = (function () {
                function _MAPCOUNT() {
                    this.time = null;
                    this.opencount = 0; //点击次数
                    this.addcount = 0; //新增用户
                    this.payaccount = 0;
                    this.payrmb = 0;
                }
                return _MAPCOUNT;
            }());
            ;
            var map = {}; //map[日期_appid_sdkid]=_MAPCOUNT
            for (var i = 0; i < dat.data.rows.length; i++) {
                var data = dat.data;
                var mapkey = dat.data.rows[i]["时间"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.time = dat.data.rows[i]["时间"];
                    map[mapkey] = cou;
                }
                cou.payaccount = dat.data.rows[i]['付费用户'];
                cou.payrmb = dat.data.rows[i]['付费金额'];
            }
            ADMIN.adminPUDS(para, function (resp) {
                if (resp.errno != 0) {
                    alert(resp.message);
                    return;
                }
                var dat2 = resp.data;
                for (var i = 0; i < dat2.data.rows.length; i++) {
                    var data = dat.data;
                    var mapkey = dat2.data.rows[i]["logdate"];
                    var cou = map[mapkey];
                    if (!cou) {
                        cou = new _MAPCOUNT();
                        cou.time = dat2.data.rows[i]["logdate"];
                        map[mapkey] = cou;
                    }
                    cou.addcount = dat2.data.rows[i]["addcount"];
                }
                ADMIN.adminPVDS(para, function (resp) {
                    if (resp.errno != 0) {
                        alert(resp.message);
                        return;
                    }
                    var dat3 = resp.data;
                    for (var i = 0; i < dat3.data.rows.length; i++) {
                        var data = dat.data;
                        var mapkey = dat3.data.rows[i]["createtime"];
                        var cou = map[mapkey];
                        if (!cou) {
                            cou = new _MAPCOUNT();
                            cou.time = dat3.data.rows[i]["createtime"];
                            map[mapkey] = cou;
                        }
                        cou.opencount = dat3.data.rows[i]["pvdata"];
                    }
                    //将map转数组
                    var rs = new ADMIN.DATATABLE();
                    rs.fields = datfields;
                    rs.rows = [];
                    for (var j in map) {
                        var cou = map[j];
                        var row = NewRow(rs.fields, defaultvalue);
                        row["时间"] = new Date(cou.time).toLocaleDateString();
                        row["访问量"] = cou.opencount;
                        row["注册用户"] = cou.addcount;
                        row["付费用户"] = cou.payaccount;
                        row["金额"] = cou.payrmb;
                        rs.rows.push(row);
                    }
                    rs.rows.sort(function (a, b) {
                        if (a['时间'] < b['时间']) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    });
                    ShowData(datatable, dataheader, dataitem, rs);
                });
            });
        });
    }
    KINDOFGAME_NEW.adminPPDS = adminPPDS;
    function adminPGCDS() {
        var para = new ADMIN.ADMINPLAFORMGAMECHARGESEARCHREQ();
        para.appname = $("#txtappname").val();
        para.timestart = $("#timestart2").val();
        para.timeend = $("#timeend2").val() + " 23:59:59";
        ADMIN.adminPGCDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var datfields = ["游戏", "点击", "创角", "金额"];
            var defaultvalue = [null, 0, 0, 0];
            //将数据转成map
            var _MAPCOUNT = (function () {
                function _MAPCOUNT() {
                    this.appname = null; //游戏名
                    this.opencount = 0; //点击
                    this.paymoney = 0; //金额
                    this.createroleuser = 0; //新创角用户数
                }
                return _MAPCOUNT;
            }());
            ;
            var map = {}; //map[appid_sdkid]=_MAPCOUNT
            for (var i = 0; i < dat.paydata.rows.length; i++) {
                var data = dat.paydata;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data.rows[i]["appid"];
                    cou.appname = data.rows[i]["appname"];
                    map[mapkey] = cou;
                }
                cou.paymoney = data.rows[i]["paysum"];
            }
            for (var i = 0; i < dat.flowdata.rows.length; i++) {
                var data2 = dat.flowdata;
                var mapkey = data2.rows[i]["appid"] + "_" + data2.rows[i]["appname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appname = data2.rows[i]["appname"];
                    cou.appid = data2.rows[i]["appid"];
                    map[mapkey] = cou;
                }
                cou.createroleuser = data2.rows[i]["createroleuser"];
            }
            for (var i = 0; i < dat.clickdata.rows.length; i++) {
                var data3 = dat.clickdata;
                var mapkey = data3.rows[i]["appid"] + "_" + data3.rows[i]["appname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appname = data3.rows[i]["appname"];
                    cou.appid = data3.rows[i]["appid"];
                    map[mapkey] = cou;
                }
                cou.opencount = data3.rows[i]["opencount"];
            }
            var rs = new ADMIN.DATATABLE();
            rs.fields = datfields;
            rs.rows = [];
            for (var j in map) {
                var cou = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["游戏"] = cou.appname;
                row["点击"] = cou.opencount;
                row["创角"] = cou.createroleuser;
                row["金额"] = cou.paymoney.toFixed(2);
                rs.rows.push(row);
            }
            ShowData(datatable2, dataheader2, dataitem2, rs);
        });
    }
    KINDOFGAME_NEW.adminPGCDS = adminPGCDS;
    function adminPUCDS() {
        var para = new ADMIN.ADMINPLAFORMGAMECHARGESEARCHREQ();
        para.appname = $("#txtappname2").val();
        para.timestart = $("#timestart3").val();
        para.timeend = $("#timeend3").val() + " 23:59:59";
        ADMIN.adminPUCDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < dataitems.length; i++) {
                datatable3.removeChild(dataitems[i]);
            }
            dataitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.length; i++) {
                var info = dat[i];
                var item = dataitem3.cloneNode(true);
                item.style.display = "";
                $(item).find("#userid").text(info.userid);
                $(item).find("#appname").text(info.appname);
                $(item).find("#payrmb").text(info.paytotal);
                $(item).find("#minpaytime").text(new Date(info.minpaytime).toLocaleDateString());
                $(item).find("#maxpaytime").text(new Date(info.maxpaytime).toLocaleDateString());
                datatable3.appendChild(item);
                dataitems.push(item);
            }
        });
    }
    KINDOFGAME_NEW.adminPUCDS = adminPUCDS;
    function loadUser(time, tablename) {
        servicetable = document.getElementById("tableservice");
        serviceitem = document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLLISTUSERREQ();
        para.time = time;
        para.tablename = tablename;
        ADMIN.adminGetAllVIPUser(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat = resp.data;
            var data = dat.userlist;
            for (var i = 0; i < data.length; i++) {
                var userinfo = data[i];
                var item = serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#user_id").text(userinfo.userid);
                if (userinfo.nickname != null && userinfo.nickname != '') {
                    $(item).find("#user_nick").text((userinfo.nickname).substr(0, 15));
                }
                else {
                    $(item).find("#user_nick").text(userinfo.nickname);
                }
                $(item).find("#user_phone").text(userinfo.pay);
                if (userinfo.phone != null && userinfo.phone != '') {
                    $(item).find("#tel_phone").text(userinfo.phone);
                }
                else {
                    $(item).find("#tel_phone").text("未绑定");
                }
                if (userinfo.email != null && userinfo.email != '') {
                    $(item).find("#user_email").text(userinfo.email);
                }
                else {
                    $(item).find("#user_email").text("未绑定");
                }
                if (userinfo.pay >= 0 && userinfo.pay < 6) {
                    $(item).find("#user_weixin").text("0");
                }
                else if (userinfo.pay >= 6 && userinfo.pay < 50) {
                    $(item).find("#user_weixin").text("1");
                }
                else if (userinfo.pay >= 50 && userinfo.pay < 100) {
                    $(item).find("#user_weixin").text("2");
                }
                else if (userinfo.pay >= 100 && userinfo.pay < 200) {
                    $(item).find("#user_weixin").text("3");
                }
                else if (userinfo.pay >= 200 && userinfo.pay < 500) {
                    $(item).find("#user_weixin").text("4");
                }
                else if (userinfo.pay >= 500 && userinfo.pay < 2000) {
                    $(item).find("#user_weixin").text("5");
                }
                else if (userinfo.pay >= 2000 && userinfo.pay < 5000) {
                    $(item).find("#user_weixin").text("6");
                }
                else if (userinfo.pay >= 5000 && userinfo.pay < 10000) {
                    $(item).find("#user_weixin").text("7");
                }
                else if (userinfo.pay >= 10000 && userinfo.pay < 30000) {
                    $(item).find("#user_weixin").text("8");
                }
                else if (userinfo.pay >= 30000 && userinfo.pay < 50000) {
                    $(item).find("#user_weixin").text("9");
                }
                else if (userinfo.pay >= 50000 && userinfo.pay < 100000) {
                    $(item).find("#user_weixin").text("10");
                }
                else if (userinfo.pay >= 100000 && userinfo.pay < 200000) {
                    $(item).find("#user_weixin").text("11");
                }
                else if (userinfo.pay >= 200000 && userinfo.pay < 360000) {
                    $(item).find("#user_weixin").text("12");
                }
                else if (userinfo.pay >= 360000 && userinfo.pay < 700000) {
                    $(item).find("#user_weixin").text("13");
                }
                else if (userinfo.pay >= 700000 && userinfo.pay < 1200000) {
                    $(item).find("#user_weixin").text("14");
                }
                else {
                    $(item).find("#user_weixin").text("15");
                }
                servicetable.appendChild(item);
                serviceitems.push(item);
            }
        });
    }
    KINDOFGAME_NEW.loadUser = loadUser;
    function ShowData(datatable, dataheader, dataitem, data) {
        $(dataheader).find("*").remove();
        while (datatable.childElementCount > 1)
            datatable.removeChild(datatable.lastElementChild);
        //生成列头
        for (var i = 0; i < data.fields.length; i++) {
            var th = document.createElement("th");
            th.innerText = data.fields[i];
            if (data.fields[i] == "时间" || data.fields[i] == "游戏") {
                th.style.textAlign = "left";
            }
            else {
                th.style.textAlign = "center";
            }
            dataheader.appendChild(th);
        }
        //生成数据
        for (var j = 0; j < data.rows.length; j++) {
            var tr = dataitem.cloneNode(true);
            tr.style.display = "";
            for (var i = 0; i < data.fields.length; i++) {
                var td = document.createElement("td");
                td.innerText = data.rows[j][data.fields[i]];
                if (data.fields[i] == "时间" || data.fields[i] == "游戏") {
                    td.style.textAlign = "left";
                }
                else {
                    td.style.textAlign = "center";
                }
                if (!!data.rows[j]["游戏"] || !!data.rows[j]["时间"]) {
                    tr.appendChild(td);
                }
            }
            datatable.appendChild(tr);
        }
    }
    KINDOFGAME_NEW.ShowData = ShowData;
})(KINDOFGAME_NEW || (KINDOFGAME_NEW = {}));
//# sourceMappingURL=kindofgame.js.map