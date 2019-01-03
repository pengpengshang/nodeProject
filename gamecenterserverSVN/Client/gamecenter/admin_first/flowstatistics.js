///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminflowstatistics.LoadData();
    });
});
var adminflowstatistics;
(function (adminflowstatistics) {
    var data;
    var datatable;
    var dataitem;
    function LoadData() {
        $("#timestart").val(new Date().toLocaleDateString());
        $("#timeend").val(new Date().toLocaleDateString());
        datatable = document.getElementById("datatable");
        dataitem = document.getElementById("dataitem");
        dataitem.style.display = "none";
    }
    adminflowstatistics.LoadData = LoadData;
    function onSearch(day) {
        if (day) {
            var today = new Date();
            $("#timeend").val(today.toLocaleDateString());
            today.setDate(today.getDate() - day + 1);
            $("#timestart").val(today.toLocaleDateString());
        }
        var para = new ADMIN.ADMINGETFLOWSTATISTICSREQ();
        var timestart = new Date($("#timestart").val());
        timestart.setHours(0, 0, 0, 0);
        para.timestart = timestart.getTime();
        var timeend = new Date($("#timeend").val());
        timeend.setHours(23, 59, 59);
        para.timeend = timeend.getTime();
        ADMIN.adminGetFlowStatistics(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            data = resp.data.data;
            ShowData();
        });
    }
    adminflowstatistics.onSearch = onSearch;
    function ShowData() {
        while (datatable.children.length > 1)
            datatable.removeChild(datatable.lastElementChild);
        //合并每天数据
        var dict = {};
        for (var i = 0; i < data.length; i++) {
            var key = (!data[i].channel) ? " " : data[i].channel;
            var dat = dict[key];
            if (!dat) {
                dat = utils.deepCopy(data[i]);
                dict[key] = dat;
            }
            else {
                dat.opencount += data[i].opencount;
                dat.paymoney += data[i].paymoney;
                dat.payusercount += data[i].payusercount;
                dat.regcount += data[i].regcount;
            }
        }
        for (var j in dict) {
            dat = dict[j];
            var item = dataitem.cloneNode(true);
            item.style.display = "";
            item.querySelector("#channel").textContent = (!dat.channel) ? "" : dat.channel;
            item.querySelector("#opencount").textContent = dat.opencount.toString();
            item.querySelector("#regcount").textContent = dat.regcount.toString();
            item.querySelector("#payusercount").textContent = dat.payusercount.toString();
            item.querySelector("#paymoney").textContent = dat.paymoney.toFixed(2);
            datatable.appendChild(item);
        }
    }
})(adminflowstatistics || (adminflowstatistics = {}));
//# sourceMappingURL=flowstatistics.js.map