$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        DATAS_NEW.loadData();
        DATAS_NEW.loadChannel();
        DATAS_NEW.ADMINGCDS();
    })
});
module DATAS_NEW {
    var selsdktype: HTMLSelectElement, selsdktype2: HTMLSelectElement,selsdktype3: HTMLSelectElement;
    var datatable: HTMLTableElement, datatable2: HTMLTableElement, datatable3: HTMLTableElement, datatable4: HTMLTableElement, datatable5: HTMLTableElement;
    var dataheader: HTMLTableRowElement, dataheader2: HTMLTableRowElement, dataheader3: HTMLTableRowElement, dataheader4: HTMLTableRowElement, dataheader5: HTMLTableRowElement;
    var dataitem: HTMLTableRowElement, dataitem2: HTMLTableRowElement, dataitem3: HTMLTableRowElement, dataitem4: HTMLTableRowElement, dataitem5: HTMLTableRowElement;
    export function loadData() {
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
        selsdktype = <any>document.getElementById("selsdktype");
        selsdktype2 = <any>document.getElementById("selsdktype2");
        selsdktype3 = <any>document.getElementById("selsdktype3");
        datatable = <any>document.getElementById("datatable");
        dataheader = <any>document.getElementById("dataheader");
        dataitem = <any>document.getElementById("dataitem");
        datatable2 = <any>document.getElementById("datatable2");
        dataheader2 = <any>document.getElementById("dataheader2");
        dataitem2 = <any>document.getElementById("dataitem2");
        datatable3 = <any>document.getElementById("datatable3");
        dataheader3 = <any>document.getElementById("dataheader3");
        dataitem3 = <any>document.getElementById("dataitem3");
        datatable4 = <any>document.getElementById("datatable4");
        dataheader4 = <any>document.getElementById("dataheader4");
        dataitem4 = <any>document.getElementById("dataitem4");
        datatable5 = <any>document.getElementById("datatable5");
        dataheader5 = <any>document.getElementById("dataheader5");
        dataitem5 = <any>document.getElementById("dataitem5");
        dataitem.style.display = "none";
        dataitem2.style.display = "none";
        dataitem3.style.display = "none";
        dataitem4.style.display = "none";
        dataitem5.style.display = "none";
    }

    export function loadChannel() {
        var para = new ADMIN.ADMINGETSDKTYPELISTREQ();
        ADMIN.adminGetSdkTypeList(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGETSDKTYPELISTRESP = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var opt: HTMLOptionElement = <any>document.createElement("option");
                opt.value = dat.data[i].id.toString();
                opt.innerText = dat.data[i].sdkname;
                var opt2: HTMLOptionElement = <any>document.createElement("option");
                opt2.value = dat.data[i].id.toString();
                opt2.innerText = dat.data[i].sdkname;
                var opt3: HTMLOptionElement = <any>document.createElement("option");
                opt3.value = dat.data[i].id.toString();
                opt3.innerText = dat.data[i].sdkname;
                selsdktype.appendChild(opt);
                selsdktype2.appendChild(opt2);
                selsdktype3.appendChild(opt3);
            }
        });
    }

    //创建一个datarow
    function NewRow(fields: string[], defaultvalue: any[]): any {
        var dat: any = {};
        for (var i = 0; i < fields.length; i++) {
            dat[fields[i]] = defaultvalue[i];
        }
        return dat;
    }

    export function ADMINGCDS() {//获取游戏充值数据
        var para = new ADMIN.ADMINGAMECHARGEDATASEARCHREQ();
        para.appname = $("#txtappname").val();
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val() + " 23:59:59";
        var x = <any>new Date(para.timeend.replace(/-/g, "/"));
        var y = <any>new Date(para.timestart.replace(/-/g, "/"));
        var z = Math.ceil((x - y) / 1000 / 86400);

		if ((!!para.appname) && (para.appname !="蜀山世界")) {
            $("#table_add").css("display", "none");
        } else {
            $("#table_add").css("display", "");
        }


        ADMIN.adminGCDS(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGAMECHARGEDATASEARCHRESP = resp.data;
            var datfields: string[] = ["游戏", "新增", "日均活跃", "付费", "金额","新付费用户","新用户付费金额"];
            var defaultvalue: any[] = [null, 0, 0, 0, 0];
            //将数据转成map
            class _MAPCOUNT {
                appid: number = 0;//游戏ID
                appname: string = null;//游戏
                account: number = 0;//活跃
                regcount: number = 0;//新增
                paycount: number = 0;//付费
                paymoney: number = 0;//金额
                newpayuser: number = 0;//新付费用户
                newpaymoney: number = 0;//新用户付费金额
                newpaypercent: string = null;//新用户付费率
                createroleuser: number = 0;//新创角用户数
            };

            var map: any = {};//map[appid_sdkid]=_MAPCOUNT
            for (var i = 0; i < dat.paydata.rows.length; i++) {
                var data: ADMIN.DATATABLE = dat.paydata;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou: _MAPCOUNT = map[mapkey];
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
                var data: ADMIN.DATATABLE = dat.regdata;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou: _MAPCOUNT = map[mapkey];
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
                var data: ADMIN.DATATABLE = dat.acdata;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data.rows[i]["appid"];
                    cou.appname = data.rows[i]["appname"];
                    map[mapkey] = cou;
                }
                cou.account = data.rows[i]["activeuser"];
            }
            for (var i = 0; i < dat.newpays.rows.length; i++) {
                var data: ADMIN.DATATABLE = dat.newpays;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["appname"];
                var cou: _MAPCOUNT = map[mapkey];
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
			var rol_add = 0,eq_activity = 0, rol_pay = 0,money_shushan = 0,new_pay = 0,new_pay_money = 0;
            for (var j in map) {
                var cou: _MAPCOUNT = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["游戏ID"] = cou.appid;
                row["游戏"] = cou.appname;
                row["新增"] = cou.regcount;
                row["日均活跃"] = Math.ceil(cou.account/z);
                row["付费"] = cou.paycount;
                if (cou.appname == '蜀山世界(越南)') {
                    row["金额"] = Math.ceil((<any>cou.paymoney.toFixed(2)) * 0.0002958);
					 row["新用户付费金额"] = Math.ceil((<any>cou.newpaymoney.toFixed(2)) * 0.0002958);
                } else {
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

    export function ADMINCCDS() {//获取渠道充值数据
        var para = new ADMIN.ADMINCHANNELCHARGEDATASEARCHREQ();
        para.sdkname = $("#txtsdkname").val();
        para.timestart = $("#timestart2").val();
        para.timeend = $("#timeend2").val() + " 23:59:59";
        ADMIN.adminCCDS(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINCHANNELCHARGEDATASEARCHRESP = resp.data;
            var datfields: string[] = ["渠道", "新增", "活跃", "付费", "创角", "金额"];
            var defaultvalue: any[] = [null, 0, 0, 0, 0, 0];
            //将数据转成map
            class _MAPCOUNT {
				
				
				sdkid: number = 0;//渠道ID
                sdkname: string = null;//渠道
                account: number = 0;//活跃
                regcount: number = 0;//新增
                paycount: number = 0;//付费
                paymoney: number = 0;//金额
                createroleuser: number = 0;//新创角用户数
            };

            var map: any = {};//map[appid_sdkid]=_MAPCOUNT
            for (var i = 0; i < dat.paydata.rows.length; i++) {
                var data: ADMIN.DATATABLE = dat.paydata;
                var mapkey = data.rows[i]["sdkid"] + "_" + data.rows[i]["sdkname"];
                var cou: _MAPCOUNT = map[mapkey];
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
                var data: ADMIN.DATATABLE = dat.regdata;
                var mapkey = data.rows[i]["sdkid"] + "_" + data.rows[i]["sdkname"];
                var cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.sdkname = data.rows[i]["sdkname"];
                    map[mapkey] = cou;
                }
                cou.regcount = data.rows[i]["newuser"];
                cou.createroleuser = data.rows[i]["createroleuser"];
            }
            for (var i = 0; i < dat.acdata.rows.length; i++) {
                var data: ADMIN.DATATABLE = dat.acdata;
                var mapkey = data.rows[i]["sdkid"] + "_" + data.rows[i]["sdkname"];
                var cou: _MAPCOUNT = map[mapkey];
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
                var cou: _MAPCOUNT = map[j];
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
    export function ADMINUCDS() {//用户充值查询
        var para = new ADMIN.ADMINUSERCHARGEDATASEARCHREQ();
        para.appname = $("#txtappname2").val();
        para.sdkid = <any>selsdktype.value;
        para.timestart = $("#timestart3").val();
        para.timeend = $("#timeend3").val() + " 23:59:59";
        ADMIN.adminUCDS(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINUSERCHARGEDATASEARCHRESP = resp.data;
            var datfields: string[] = ["游戏 ", "渠道 ", "订单ID", "用户ID", "商品名称", "支付金额", "支付时间", "状态", "渠道交易单号"];
            var defaultvalue: any[] = [null, null, null, null, null, null, null, null, null];
            //将数据转成map
            class _MAPCOUNT {
                appname: string = "";//游戏名
                sdkname: string = "";//渠道名
                payid: string = "";//订单ID
                userid: string = "";//用户ID
                goodsname: string = "";//商品名称
                paymony: string = "";//支付金额
                paytime: string = "";//支付时间
                status: string = "";//状态
                tradeno: string = "";//渠道交易单号
            };

            var map: any = {};//map[appid_sdkid]=_MAPCOUNT
            for (var i = 0; i < dat.data.rows.length; i++) {
                var data: ADMIN.DATATABLE = dat.data;
                var mapkey = data.rows[i]["appid"] + "_" + data.rows[i]["渠道ID"];
                var cou: _MAPCOUNT = map[mapkey];
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
                var cou: _MAPCOUNT = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["游戏 "] = cou.appname;
                row["渠道 "] = cou.sdkname;
                row["订单ID"] = cou.payid;
                if (cou.userid == null) {
                    row["用户ID"] = cou.userid;
                } else {
                    row["用户ID"] = (cou.userid).substr(0,10);
                }
               
                
                row["商品名称"] = cou.goodsname;
                row["支付金额"] = cou.paymony;
                row["支付时间"] = new Date(cou.paytime).toLocaleDateString();
                row["状态"] = cou.status;

                if (cou.tradeno == null) {
                    row["渠道交易单号"] = cou.tradeno;
                } else {
                    row["渠道交易单号"] = (cou.tradeno).substr(0,20);
                }

                
                rs.rows.push(row);
            }
            ShowData(datatable3, dataheader3, dataitem3, rs);
        });
    }

    export function ADMINGDDS() {//获取游戏详细数据
        var para: ADMIN.ADMINGAMEDATADETAILREQ = new ADMIN.ADMINGAMEDATADETAILREQ();
        var sdkid = $('#selsdktype2').val();
        var appid = utils.getStorage("MANAGE_APPID","sessionStorage");
        para.timestart = $("#timestart4").val();
        para.timeend = $("#timeend4").val() + " 23:59:59";
        if (sdkid === null || sdkid === "") sdkid = null;
        else sdkid = parseInt(sdkid);
        para.sdkid = sdkid;
        para.appid = appid;
        ADMIN.adminGDDS(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGAMEDATADETAILRESP = resp.data;
            $("#gdtotalincome").text(dat.income.toFixed(2));
            $("#gdtotaluser").text(dat.newuser.toFixed(0));
            $("#gdtotalacuser").text(dat.activeuser.toFixed(0));
            $("#gdtotalpayuser").text(dat.payuser.toFixed(0));
            $("#gdtotalpaypercent").text(((dat.payrate) * 100).toFixed(2) + "%");
            $("#gdtotalarpu").text((dat.arpu).toFixed(3));
            $("#gdtotalarppu").text((dat.arppu).toFixed(3));
            var datfields: string[] = ["日期", "收入", "新增用户", "活跃用户", "付费用户", "付费率", "ARPU", "ARPPU", "渠道 "];
            var defaultvalue: any[] = [null, 0, 0, 0, 0, 0, null, null, null];
            class _MAPCOUNT {
                appid: number;
                sdkid: number;
                today: number;
                newuser: number = 0;
                totaluser: number = 0;
                activeuser: number = 0;
                incometoday: number = 0;
                incometotal: number = 0;//到today当天累计充值
                payuser: number = 0;
                payusertotal: number = 0;//到today当天累计充值用户
                newpayuser: number = 0;//新安装付费用户
                newpaymoney: number = 0;//新安装付费金额
            };
            var map: any = {};//map[日期_appid_sdkid]=_MAPCOUNT

            var totalusermap: { [sdkid: number]: number } = {};//临时变量，保存每日总用户数
            function getTotaluser(appid, sdkid): number {
                for (var i = 0; i < dat.totalusers.length; i++) {
                    if (dat.totalusers[i].appid == appid && dat.totalusers[i].sdkid == sdkid) return dat.totalusers[i].totaluser;
                }
                return 0;
            }
            var incometotalmap: { [sdkid: number]: number } = {};//临时变量，保存每日总收入
            function getIncometotal(appid, sdkid): number {
                for (var i = 0; i < dat.incometotals.length; i++) {
                    if (dat.incometotals[i].appid == appid && dat.incometotals[i].sdkid == sdkid) return dat.incometotals[i].incometotal;
                }
                return 0;
            }
            var sdktypes: { [id: number]: string } = {};
            for (var i = 0; i < dat.sdktypes.length; i++) {
                sdktypes[dat.sdktypes[i].id] = dat.sdktypes[i].sdkname;
            }
            sdktypes[0] = "5玩";
            for (var i = 0; i < dat.newusers.length; i++) {
                let data = dat.newusers[i];
                let mapkey = data.today + "_" + data.appid + "_" + data.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data.appid;
                    cou.sdkid = data.sdkid;
                    cou.today = data.today;
                    map[mapkey] = cou;
                }
                cou.newuser = data.newuser;
                if (!totalusermap[cou.sdkid]) {
                    totalusermap[cou.sdkid] = getTotaluser(cou.appid, cou.sdkid) + cou.newuser;
                }
                else {
                    totalusermap[cou.sdkid] += cou.newuser;
                }
                cou.totaluser = totalusermap[cou.sdkid];
            }
            for (var i = 0; i < dat.activeusers.length; i++) {
                let data2 = dat.activeusers[i];
                let mapkey = data2.today + "_" + data2.appid + "_" + data2.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data2.appid;
                    cou.sdkid = data2.sdkid;
                    cou.today = data2.today;
                    map[mapkey] = cou;
                }
                cou.activeuser = data2.activeuser;
            }
            for (var i = 0; i < dat.incometodays.length; i++) {
                let data3 = dat.incometodays[i];
                let mapkey = data3.today + "_" + data3.appid + "_" + data3.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data3.appid;
                    cou.sdkid = data3.sdkid;
                    cou.today = data3.today;
                    map[mapkey] = cou;
                }
                cou.incometoday = data3.incometoday;
                if (!incometotalmap[cou.sdkid]) {
                    incometotalmap[cou.sdkid] = getIncometotal(cou.appid, cou.sdkid) + cou.incometoday;
                }
                else {
                    incometotalmap[cou.sdkid] += cou.incometoday;
                }
                cou.incometotal = incometotalmap[cou.sdkid];
            }
            for (var i = 0; i < dat.payusers.length; i++) {
                let data4 = dat.payusers[i];
                let mapkey = data4.today + "_" + data4.appid + "_" + data4.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data4.appid;
                    cou.sdkid = data4.sdkid;
                    cou.today = data4.today;
                    map[mapkey] = cou;
                }
                cou.payuser = data4.payuser;
            }
            for (var i = 0; i < dat.newpays.length; i++) {
                let data6 = dat.newpays[i];
                let mapkey = data6.today + "_" + data6.appid + "_" + data6.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data6.appid;
                    cou.sdkid = data6.sdkid;
                    cou.today = data6.today;
                    map[mapkey] = cou;
                }
                cou.newpayuser = data6.newpayuser;
                cou.newpaymoney = data6.newpaymoney;
            }
            //将map转数组
            var rs = new ADMIN.DATATABLE();
            rs.fields = datfields;
            rs.rows = [];
            for (var j in map) {
                var cou: _MAPCOUNT = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["日期"]= new Date(cou.today).toLocaleDateString();
                row["收入"]= cou.incometoday;
                row["新增用户"]= cou.newuser;
                row["活跃用户"]= cou.activeuser;
                row["付费用户"]= cou.payuser;
                row["付费率"]= ((cou.activeuser == 0) ? 0 : cou.payuser * 100 / cou.activeuser).toFixed(2) + "%";
                row["ARPU"]= (cou.incometoday == 0) ? 0 : (cou.incometoday / cou.activeuser).toFixed(3);
                row["ARPPU"]= (cou.incometoday == 0) ? 0 : (cou.incometoday / cou.payuser).toFixed(3);
                row["渠道 "]= (cou.sdkid == null) ? "5玩" : sdktypes[cou.sdkid];
                rs.rows.push(row);
            }
            rs.rows.sort((a, b) => {
                if (a["日期"] > b["日期"]) {
                    return -1;
                } else {
                    return 1;
                }
            });
            ShowData(datatable4, dataheader4, dataitem4, rs);
        });
    }

    export function ADMINGKDS(){//获取游戏留存数据
        var para: ADMIN.ADMINGAMEKEEPDATADETAILREQ = new ADMIN.ADMINGAMEKEEPDATADETAILREQ();
        var appid = utils.getStorage("MANAGE_APPID", "sessionStorage");
        var sdkid = $('#selsdktype3').val();;
        para.timestart = $("#timestart5").val();
        para.timeend = $("#timeend5").val() + " 23:59:59";
        if (sdkid === null || sdkid === "") sdkid = null;
        else sdkid = parseInt(sdkid);
        para.sdkid = sdkid;
        para.appid = appid;
        ADMIN.adminGKDS(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGAMEKEEPDATADETAILRESP = resp.data;
            var datfields: string[] = ["日期", "新增用户", "1日留存", "2日留存", "3日留存", "4日留存", "5日留存", "6日留存", "7日留存", "14日留存", "21日留存", "30日留存", "渠道 "];
            var defaultvalue: any[] = [null, 0, null, null, null, null, null, null, null, null, null, null];
            class _MAPCOUNT {
                appid: number;
                sdkid: number;
                today: number;
                activeuser: number = 0;
                newuser: number = 0;
                keeps1: string = "0%";//次留
                keeps2: string = "0%";//次留
                keeps3: string = "0%";//次留
                keeps4: string = "0%";//次留
                keeps5: string = "0%";//次留
                keeps6: string = "0%";//次留
                keeps7: string = "0%";//次留
                keeps14: string = "0%";//次留
                keeps21: string = "0%";//次留
                keeps30: string = "0%";//次留
            };
            var map: any = {};//map[日期_appid_sdkid]=_MAPCOUNT
            var sdktypes: { [id: number]: string } = {};
            for (var i = 0; i < dat.sdktypes.length; i++) {
                sdktypes[dat.sdktypes[i].id] = dat.sdktypes[i].sdkname;
            }
            sdktypes[0] = "5玩";
            for (var i = 0; i < dat.activeusers.length; i++) {
                let data = dat.activeusers[i];
                let mapkey = data.today + "_" + data.appid + "_" + data.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data.appid;
                    cou.sdkid = data.sdkid;
                    cou.today = data.today;
                    map[mapkey] = cou;
                }
                cou.activeuser = data.activeuser;
            }
            for (var i = 0; i < dat.newusers.length; i++) {
                let data2 = dat.newusers[i];
                let mapkey = data2.today + "_" + data2.appid + "_" + data2.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data2.appid;
                    cou.sdkid = data2.sdkid;
                    cou.today = data2.today;
                    map[mapkey] = cou;
                }
                cou.newuser = data2.newuser;
            }
            for (var i = 0; i < dat.keeps.length; i++) {
                let data3 = dat.keeps[i];
                let mapkey = data3.today + "_" + data3.appid + "_" + data3.sdkid;
                let cou: _MAPCOUNT = map[mapkey];
                if (!cou) {
                    cou = new _MAPCOUNT();
                    cou.appid = data3.appid;
                    cou.sdkid = data3.sdkid;
                    cou.today = data3.today;
                    map[mapkey] = cou;
                }
                cou.keeps1 = ((cou.newuser == 0) ? 0 : data3.keeps1 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps2 = ((cou.newuser == 0) ? 0 : data3.keeps2 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps3 = ((cou.newuser == 0) ? 0 : data3.keeps3 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps4 = ((cou.newuser == 0) ? 0 : data3.keeps4 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps5 = ((cou.newuser == 0) ? 0 : data3.keeps5 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps6 = ((cou.newuser == 0) ? 0 : data3.keeps6 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps7 = ((cou.newuser == 0) ? 0 : data3.keeps7 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps14 = ((cou.newuser == 0) ? 0 : data3.keeps14 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps21 = ((cou.newuser == 0) ? 0 : data3.keeps21 * 100 / cou.newuser).toFixed(2) + "%";
                cou.keeps30 = ((cou.newuser == 0) ? 0 : data3.keeps30 * 100 / cou.newuser).toFixed(2) + "%";
            }
            //将map转数组
            var rs = new ADMIN.DATATABLE();
            rs.rows = [];
            rs.fields = datfields;
            for (var j in map) {
                var cou: _MAPCOUNT = map[j];
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
            rs.rows.sort((a, b) => {
                if (a["日期"] > b["日期"]) {
                    return -1;
                } else {
                    return 1;
                }
            });
            ShowData(datatable5, dataheader5, dataitem5, rs);
        });
    }

    export function onselsdk(docInput:HTMLInputElement,docSelect:HTMLSelectElement) {//渠道简单筛选
        var sdkname = docInput.value;
        if (sdkname != "") {
            var op: HTMLOptionElement = <any>docSelect.firstElementChild;
            while (op) {
                if (op.innerText.indexOf(sdkname) >= 0) {
                    docSelect.value = op.value;
                    break;
                }
                op = <any>op.nextElementSibling;
            }
        }
    }

    export function showGameDataDetail(appid, appname) {//显示游戏详细页
        utils.setStorage("MANAGE_APPID", appid,"sessionStorage");
        utils.setStorage("MANAGE_APPNAME", appname, "sessionStorage");
        $("#datatitle").text("详细数据(" + appname + ")");
        $(".data_detail").show();
        $(".game_detail").siblings().hide();
        ADMINGDDS();
    }

    export function onSearch(day?: number) {//根据相差时间查询，day相差天数
        if (day) {
            var today = new Date();
            $("#timeend5").val(today.toLocaleDateString());
            today.setDate(today.getDate() - day + 1);
            $("#timestart5").val(today.toLocaleDateString());
        }
        ADMINGKDS();
    }

    export function ShowData(datatable, dataheader, dataitem, data: ADMIN.DATATABLE) {
        $(dataheader).find("*").remove();
        while (datatable.childElementCount > 1) datatable.removeChild(datatable.lastElementChild);
        //生成列头
        for (var i = 0; i < data.fields.length; i++) {
            var th: HTMLTableCellElement = <any>document.createElement("th");
            switch (data.fields[i]) {
                case "游戏":
                    var input: HTMLInputElement = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_all";
                    th.appendChild(input);
                    break;
                case "渠道":
                    var input: HTMLInputElement = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_all";
                    th.appendChild(input);
                    break;
                case "游戏 ":
                    var input: HTMLInputElement = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_all";
                    th.appendChild(input);
                    break;
            }
            var span: HTMLSpanElement = document.createElement("span");
            span.textContent = data.fields[i];
            if (data.fields[i] == "游戏" || data.fields[i] == "渠道" || data.fields[i] == "游戏 ") {
                th.style.textAlign = "left";
              // th.style.width = "10%";
            } else {
                th.style.textAlign = "center";
               //th.style.width = "500px";
            }
            th.appendChild(span);
            dataheader.appendChild(th);
        }
        //生成数据
        for (var j = 0; j < data.rows.length; j++) {
            $(dataitem).find("*").remove();
            var tr: HTMLTableRowElement = <any>dataitem.cloneNode(true);
            tr.style.display = "";
            for (var i = 0; i < data.fields.length; i++) {
                var td: HTMLTableCellElement = document.createElement("td");
                if (data.fields[i] == "游戏" || data.fields[i] == "渠道" || data.fields[i] == "游戏 ") {
                    var input: HTMLInputElement = document.createElement("input");
                    input.type = "checkbox";
                    input.className = "checkbox_child";
                    td.appendChild(input);
                    var span: HTMLSpanElement = document.createElement("span");
                    span.textContent = data.rows[j][data.fields[i]];
                    if (data.fields[i] == "游戏") {
                        span.style.color = "#00AEEF";
                        span.style.cursor = "pointer";
                        span.style.borderBottom = "1px solid #00AEEF"
                        span.setAttribute("onclick", "DATAS_NEW.showGameDataDetail('" + data.rows[j]["游戏ID"] + "','" + data.rows[j]["游戏"] + "')");
                    }
					
					
					
					 if (data.fields[i] == "渠道") {
                        span.style.color = "#00AEEF";
                        span.style.cursor = "pointer";
                        span.style.borderBottom = "1px solid #00AEEF"
                        span.setAttribute("title", data.rows[j]["渠道ID"]);
                        span.setAttribute("class",'profit_id');
                        
                    }
					
					
					
                    td.style.textAlign = "left";
                 //   td.style.width = "10%";
                    td.appendChild(span);
                } else {
                    td.style.textAlign = "center";
                    
                    td.innerText = data.rows[j][data.fields[i]];
                  //  td.style.width = "10%";
                }
                if (!!data.rows[j]["游戏"] || !!data.rows[j]["渠道"] || !!data.rows[j]["游戏 "] || !!data.rows[j]["日期"]) {
                    tr.appendChild(td);
                }
                ////重新发送支付回调
                //if (data.fields[i] == "状态" && data.rows[j]["状态"] == "已支付但通知CP失败") {
                //    var btn: HTMLButtonElement = <any>document.createElement("button");
                //    btn.innerText = "再次发送";
                //    td.appendChild(btn);
                //    (function (payid: string, td: HTMLTableCellElement) {
                //        btn.onclick = (ev) => {
                //            var para = new ADMIN.ADMINSENDPAYCALLBACKREQ();
                //            para.payid = payid;
                //            ADMIN.adminSendPayCallback(para, resp => {
                //                if (resp.errno != 0) {
                //                    alert(resp.message);
                //                }
                //                else {
                //                    alert("发送成功");
                //                    td.innerText = "支付成功";
                //                }
                //            });
                //        };
                //    })(data.rows[j]["订单ID"], td);
                //}

            }
            datatable.appendChild(tr);
            //全选or全部取消
            $('.checkbox_all').click(function () {
                if ($(this).is(":checked")) {
                    $('.checkbox_child').prop("checked", true);
                } else {
                    $('.checkbox_child').prop("checked", false);
                }
            })
        }
		
		 $(".profit_id").click(function () {
            window.location.href = 'channelDetail.html?sdkid=' + $(this).attr("title");
        })
    }
}