$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        DATAS_NEW.loadData();
        DATAS_NEW.loadChannel();
        DATAS_NEW.ADMINGCDS();
    });
});
var DATAS_NEW;
(function (DATAS_NEW) {
    var selsdktype, selsdktype2, selsdktype3;
    var datatable, datatable2, datatable3, datatable4, datatable5;
    var dataheader, dataheader2, dataheader3, dataheader4, dataheader5;
    var dataitem, dataitem2, dataitem3, dataitem4, dataitem5;
    function loadData() {
        $("#timestart").val(new Date().toLocaleDateString());
        $("#timeend").val(new Date().toLocaleDateString());
        $("#timestart2").val(new Date().toLocaleDateString());
        $("#timeend2").val(new Date().toLocaleDateString());
        $("#timestart3").val(new Date().toLocaleDateString());
        $("#timeend3").val(new Date().toLocaleDateString());
        $("#timestart4").val(new Date().toLocaleDateString());
        $("#timeend4").val(new Date().toLocaleDateString());
        $("#timestart5").val(new Date().toLocaleDateString());
        $("#timeend5").val(new Date().toLocaleDateString());
        selsdktype = document.getElementById("selsdktype");
        selsdktype2 = document.getElementById("selsdktype2");
        selsdktype3 = document.getElementById("selsdktype3");
        datatable = document.getElementById("datatable");
        dataheader = document.getElementById("dataheader");
        dataitem = document.getElementById("dataitem");
        datatable2 = document.getElementById("datatable2");
        dataheader2 = document.getElementById("dataheader2");
        dataitem2 = document.getElementById("dataitem2");
        datatable3 = document.getElementById("datatable3");
        dataheader3 = document.getElementById("dataheader3");
        dataitem3 = document.getElementById("dataitem3");
        datatable4 = document.getElementById("datatable4");
        dataheader4 = document.getElementById("dataheader4");
        dataitem4 = document.getElementById("dataitem4");
        datatable5 = document.getElementById("datatable5");
        dataheader5 = document.getElementById("dataheader5");
        dataitem5 = document.getElementById("dataitem5");
        dataitem.style.display = "none";
        dataitem2.style.display = "none";
        dataitem3.style.display = "none";
        dataitem4.style.display = "none";
        dataitem5.style.display = "none";
    }
    DATAS_NEW.loadData = loadData;
    function loadChannel() {
        var para = new ADMIN.ADMINGETSDKTYPELISTREQ();
        ADMIN.adminGetSdkTypeList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var opt = document.createElement("option");
                opt.value = dat.data[i].id.toString();
                opt.innerText = dat.data[i].sdkname;
                var opt2 = document.createElement("option");
                opt2.value = dat.data[i].id.toString();
                opt2.innerText = dat.data[i].sdkname;
                var opt3 = document.createElement("option");
                opt3.value = dat.data[i].id.toString();
                opt3.innerText = dat.data[i].sdkname;
                selsdktype.appendChild(opt);
                selsdktype2.appendChild(opt2);
                selsdktype3.appendChild(opt3);
            }
        });
    }
    DATAS_NEW.loadChannel = loadChannel;
    //创建一个datarow
    function NewRow(fields, defaultvalue) {
        var dat = {};
        for (var i = 0; i < fields.length; i++) {
            dat[fields[i]] = defaultvalue[i];
        }
        return dat;
    }
    function ADMINGCDS() {
        var para = new ADMIN.ADMINGAMECHARGEDATASEARCHREQ();
        para.appname = $("#txtappname").val();
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val() + " 23:59:59";
        var x = new Date(para.timeend.replace(/-/g, "/"));
        var y = new Date(para.timestart.replace(/-/g, "/"));
        var z = Math.ceil((x - y) / 1000 / 86400);
        if ((!!para.appname) && (para.appname != "蜀山世界")) {
            $("#table_add").css("display", "none");
        }
        else {
            $("#table_add").css("display", "");
        }
        ADMIN.adminGCDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var datfields = ["游戏", "新增", "日均活跃", "付费", "金额", "新付费用户", "新用户付费金额"];
            var defaultvalue = [null, 0, 0, 0, 0];
            //将数据转成map
            var _MAPCOUNT = (function () {
                function _MAPCOUNT() {
                    this.appid = 0; //游戏ID
                    this.appname = null; //游戏
                    this.account = 0; //活跃
                    this.regcount = 0; //新增
                    this.paycount = 0; //付费
                    this.paymoney = 0; //金额
                    this.newpayuser = 0; //新付费用户
                    this.newpaymoney = 0; //新用户付费金额
                    this.newpaypercent = null; //新用户付费率
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
                cou.paycount += data.rows[i]["paycount"];
                cou.paymoney += data.rows[i]["paysum"];
            }
            for (var i = 0; i < dat.regdata.rows.length; i++) {
                var data = dat.regdata;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data.rows[i]["appid"];
                    cou.appname = data.rows[i]["appname"];
                    map[mapkey] = cou;
                }
                cou.regcount = data.rows[i]["newuser"];
                cou.createroleuser = data.rows[i]["createroleuser"];
            }
            for (var i = 0; i < dat.acdata.rows.length; i++) {
                var data = dat.acdata;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data.rows[i]["appid"];
                    cou.appname = data.rows[i]["appname"];
                    map[mapkey] = cou;
                }
                cou.account = data.rows[i]["activeuser"];
            }
            for (var i = 0; i < dat.newpays.rows.length; i++) {
                var data = dat.newpays;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data.rows[i]["appid"];
                    cou.appname = data.rows[i]["appname"];
                    map[mapkey] = cou;
                }
                cou.newpayuser = data.rows[i]["newpayuser"];
                cou.newpaymoney = data.rows[i]["newpaymoney"];
            }
            var totalmoney = 0;
            var totalcreateuser = 0;
            var totalreg = 0;
            var rs = new ADMIN.DATATABLE();
            rs.fields = datfields;
            rs.rows = [];
            var allmoney = 0;
            var rol_add = 0, eq_activity = 0, rol_pay = 0, money_shushan = 0, new_pay = 0, new_pay_money = 0;
            for (var j in map) {
                var cou = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["游戏ID"] = cou.appid;
                row["游戏"] = cou.appname;
                row["新增"] = cou.regcount;
                row["日均活跃"] = Math.ceil(cou.account / z);
                row["付费"] = cou.paycount;
                if (cou.appname == '蜀山世界(越南)') {
                    row["金额"] = Math.ceil(cou.paymoney.toFixed(2) * 0.0002958);
                    row["新用户付费金额"] = Math.ceil(cou.newpaymoney.toFixed(2) * 0.0002958);
                }
                else {
                    row["金额"] = cou.paymoney.toFixed(2);
                    row["新用户付费金额"] = cou.newpaymoney.toFixed(2);
                }
                allmoney = allmoney + parseInt(row["金额"]);
                row["新付费用户"] = cou.newpayuser;
                if ((cou.appname == '蜀山世界(应用宝)') || (cou.appname == '蜀山世界(qq浏览器)') || (cou.appname == '蜀山世界(玩吧安卓)') || (cou.appname == '蜀山世界(玩吧ios)')) {
                    $("#table_add tbody").css("display", "block");
                    rol_add = rol_add + parseInt(row["新增"]);
                    eq_activity = eq_activity + parseInt(row["日均活跃"]);
                    rol_pay = rol_pay + parseInt(row["付费"]);
                    money_shushan = money_shushan + parseInt(row["金额"]);
                    new_pay = new_pay + parseInt(row["新付费用户"]);
                    new_pay_money = new_pay_money + parseInt(row["新用户付费金额"]);
                }
                rs.rows.push(row);
                totalmoney += cou.paymoney;
                totalreg += cou.regcount;
                totalcreateuser += cou.createroleuser;
            }
            $("#rol_add").text(rol_add);
            $("#eq_activity").text(eq_activity);
            $("#rol_pay").text(rol_pay);
            $("#money_shushan").text(money_shushan);
            $("#new_pay").text(new_pay);
            $("#new_pay_money").text(new_pay_money);
            $("#gtotalincome").text(allmoney);
            $("#gtotaluser").text(totalreg);
            $("#gtotalrole").text(totalcreateuser);
            ShowData(datatable, dataheader, dataitem, rs);
        });
    }
    DATAS_NEW.ADMINGCDS = ADMINGCDS;
    function ADMINCCDS() {
        var para = new ADMIN.ADMINCHANNELCHARGEDATASEARCHREQ();
        para.sdkname = $("#txtsdkname").val();
        para.timestart = $("#timestart2").val();
        para.timeend = $("#timeend2").val() + " 23:59:59";
        ADMIN.adminCCDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var datfields = ["渠道", "新增", "活跃", "付费", "创角", "金额"];
            var defaultvalue = [null, 0, 0, 0, 0, 0];
            //将数据转成map
            var _MAPCOUNT = (function () {
                function _MAPCOUNT() {
                    this.sdkid = 0; //渠道ID
                    this.sdkname = null; //渠道
                    this.account = 0; //活跃
                    this.regcount = 0; //新增
                    this.paycount = 0; //付费
                    this.paymoney = 0; //金额
                    this.createroleuser = 0; //新创角用户数
                }
                return _MAPCOUNT;
            }());
            ;
            var map = {}; //map[appid_sdkid]=_MAPCOUNT
            for (var i = 0; i < dat.paydata.rows.length; i++) {
                var data = dat.paydata;
                var mapkey = data.rows[i]["sdkid"] + "_" + data.rows[i]["sdkname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.sdkname = data.rows[i]["sdkname"];
                    map[mapkey] = cou;
                }
                cou.paycount += data.rows[i]["paycount"];
                cou.paymoney += data.rows[i]["paysum"];
                cou.sdkid = data.rows[i]["sdkid"];
            }
            for (var i = 0; i < dat.regdata.rows.length; i++) {
                var data = dat.regdata;
                var mapkey = data.rows[i]["sdkid"] + "_" + data.rows[i]["sdkname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.sdkname = data.rows[i]["sdkname"];
                    map[mapkey] = cou;
                }
                cou.regcount = data.rows[i]["newuser"];
                cou.createroleuser = data.rows[i]["createroleuser"];
            }
            for (var i = 0; i < dat.acdata.rows.length; i++) {
                var data = dat.acdata;
                var mapkey = data.rows[i]["sdkid"] + "_" + data.rows[i]["sdkname"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.sdkname = data.rows[i]["sdkname"];
                    map[mapkey] = cou;
                }
                cou.account = data.rows[i]["activeuser"];
            }
            var totalmoney = 0;
            var totalcreateuser = 0;
            var totalreg = 0;
            var totalpay = 0;
            var rs = new ADMIN.DATATABLE();
            rs.fields = datfields;
            rs.rows = [];
            for (var j in map) {
                var cou = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["渠道ID"] = cou.sdkid;
                row["渠道"] = cou.sdkname;
                row["新增"] = cou.regcount;
                row["活跃"] = cou.account;
                row["付费"] = cou.paycount;
                row["创角"] = cou.createroleuser;
                row["金额"] = cou.paymoney.toFixed(2);
                rs.rows.push(row);
                totalmoney += cou.paymoney;
                totalreg += cou.regcount;
                totalcreateuser += cou.createroleuser;
                totalpay += cou.paycount;
            }
            $("#stotalincome").text(totalmoney.toFixed(2));
            $("#stotaluser").text(totalreg);
            $("#stotalrole").text(totalcreateuser);
            $("#stotalpay").text(totalpay);
            ShowData(datatable2, dataheader2, dataitem2, rs);
        });
    }
    DATAS_NEW.ADMINCCDS = ADMINCCDS;
    function ADMINUCDS() {
        var para = new ADMIN.ADMINUSERCHARGEDATASEARCHREQ();
        para.appname = $("#txtappname2").val();
        para.sdkid = selsdktype.value;
        para.timestart = $("#timestart3").val();
        para.timeend = $("#timeend3").val() + " 23:59:59";
        ADMIN.adminUCDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var datfields = ["游戏 ", "渠道 ", "订单ID", "用户ID", "商品名称", "支付金额", "支付时间", "状态", "渠道交易单号"];
            var defaultvalue = [null, null, null, null, null, null, null, null, null];
            //将数据转成map
            var _MAPCOUNT = (function () {
                function _MAPCOUNT() {
                    this.appname = ""; //游戏名
                    this.sdkname = ""; //渠道名
                    this.payid = ""; //订单ID
                    this.userid = ""; //用户ID
                    this.goodsname = ""; //商品名称
                    this.paymony = ""; //支付金额
                    this.paytime = ""; //支付时间
                    this.status = ""; //状态
                    this.tradeno = ""; //渠道交易单号
                }
                return _MAPCOUNT;
            }());
            ;
            var map = {}; //map[appid_sdkid]=_MAPCOUNT
            for (var i = 0; i < dat.data.rows.length; i++) {
                var data = dat.data;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["渠道ID"];
                var cou = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    map[mapkey] = cou;
                }
                cou.appname = data.rows[i]["游戏"];
                cou.sdkname = data.rows[i]["渠道"];
                cou.payid = data.rows[i]["订单ID"];
                cou.userid = data.rows[i]["用户ID"];
                cou.goodsname = data.rows[i]["商品名称"];
                cou.paymony = data.rows[i]["支付金额"];
                cou.paytime = data.rows[i]["支付时间"];
                cou.status = data.rows[i]["状态"];
                cou.tradeno = data.rows[i]["渠道交易单号"];
            }
            var rs = new ADMIN.DATATABLE();
            rs.fields = datfields;
            rs.rows = [];
            for (var j in map) {
                var cou = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["游戏 "] = cou.appname;
                row["渠道 "] = cou.sdkname;
                row["订单ID"] = cou.payid;
                if (cou.userid == null) {
                    row["用户ID"] = cou.userid;
                }
                else {
                    row["用户ID"] = (cou.userid).substr(0, 10);
                }
                row["商品名称"] = cou.goodsname;
                row["支付金额"] = cou.paymony;
                row["支付时间"] = new Date(cou.paytime).toLocaleDateString();
                row["状态"] = cou.status;
                if (cou.tradeno == null) {
                    row["渠道交易单号"] = cou.tradeno;
                }
                else {
                    row["渠道交易单号"] = (cou.tradeno).substr(0, 20);
                }
                rs.rows.push(row);
            }
            ShowData(datatable3, dataheader3, dataitem3, rs);
        });
    }
    DATAS_NEW.ADMINUCDS = ADMINUCDS;
    function ADMINGDDS() {
        var para = new ADMIN.ADMINGAMEDATADETAILREQ();
        var sdkid = $('#selsdktype2').val();
        var appid = utils.getStorage("MANAGE_APPID", "sessionStorage");
        para.timestart = $("#timestart4").val();
        para.timeend = $("#timeend4").val() + " 23:59:59";
        if (sdkid === null || sdkid === "")
            sdkid = null;
        else
            sdkid = parseInt(sdkid);
        para.sdkid = sdkid;
        para.appid = appid;
        ADMIN.adminGDDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            $("#gdtotalincome").text(dat.income.toFixed(2));
            $("#gdtotaluser").text(dat.newuser.toFixed(0));
            $("#gdtotalacuser").text(dat.activeuser.toFixed(0));
            $("#gdtotalpayuser").text(dat.payuser.toFixed(0));
            $("#gdtotalpaypercent").text(((dat.payrate) * 100).toFixed(2) + "%");
            $("#gdtotalarpu").text((dat.arpu).toFixed(3));
            $("#gdtotalarppu").text((dat.arppu).toFixed(3));
            var datfields = ["日期", "收入", "新增用户", "活跃用户", "付费用户", "付费率", "ARPU", "ARPPU", "渠道 "];
            var defaultvalue = [null, 0, 0, 0, 0, 0, null, null, null];
            var _MAPCOUNT = (function () {
                function _MAPCOUNT() {
                    this.newuser = 0;
                    this.totaluser = 0;
                    this.activeuser = 0;
                    this.incometoday = 0;
                    this.incometotal = 0; //到today当天累计充值
                    this.payuser = 0;
                    this.payusertotal = 0; //到today当天累计充值用户
                    this.newpayuser = 0; //新安装付费用户
                    this.newpaymoney = 0; //新安装付费金额
                }
                return _MAPCOUNT;
            }());
            ;
            var map = {}; //map[日期_appid_sdkid]=_MAPCOUNT
            var totalusermap = {}; //临时变量，保存每日总用户数
            function getTotaluser(appid, sdkid) {
                for (var i = 0; i < dat.totalusers.length; i++) {
                    if (dat.totalusers[i].appid == appid && dat.totalusers[i].sdkid == sdkid)
                        return dat.totalusers[i].totaluser;
                }
                return 0;
            }
            var incometotalmap = {}; //临时变量，保存每日总收入
            function getIncometotal(appid, sdkid) {
                for (var i = 0; i < dat.incometotals.length; i++) {
                    if (dat.incometotals[i].appid == appid && dat.incometotals[i].sdkid == sdkid)
                        return dat.incometotals[i].incometotal;
                }
                return 0;
            }
            var sdktypes = {};
            for (var i = 0; i < dat.sdktypes.length; i++) {
                sdktypes[dat.sdktypes[i].id] = dat.sdktypes[i].sdkname;
            }
            sdktypes[0] = "5玩";
            for (var i = 0; i < dat.newusers.length; i++) {
                var data = dat.newusers[i];
                var mapkey = data.today + "_" + data.appid + "_" + data.sdkid;
                var cou_1 = map[mapkey];
                if (!cou_1) {
                    cou_1 = new _MAPCOUNT();
                    cou_1.appid = data.appid;
                    cou_1.sdkid = data.sdkid;
                    cou_1.today = data.today;
                    map[mapkey] = cou_1;
                }
                cou_1.newuser = data.newuser;
                if (!totalusermap[cou_1.sdkid]) {
                    totalusermap[cou_1.sdkid] = getTotaluser(cou_1.appid, cou_1.sdkid) + cou_1.newuser;
                }
                else {
                    totalusermap[cou_1.sdkid] += cou_1.newuser;
                }
                cou_1.totaluser = totalusermap[cou_1.sdkid];
            }
            for (var i = 0; i < dat.activeusers.length; i++) {
                var data2 = dat.activeusers[i];
                var mapkey = data2.today + "_" + data2.appid + "_" + data2.sdkid;
                var cou_2 = map[mapkey];
                if (!cou_2) {
                    cou_2 = new _MAPCOUNT();
                    cou_2.appid = data2.appid;
                    cou_2.sdkid = data2.sdkid;
                    cou_2.today = data2.today;
                    map[mapkey] = cou_2;
                }
                cou_2.activeuser = data2.activeuser;
            }
            for (var i = 0; i < dat.incometodays.length; i++) {
                var data3 = dat.incometodays[i];
                var mapkey = data3.today + "_" + data3.appid + "_" + data3.sdkid;
                var cou_3 = map[mapkey];
                if (!cou_3) {
                    cou_3 = new _MAPCOUNT();
                    cou_3.appid = data3.appid;
                    cou_3.sdkid = data3.sdkid;
                    cou_3.today = data3.today;
                    map[mapkey] = cou_3;
                }
                cou_3.incometoday = data3.incometoday;
                if (!incometotalmap[cou_3.sdkid]) {
                    incometotalmap[cou_3.sdkid] = getIncometotal(cou_3.appid, cou_3.sdkid) + cou_3.incometoday;
                }
                else {
                    incometotalmap[cou_3.sdkid] += cou_3.incometoday;
                }
                cou_3.incometotal = incometotalmap[cou_3.sdkid];
            }
            for (var i = 0; i < dat.payusers.length; i++) {
                var data4 = dat.payusers[i];
                var mapkey = data4.today + "_" + data4.appid + "_" + data4.sdkid;
                var cou_4 = map[mapkey];
                if (!cou_4) {
                    cou_4 = new _MAPCOUNT();
                    cou_4.appid = data4.appid;
                    cou_4.sdkid = data4.sdkid;
                    cou_4.today = data4.today;
                    map[mapkey] = cou_4;
                }
                cou_4.payuser = data4.payuser;
            }
            for (var i = 0; i < dat.newpays.length; i++) {
                var data6 = dat.newpays[i];
                var mapkey = data6.today + "_" + data6.appid + "_" + data6.sdkid;
                var cou_5 = map[mapkey];
                if (!cou_5) {
                    cou_5 = new _MAPCOUNT();
                    cou_5.appid = data6.appid;
                    cou_5.sdkid = data6.sdkid;
                    cou_5.today = data6.today;
                    map[mapkey] = cou_5;
                }
                cou_5.newpayuser = data6.newpayuser;
                cou_5.newpaymoney = data6.newpaymoney;
            }
            //将map转数组
            var rs = new ADMIN.DATATABLE();
            rs.fields = datfields;
            rs.rows = [];
            for (var j in map) {
                var cou = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["日期"] = new Date(cou.today).toLocaleDateString();
                row["收入"] = cou.incometoday;
                row["新增用户"] = cou.newuser;
                row["活跃用户"] = cou.activeuser;
                row["付费用户"] = cou.payuser;
                row["付费率"] = ((cou.activeuser == 0) ? 0 : cou.payuser * 100 / cou.activeuser).toFixed(2) + "%";
                row["ARPU"] = (cou.incometoday == 0) ? 0 : (cou.incometoday / cou.activeuser).toFixed(3);
                row["ARPPU"] = (cou.incometoday == 0) ? 0 : (cou.incometoday / cou.payuser).toFixed(3);
                row["渠道 "] = (cou.sdkid == null) ? "5玩" : sdktypes[cou.sdkid];
                rs.rows.push(row);
            }
            rs.rows.sort(function (a, b) {
                if (a["日期"] > b["日期"]) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
            ShowData(datatable4, dataheader4, dataitem4, rs);
        });
    }
    DATAS_NEW.ADMINGDDS = ADMINGDDS;
    function ADMINGKDS() {
        var para = new ADMIN.ADMINGAMEKEEPDATADETAILREQ();
        var appid = utils.getStorage("MANAGE_APPID", "sessionStorage");
        var sdkid = $('#selsdktype3').val();
        ;
        para.timestart = $("#timestart5").val();
        para.timeend = $("#timeend5").val() + " 23:59:59";
        if (sdkid === null || sdkid === "")
            sdkid = null;
        else
            sdkid = parseInt(sdkid);
        para.sdkid = sdkid;
        para.appid = appid;
        ADMIN.adminGKDS(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data;
            var datfields = ["日期", "新增用户", "1日留存", "2日留存", "3日留存", "4日留存", "5日留存", "6日留存", "7日留存", "14日留存", "21日留存", "30日留存", "渠道 "];
            var defaultvalue = [null, 0, null, null, null, null, null, null, null, null, null, null];
            var _MAPCOUNT = (function () {
                function _MAPCOUNT() {
                    this.activeuser = 0;
                    this.newuser = 0;
                    this.keeps1 = "0%"; //次留
                    this.keeps2 = "0%"; //次留
                    this.keeps3 = "0%"; //次留
                    this.keeps4 = "0%"; //次留
                    this.keeps5 = "0%"; //次留
                    this.keeps6 = "0%"; //次留
                    this.keeps7 = "0%"; //次留
                    this.keeps14 = "0%"; //次留
                    this.keeps21 = "0%"; //次留
                    this.keeps30 = "0%"; //次留
                }
                return _MAPCOUNT;
            }());
            ;
            var map = {}; //map[日期_appid_sdkid]=_MAPCOUNT
            var sdktypes = {};
            for (var i = 0; i < dat.sdktypes.length; i++) {
                sdktypes[dat.sdktypes[i].id] = dat.sdktypes[i].sdkname;
            }
            sdktypes[0] = "5玩";
            for (var i = 0; i < dat.activeusers.length; i++) {
                var data = dat.activeusers[i];
                var mapkey = data.today + "_" + data.appid + "_" + data.sdkid;
                var cou_6 = map[mapkey];
                if (!cou_6) {
                    cou_6 = new _MAPCOUNT();
                    cou_6.appid = data.appid;
                    cou_6.sdkid = data.sdkid;
                    cou_6.today = data.today;
                    map[mapkey] = cou_6;
                }
                cou_6.activeuser = data.activeuser;
            }
            for (var i = 0; i < dat.newusers.length; i++) {
                var data2 = dat.newusers[i];
                var mapkey = data2.today + "_" + data2.appid + "_" + data2.sdkid;
                var cou_7 = map[mapkey];
                if (!cou_7) {
                    cou_7 = new _MAPCOUNT();
                    cou_7.appid = data2.appid;
                    cou_7.sdkid = data2.sdkid;
                    cou_7.today = data2.today;
                    map[mapkey] = cou_7;
                }
                cou_7.newuser = data2.newuser;
            }
            for (var i = 0; i < dat.keeps.length; i++) {
                var data3 = dat.keeps[i];
                var mapkey = data3.today + "_" + data3.appid + "_" + data3.sdkid;
                var cou_8 = map[mapkey];
                if (!cou_8) {
                    cou_8 = new _MAPCOUNT();
                    cou_8.appid = data3.appid;
                    cou_8.sdkid = data3.sdkid;
                    cou_8.today = data3.today;
                    map[mapkey] = cou_8;
                }
                cou_8.keeps1 = ((cou_8.newuser == 0) ? 0 : data3.keeps1 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps2 = ((cou_8.newuser == 0) ? 0 : data3.keeps2 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps3 = ((cou_8.newuser == 0) ? 0 : data3.keeps3 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps4 = ((cou_8.newuser == 0) ? 0 : data3.keeps4 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps5 = ((cou_8.newuser == 0) ? 0 : data3.keeps5 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps6 = ((cou_8.newuser == 0) ? 0 : data3.keeps6 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps7 = ((cou_8.newuser == 0) ? 0 : data3.keeps7 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps14 = ((cou_8.newuser == 0) ? 0 : data3.keeps14 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps21 = ((cou_8.newuser == 0) ? 0 : data3.keeps21 * 100 / cou_8.newuser).toFixed(2) + "%";
                cou_8.keeps30 = ((cou_8.newuser == 0) ? 0 : data3.keeps30 * 100 / cou_8.newuser).toFixed(2) + "%";
            }
            //将map转数组
            var rs = new ADMIN.DATATABLE();
            rs.rows = [];
            rs.fields = datfields;
            for (var j in map) {
                var cou = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["日期"] = new Date(cou.today).toLocaleDateString();
                //row["活跃用户"] = cou.activeuser;
                row["新增用户"] = cou.newuser;
                row["1日留存"] = cou.keeps1;
                row["2日留存"] = cou.keeps2;
                row["3日留存"] = cou.keeps3;
                row["4日留存"] = cou.keeps4;
                row["5日留存"] = cou.keeps5;
                row["6日留存"] = cou.keeps6;
                row["7日留存"] = cou.keeps7;
                row["14日留存"] = cou.keeps14;
                row["21日留存"] = cou.keeps21;
                row["30日留存"] = cou.keeps30;
                row["渠道 "] = (cou.sdkid == null) ? "5玩" : sdktypes[cou.sdkid];
                rs.rows.push(row);
            }
            rs.rows.sort(function (a, b) {
                if (a["日期"] > b["日期"]) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
            ShowData(datatable5, dataheader5, dataitem5, rs);
        });
    }
    DATAS_NEW.ADMINGKDS = ADMINGKDS;
    function onselsdk(docInput, docSelect) {
        var sdkname = docInput.value;
        if (sdkname != "") {
            var op = docSelect.firstElementChild;
            while (op) {
                if (op.innerText.indexOf(sdkname) >= 0) {
                    docSelect.value = op.value;
                    break;
                }
                op = op.nextElementSibling;
            }
        }
    }
    DATAS_NEW.onselsdk = onselsdk;
    function showGameDataDetail(appid, appname) {
        utils.setStorage("MANAGE_APPID", appid, "sessionStorage");
        utils.setStorage("MANAGE_APPNAME", appname, "sessionStorage");
        $("#datatitle").text("详细数据(" + appname + ")");
        $(".data_detail").show();
        $(".game_detail").siblings().hide();
        ADMINGDDS();
    }
    DATAS_NEW.showGameDataDetail = showGameDataDetail;
    function onSearch(day) {
        if (day) {
            var today = new Date();
            $("#timeend5").val(today.toLocaleDateString());
            today.setDate(today.getDate() - day + 1);
            $("#timestart5").val(today.toLocaleDateString());
        }
        ADMINGKDS();
    }
    DATAS_NEW.onSearch = onSearch;
    function ShowData(datatable, dataheader, dataitem, data) {
        $(dataheader).find("*").remove();
        while (datatable.childElementCount > 1)
            datatable.removeChild(datatable.lastElementChild);
        //生成列头
        for (var i = 0; i < data.fields.length; i++) {
            var th = document.createElement("th");
            switch (data.fields[i]) {
                case "游戏":
                    var input = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_all";
                    th.appendChild(input);
                    break;
                case "渠道":
                    var input = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_all";
                    th.appendChild(input);
                    break;
                case "游戏 ":
                    var input = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_all";
                    th.appendChild(input);
                    break;
            }
            var span = document.createElement("span");
            span.textContent = data.fields[i];
            if (data.fields[i] == "游戏" || data.fields[i] == "渠道" || data.fields[i] == "游戏 ") {
                th.style.textAlign = "left";
            }
            else {
                th.style.textAlign = "center";
            }
            th.appendChild(span);
            dataheader.appendChild(th);
        }
        //生成数据
        for (var j = 0; j < data.rows.length; j++) {
            $(dataitem).find("*").remove();
            var tr = dataitem.cloneNode(true);
            tr.style.display = "";
            for (var i = 0; i < data.fields.length; i++) {
                var td = document.createElement("td");
                if (data.fields[i] == "游戏" || data.fields[i] == "渠道" || data.fields[i] == "游戏 ") {
                    var input = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_child";
                    td.appendChild(input);
                    var span = document.createElement("span");
                    span.textContent = data.rows[j][data.fields[i]];
                    if (data.fields[i] == "游戏") {
                        span.style.color = "#00AEEF";
                        span.style.cursor = "pointer";
                        span.style.borderBottom = "1px solid #00AEEF";
                        span.setAttribute("onclick", "DATAS_NEW.showGameDataDetail('" + data.rows[j]["游戏ID"] + "','" + data.rows[j]["游戏"] + "')");
                    }
                    if (data.fields[i] == "渠道") {
                        span.style.color = "#00AEEF";
                        span.style.cursor = "pointer";
                        span.style.borderBottom = "1px solid #00AEEF";
                        span.setAttribute("title", data.rows[j]["渠道ID"]);
                        span.setAttribute("class", 'profit_id');
                    }
                    td.style.textAlign = "left";
                    //   td.style.width = "10%";
                    td.appendChild(span);
                }
                else {
                    td.style.textAlign = "center";
                    td.innerText = data.rows[j][data.fields[i]];
                }
                if (!!data.rows[j]["游戏"] || !!data.rows[j]["渠道"] || !!data.rows[j]["游戏 "] || !!data.rows[j]["日期"]) {
                    tr.appendChild(td);
                }
            }
            datatable.appendChild(tr);
            //全选or全部取消
            $('.checkbox_all').click(function () {
                if ($(this).is(":checked")) {
                    $('.checkbox_child').prop("checked", true);
                }
                else {
                    $('.checkbox_child').prop("checked", false);
                }
            });
        }
        $(".profit_id").click(function () {
            window.location.href = 'channelDetail.html?sdkid=' + $(this).attr("title");
        });
    }
    DATAS_NEW.ShowData = ShowData;
})(DATAS_NEW || (DATAS_NEW = {}));
//# sourceMappingURL=datas.js.map