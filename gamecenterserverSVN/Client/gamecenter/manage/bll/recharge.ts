$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        RECHARGE_NEW.initData();
        RECHARGE_NEW.loadTodayData(0);
    })
});
module RECHARGE_NEW {
    var selmoneyrange: HTMLSelectElement, selmoneyrange2: HTMLSelectElement, selmoneyrange3: HTMLSelectElement, selmoneyrange4: HTMLSelectElement;
    var datatable: HTMLTableElement, datatable2: HTMLTableElement, datatable3: HTMLTableElement, datatable4: HTMLTableElement;
    var dataheader: HTMLTableRowElement, dataheader2: HTMLTableRowElement, dataheader3: HTMLTableRowElement, dataheader4: HTMLTableRowElement;
    var dataitem: HTMLTableRowElement, dataitem2: HTMLTableRowElement, dataitem3: HTMLTableRowElement, dataitem4: HTMLTableRowElement;
    export function initData() {
        selmoneyrange = <any>document.getElementById("moneyrange");
        datatable = <any>document.getElementById("datatable");
        dataitem = <any>document.getElementById("dataitem");
        dataheader = <any>document.getElementById("dataheader");
        selmoneyrange2 = <any>document.getElementById("moneyrange2");
        datatable2 = <any>document.getElementById("datatable2");
        dataitem2 = <any>document.getElementById("dataitem2");
        dataheader2 = <any>document.getElementById("dataheader2");
        selmoneyrange3 = <any>document.getElementById("moneyrange3");
        datatable3 = <any>document.getElementById("datatable3");
        dataitem3 = <any>document.getElementById("dataitem3");
        dataheader3 = <any>document.getElementById("dataheader3");
        selmoneyrange4 = <any>document.getElementById("moneyrange4");
        datatable4 = <any>document.getElementById("datatable4");
        dataitem4 = <any>document.getElementById("dataitem4");
        dataheader4 = <any>document.getElementById("dataheader4");
        $("#timestart").val(new Date().toLocaleDateString());
        $("#timeend").val(new Date().toLocaleDateString());
        $("#timestart2").val(new Date().toLocaleDateString());
        $("#timeend2").val(new Date().toLocaleDateString());
        $("#timestart3").val(new Date().toLocaleDateString());
        $("#timeend3").val(new Date().toLocaleDateString());
        $("#timestart4").val(new Date().toLocaleDateString());
        $("#timeend4").val(new Date().toLocaleDateString());
    }
    export function loadData(para: ADMIN.ADMINPLAFORMUSERCHARGEREQ2, cb: (dat: ADMIN.DATATABLE) => void) {
        ADMIN.adminChargeRankData_New(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat: ADMIN.DATATABLE = resp.data.data;
            for (var i = 0; i < dat.rows.length; i++) {
                var row = dat.rows[i];
                row["首次充值时间"] = new Date(dat.rows[i].首次充值时间).toLocaleString();
                row["最后充值时间"] = new Date(dat.rows[i].最后充值时间).toLocaleString();
                row["注册时间"] = new Date(dat.rows[i].注册时间).toLocaleString();
            }
            cb(dat);
        })
    }

    export function loadTodayData(flags) {//今日充值排行
        dataitem.style.display = "none";
        var para: ADMIN.ADMINPLAFORMUSERCHARGEREQ2 = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val() + " 23:59:59";
        para.moneyrang = <any>selmoneyrange.value;
        para.userId = $("#txtuserid").val();
        loadData(para, (dat) => {
            $("#tnumb").text(dat.rows.length);
            ShowData(datatable, dataheader, dataitem, dat);
        });
    }
    export function loadWeekData(flags) {//本周充值排行
        dataitem2.style.display = "none";
        var para: ADMIN.ADMINPLAFORMUSERCHARGEREQ2 = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart2").val();
        para.timeend = $("#timeend2").val() + " 23:59:59";
        para.moneyrang = <any>selmoneyrange2.value;
        para.userId = $("#txtuserid2").val();
        loadData(para, (dat) => {
            $("#wnumb").text(dat.rows.length);
            ShowData(datatable2, dataheader2, dataitem2, dat);
        });
    }
    export function loadMonthData(flags) {//本月充值排行
        dataitem3.style.display = "none";
        var para: ADMIN.ADMINPLAFORMUSERCHARGEREQ2 = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart3").val();
        para.timeend = $("#timeend3").val() + " 23:59:59";
        para.moneyrang = <any>selmoneyrange3.value;
        para.userId = $("#txtuserid3").val();
        loadData(para, (dat) => {
            $("#mnumb").text(dat.rows.length);
            ShowData(datatable3, dataheader3, dataitem3, dat);
        });
    }
    export function loadTotalData(flags) {//全部充值排行
        dataitem4.style.display = "none";
        var para: ADMIN.ADMINPLAFORMUSERCHARGEREQ2 = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart4").val();
        para.timeend = $("#timeend4").val() + " 23:59:59";
        para.moneyrang = <any>selmoneyrange4.value;
        para.userId = $("#txtuserid4").val();
        loadData(para, (dat) => {
            $("#ttnumb").text(dat.rows.length);
            ShowData(datatable4, dataheader4, dataitem4, dat);
        });
    }
    export function redirectUrl(para1, para2) {
        var url = "userdetail.shtml?userid=" + para1 + "&is5wanuser=" + para2;
        SDKUTIL.ShowIFrame(url, false, (ev, divbgpage, iframe) => {
            window.addEventListener("message", function onmsg(ev) {
                switch (ev.data.type) {
                    case "close":
                        {
                            SDKUTIL.RemoveIFrame(divbgpage, iframe);
                            window.removeEventListener("message", onmsg, false);
                            break;
                        }
                }
            }, false);
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

    function ShowData(datatable, dataheader, dataitem, data: ADMIN.DATATABLE) {
        $(dataheader).find("*").remove();
        while (datatable.childElementCount > 1) datatable.removeChild(datatable.lastElementChild);
        //生成列头
        for (var i = 0; i < data.fields.length; i++) {
            if (data.fields[i] == "渠道") {
                continue;
            }
            var th: HTMLTableCellElement = <any>document.createElement("th");
            if (data.fields[i] == "用户") {
                th.style.textAlign = "left";
            } else {
                th.style.textAlign = "center";
            }
            th.innerText = data.fields[i];
            
            dataheader.appendChild(th);
        }
        //生成数据
        for (var j = 0; j < data.rows.length; j++) {
            $(dataitem).find("*").remove();
            var tr: HTMLTableRowElement = <any>dataitem.cloneNode(true);
            tr.style.display = "";
            for (var i = 0; i < data.fields.length; i++) {
                if (data.fields[i] == "渠道") {
                    continue;
                }
                var td: HTMLTableCellElement = document.createElement("td");
                if (data.fields[i] == "用户") {
                    var span: HTMLSpanElement = document.createElement("span");
                    span.textContent = (data.rows[j][data.fields[i]]).substr(0, 20);
                    span.style.color = "#00AEEF";
                    span.style.cursor = "pointer";
                    span.style.borderBottom = "1px solid #00AEEF";
                    span.setAttribute("onclick", "RECHARGE_NEW.redirectUrl('" + data.rows[j].用户 + "','" + (data.rows[i].渠道 ? 0 : 1) + "')");
                    td.style.textAlign = "left";
                    td.appendChild(span);
                } else {
                    td.style.textAlign = "center";
                    td.innerText = data.rows[j][data.fields[i]];
                }
                if (!!data.rows[j]["用户"]) {
                    tr.appendChild(td);
                }
            }
            datatable.appendChild(tr);
        }
    }
} 