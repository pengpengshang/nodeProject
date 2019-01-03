$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        EDITTABLE.editTable();
    });
});
var EDITTABLE;
(function (EDITTABLE) {
    var data;
    var game_name_edit, //游戏名称
    endTime, //开服时间
    server_name_edit; //服务器名称
    var bag_type; //礼包类型
    var para = sessionStorage["ADMINCPAPPINFO"];
    data = JSON.parse(para);
    function editTable() {
        game_name_edit = document.getElementById("game_name_edit");
        endTime = document.getElementById("recDate2");
        server_name_edit = document.getElementById("server_name_edit");
        if (para) {
            $("#game_name_edit").val(data.appname);
            $("#recDate2").val(new Date(data.openTime).toLocaleString());
            $("#server_name_edit").val(data.serverName);
        }
    }
    EDITTABLE.editTable = editTable;
    function saveEditTable() {
        var para = new ADMIN.ADMINADDOPENTABLEREQ();
        para.gamename = $("#game_name_edit").val();
        para.openTime = $("#recDate2").val();
        para.serverName = $("#server_name_edit").val();
        para.id = data.id.toString();
        ADMIN.adminAddTable(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功");
            console.log("修改成功");
            history.back();
        });
    }
    EDITTABLE.saveEditTable = saveEditTable;
})(EDITTABLE || (EDITTABLE = {}));
//# sourceMappingURL=edittable.js.map