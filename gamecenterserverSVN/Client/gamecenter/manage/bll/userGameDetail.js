$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        USERGAMEDETAIL.loadGame(null, null, null);
    });
});
var USERGAMEDETAIL;
(function (USERGAMEDETAIL) {
    var servicetable;
    var serviceitem;
    var serviceitems = [];
    function loadGame(userid, time, tablename) {
        servicetable = document.getElementById("tableservice");
        serviceitem = document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLLISTUSERGAMEREQ();
        para.userid = utils.getQueryString("userid");
        para.time = time;
        para.tablename = tablename;
        ADMIN.adminGetAllUserGame(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat = resp.data;
            var data = dat.usergamelist;
            for (var i = 0; i < data.length; i++) {
                var userinfo = data[i];
                var item = serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#user_id").text(userinfo.sdkuserid);
                if (userinfo.name != null && userinfo.name != '') {
                    $(item).find("#user_nick").text(userinfo.name);
                }
                $(item).find("#user_phone").text(userinfo.regip);
                $(item).find("#user_weixin").text(new Date(userinfo.createtime).toLocaleString());
                servicetable.appendChild(item);
                serviceitems.push(item);
            }
        });
    }
    USERGAMEDETAIL.loadGame = loadGame;
})(USERGAMEDETAIL || (USERGAMEDETAIL = {}));
//# sourceMappingURL=userGameDetail.js.map