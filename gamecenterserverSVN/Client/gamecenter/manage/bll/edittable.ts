$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        EDITTABLE.editTable();
    });
});
module EDITTABLE {
    var data: ADMIN.ADMINGETALLOPENTABLEINFO;
    var game_name_edit: HTMLInputElement,//游戏名称
        endTime: HTMLInputElement,//开服时间
        server_name_edit: HTMLInputElement;//服务器名称
       
    var bag_type: HTMLSelectElement;    //礼包类型
    var para = sessionStorage["ADMINCPAPPINFO"];
    data = JSON.parse(para);


    export function editTable() {//编辑开服表
        game_name_edit = <any>document.getElementById("game_name_edit");
        endTime = <any>document.getElementById("recDate2");
        server_name_edit = <any>document.getElementById("server_name_edit");
        if (para) {
            $("#game_name_edit").val(data.appname);
            $("#recDate2").val(new Date(data.openTime).toLocaleString());
            $("#server_name_edit").val(data.serverName);
        }
    }
    export function saveEditTable() {//保存table的信息
        var para: ADMIN.ADMINADDOPENTABLEREQ = new ADMIN.ADMINADDOPENTABLEREQ();
        para.gamename = $("#game_name_edit").val();
        para.openTime = $("#recDate2").val();
        para.serverName = $("#server_name_edit").val();
        para.id = data.id.toString();
        ADMIN.adminAddTable(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            console.log("修改成功");
            history.back();
        });
    }


} 