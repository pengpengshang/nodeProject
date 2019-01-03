$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        VIPQQ.initVIPQQ();
    });
});
var VIPQQ;
(function (VIPQQ) {
    var table_game_name = document.getElementById("table_game_name");
    var servicetable;
    var serviceitem;
    var serviceitems = [];
    function initVIPQQ() {
        servicetable = document.getElementById("tableservice");
        serviceitem = document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLVIPQQREQ();
        ADMIN.getAllVipQQ(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat = resp.data;
            var data = dat.vipqqlist;
            for (var i = 0; i < data.length; i++) {
                var tableinfo = data[i];
                var item = serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#table_game_name").attr("value", tableinfo.qqnum);
                $(item).find("#table_game_name").attr("class", "input_num" + i);
                $(item).find("#open_table_name").text(tableinfo.qqname);
                $(item).find("#vipqq_save").attr("title", tableinfo.id);
                $(item).find("#table_add_time").text(new Date(tableinfo.createtime).toLocaleString());
                servicetable.appendChild(item);
                serviceitems.push(item);
                $(item).find("#vipqq_save").click(function () {
                    var vipQQId = $(this).attr("title");
                    VIPQQ.updateVipQQ(vipQQId);
                });
            }
        });
    }
    VIPQQ.initVIPQQ = initVIPQQ;
    function updateVipQQ(vipQQId) {
        var list_game = $("#gamelist option:selected");
        var para = new ADMIN.ADMINADDVIPQQREQ();
        para.id = vipQQId;
        if (para.id == 1) {
            para.qqnum = $(".input_num0").val();
        }
        if (para.id == 2) {
            para.qqnum = $(".input_num1").val();
        }
        if (para.id == 3) {
            para.qqnum = $(".input_num2").val();
        }
        ADMIN.updateVipQQ(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    VIPQQ.updateVipQQ = updateVipQQ;
})(VIPQQ || (VIPQQ = {}));
//# sourceMappingURL=vipQQ.js.map