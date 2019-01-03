$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        VIPQQ.initVIPQQ();
    });
});
module VIPQQ {
       var table_game_name: HTMLInputElement = <any>document.getElementById("table_game_name");
    var servicetable: HTMLTableElement;
    var serviceitem: HTMLTableRowElement;
    var serviceitems: HTMLTableRowElement[] = [];
    export function initVIPQQ() {//加载VIPQQ列表
        servicetable = <any>document.getElementById("tableservice");
        serviceitem = <any>document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para: ADMIN.ADMINGETALLVIPQQREQ = new ADMIN.ADMINGETALLVIPQQREQ();
        ADMIN.getAllVipQQ(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat: ADMIN.ADMINGETALLVIPQQRESP = resp.data;
            var data = dat.vipqqlist;
           
            for (var i = 0; i < data.length; i++) {
                var tableinfo: ADMIN.ADMINGETALLVIPQQINFO = data[i];
                var item: HTMLTableRowElement = <any>serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#table_game_name").attr("value", tableinfo.qqnum);
                $(item).find("#table_game_name").attr("class","input_num"+i);
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
    export function updateVipQQ(vipQQId) {//更新VIPqq
        var list_game = $("#gamelist option:selected");
        var para: ADMIN.ADMINADDVIPQQREQ = new ADMIN.ADMINADDVIPQQREQ();
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
        ADMIN.updateVipQQ(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }

}  