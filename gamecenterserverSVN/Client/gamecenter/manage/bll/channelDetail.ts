$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        CHANNELDETAIL.loadData();
        CHANNELDETAIL.ADMINGCDS();
    })
});
module CHANNELDETAIL {
    var datatable: HTMLTableElement;
    var dataheader: HTMLTableRowElement;
    var dataitem: HTMLTableRowElement;
    export function loadData() {
        $("#timestart").val(new Date().toLocaleDateString());
        $("#timeend").val(new Date().toLocaleDateString());
        datatable = <any>document.getElementById("datatable");
        dataheader = <any>document.getElementById("dataheader");
        dataitem = <any>document.getElementById("dataitem");      
        dataitem.style.display = "none";        
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
        para.sdkid = utils.getQueryString("sdkid");
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val() + " 23:59:59";
        var x = <any>new Date(para.timeend.replace(/-/g, "/"));
        var y = <any>new Date(para.timestart.replace(/-/g, "/"));
        var z = Math.ceil((x - y) / 1000 / 86400);

        if ((!!para.appname) && (para.appname != "蜀山世界")) {
            $("#table_add").css("display", "none");
        } else {
            $("#table_add").css("display", "");
        }

        ADMIN.adminChannelDetail(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.ADMINGAMECHARGEDATASEARCHRESP = resp.data;
            var datfields: string[] = ["游戏","渠道", "活跃", "付费","新增", "金额","渠道分成","渠道分成金额","cp分成"];
            var defaultvalue: any[] = [null, 0, 0, 0, 0];
            //将数据转成map
            class _MAPCOUNT {
                appid: number = 0;//游戏ID
                appname: string = null;//游戏
                channel: string = null;//渠道
                account: number = 0;//活跃
                paycount: number = 0;//付费
                paymoney: number = 0;//金额
                profit: string = null;//分成比例
                profitmoney: number = 0;//渠道分成金额
                newadd: number = 0;//新增用户
                cpprofit: string = null;//cp分成
               
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
                cou.channel = data.rows[i]["sdkname"];
                $("#channel_name").text(cou.channel);
                cou.profit = data.rows[i]["profit"];
                cou.cpprofit = data.rows[i]["cpprofit"];
                
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
                cou.newadd = data.rows[i]["newuser"];
            }


            var totalmoney = 0;
            var rs = new ADMIN.DATATABLE();
            rs.fields = datfields;
            rs.rows = [];
            var rol_add = 0, eq_activity = 0, rol_pay = 0, money_shushan = 0, new_pay = 0, new_pay_money = 0;
            for (var j in map) {
                var cou: _MAPCOUNT = map[j];
                var row = NewRow(rs.fields, defaultvalue);
                row["游戏ID"] = cou.appid;
                row["游戏"] = cou.appname;
                row["渠道"] = cou.channel;
                row["活跃"] = cou.account ;
                row["付费"] = cou.paycount;
                row["新增"] = cou.newadd;
                row["金额"] = cou.paymoney.toFixed(2);
                row["渠道分成"] = cou.profit;

                var channel_money = 0;
                if (cou.profit != null) {
                    var arr = cou.profit.split("-");
                    if (arr.length > 2) {
                        channel_money = channel_money + ((cou.paymoney - parseInt(arr[arr.length - 2].replace(/[^0-9]/ig, ""))) * parseInt(arr[arr.length - 1].replace(/[^0-9]/ig, "")) / 100);
                        for (var i = (arr.length - 2); i >= 2;) {
                            channel_money = channel_money + (parseInt(arr[i].replace(/[^0-9]/ig, "")) - parseInt(arr[i - 2].replace(/[^0-9]/ig, ""))) * parseInt(arr[i-1].replace(/[^0-9]/ig, ""))/100;
                            i = i - 2;
                        }
                    } else {
                        channel_money = cou.paymoney * parseInt(arr[1].replace(/[^0-9]/ig, ""))/100;
                    }

                    
                }
                row["渠道分成金额"] = channel_money;



                row["cp分成"] = cou.cpprofit;
                rs.rows.push(row);
                totalmoney += cou.paymoney;             
            }
            ShowData(datatable, dataheader, dataitem, rs);
        });
    }

    export function ShowData(datatable, dataheader, dataitem, data: ADMIN.DATATABLE) {
        $(dataheader).find("*").remove();
        while (datatable.childElementCount > 1) datatable.removeChild(datatable.lastElementChild);
        //生成列头
        for (var i = 0; i < data.fields.length; i++) {
            var th: HTMLTableCellElement = <any>document.createElement("th");
            var span: HTMLSpanElement = document.createElement("span");
            span.textContent = data.fields[i];

            if (data.fields[i] == "游戏") {
                th.style.textAlign = "left";
            } else {
                th.style.textAlign = "center";
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
                if (data.fields[i] == "游戏") {

                    var span: HTMLSpanElement = document.createElement("span");
                    span.textContent = data.rows[j][data.fields[i]];
                    
                    td.style.textAlign = "left";
                    td.appendChild(span);
                } else {
                    td.style.textAlign = "center";
                    td.innerText = data.rows[j][data.fields[i]];
                }
                if (!!data.rows[j]["游戏"] ) {
                    tr.appendChild(td);
                }
                

            }
            datatable.appendChild(tr);
   
        }
    }
}