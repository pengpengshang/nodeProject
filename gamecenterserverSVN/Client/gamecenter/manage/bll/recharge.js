$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        RECHARGE_NEW.initData();
        RECHARGE_NEW.loadTodayData(0);
    });
});
var RECHARGE_NEW;
(function (RECHARGE_NEW) {
    var selmoneyrange, selmoneyrange2, selmoneyrange3, selmoneyrange4;
    var datatable, datatable2, datatable3, datatable4;
    var dataheader, dataheader2, dataheader3, dataheader4;
    var dataitem, dataitem2, dataitem3, dataitem4;
    function initData() {
        selmoneyrange = document.getElementById("moneyrange");
        datatable = document.getElementById("datatable");
        dataitem = document.getElementById("dataitem");
        dataheader = document.getElementById("dataheader");
        selmoneyrange2 = document.getElementById("moneyrange2");
        datatable2 = document.getElementById("datatable2");
        dataitem2 = document.getElementById("dataitem2");
        dataheader2 = document.getElementById("dataheader2");
        selmoneyrange3 = document.getElementById("moneyrange3");
        datatable3 = document.getElementById("datatable3");
        dataitem3 = document.getElementById("dataitem3");
        dataheader3 = document.getElementById("dataheader3");
        selmoneyrange4 = document.getElementById("moneyrange4");
        datatable4 = document.getElementById("datatable4");
        dataitem4 = document.getElementById("dataitem4");
        dataheader4 = document.getElementById("dataheader4");
        $("#timestart").val(new Date().toLocaleDateString());
        $("#timeend").val(new Date().toLocaleDateString());
        $("#timestart2").val(new Date().toLocaleDateString());
        $("#timeend2").val(new Date().toLocaleDateString());
        $("#timestart3").val(new Date().toLocaleDateString());
        $("#timeend3").val(new Date().toLocaleDateString());
        $("#timestart4").val(new Date().toLocaleDateString());
        $("#timeend4").val(new Date().toLocaleDateString());
    }
    RECHARGE_NEW.initData = initData;
    function loadData(para, cb) {
        ADMIN.adminChargeRankData_New(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var dat = resp.data.data;
            for (var i = 0; i < dat.rows.length; i++) {
                var row = dat.rows[i];
                row["首次充值时间"] = new Date(dat.rows[i].首次充值时间).toLocaleString();
                row["最后充值时间"] = new Date(dat.rows[i].最后充值时间).toLocaleString();
                row["注册时间"] = new Date(dat.rows[i].注册时间).toLocaleString();
            }
            cb(dat);
        });
    }
    RECHARGE_NEW.loadData = loadData;
    function loadTodayData(flags) {
        dataitem.style.display = "none";
        var para = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart").val();
        para.timeend = $("#timeend").val() + " 23:59:59";
        para.moneyrang = selmoneyrange.value;
        para.userId = $("#txtuserid").val();
        loadData(para, function (dat) {
            $("#tnumb").text(dat.rows.length);
            ShowData(datatable, dataheader, dataitem, dat);
        });
    }
    RECHARGE_NEW.loadTodayData = loadTodayData;
    function loadWeekData(flags) {
        dataitem2.style.display = "none";
        var para = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart2").val();
        para.timeend = $("#timeend2").val() + " 23:59:59";
        para.moneyrang = selmoneyrange2.value;
        para.userId = $("#txtuserid2").val();
        loadData(para, function (dat) {
            $("#wnumb").text(dat.rows.length);
            ShowData(datatable2, dataheader2, dataitem2, dat);
        });
    }
    RECHARGE_NEW.loadWeekData = loadWeekData;
    function loadMonthData(flags) {
        dataitem3.style.display = "none";
        var para = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart3").val();
        para.timeend = $("#timeend3").val() + " 23:59:59";
        para.moneyrang = selmoneyrange3.value;
        para.userId = $("#txtuserid3").val();
        loadData(para, function (dat) {
            $("#mnumb").text(dat.rows.length);
            ShowData(datatable3, dataheader3, dataitem3, dat);
        });
    }
    RECHARGE_NEW.loadMonthData = loadMonthData;
    function loadTotalData(flags) {
        dataitem4.style.display = "none";
        var para = new ADMIN.ADMINPLAFORMUSERCHARGEREQ2();
        para.flags = flags;
        para.timestart = $("#timestart4").val();
        para.timeend = $("#timeend4").val() + " 23:59:59";
        para.moneyrang = selmoneyrange4.value;
        para.userId = $("#txtuserid4").val();
        loadData(para, function (dat) {
            $("#ttnumb").text(dat.rows.length);
            ShowData(datatable4, dataheader4, dataitem4, dat);
        });
    }
    RECHARGE_NEW.loadTotalData = loadTotalData;
    function redirectUrl(para1, para2) {
        var url = "userdetail.shtml?userid=" + para1 + "&is5wanuser=" + para2;
        SDKUTIL.ShowIFrame(url, false, function (ev, divbgpage, iframe) {
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
    RECHARGE_NEW.redirectUrl = redirectUrl;
    //创建一个datarow
    function NewRow(fields, defaultvalue) {
        var dat = {};
        for (var i = 0; i < fields.length; i++) {
            dat[fields[i]] = defaultvalue[i];
        }
        return dat;
    }
    function ShowData(datatable, dataheader, dataitem, data) {
        $(dataheader).find("*").remove();
        while (datatable.childElementCount > 1)
            datatable.removeChild(datatable.lastElementChild);
        //生成列头
        for (var i = 0; i < data.fields.length; i++) {
            if (data.fields[i] == "渠道") {
                continue;
            }
            var th = document.createElement("th");
            if (data.fields[i] == "用户") {
                th.style.textAlign = "left";
            }
            else {
                th.style.textAlign = "center";
            }
            th.innerText = data.fields[i];
            dataheader.appendChild(th);
        }
        //生成数据
        for (var j = 0; j < data.rows.length; j++) {
            $(dataitem).find("*").remove();
            var tr = dataitem.cloneNode(true);
            tr.style.display = "";
            for (var i = 0; i < data.fields.length; i++) {
                if (data.fields[i] == "渠道") {
                    continue;
                }
                var td = document.createElement("td");
                if (data.fields[i] == "用户") {
                    var span = document.createElement("span");
                    span.textContent = (data.rows[j][data.fields[i]]).substr(0, 20);
                    span.style.color = "#00AEEF";
                    span.style.cursor = "pointer";
                    span.style.borderBottom = "1px solid #00AEEF";
                    span.setAttribute("onclick", "RECHARGE_NEW.redirectUrl('" + data.rows[j].用户 + "','" + (data.rows[i].渠道 ? 0 : 1) + "')");
                    td.style.textAlign = "left";
                    td.appendChild(span);
                }
                else {
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
})(RECHARGE_NEW || (RECHARGE_NEW = {}));
//# sourceMappingURL=recharge.js.map