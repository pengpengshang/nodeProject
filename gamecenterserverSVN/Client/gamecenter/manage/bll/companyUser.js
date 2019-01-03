$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        LISTUSER.loadUser(null, null);
    });
});
var LISTUSER;
(function (LISTUSER) {
    var servicetable;
    var serviceitem;
    var serviceitems = [];
    function loadUser(time, tablename) {
        servicetable = document.getElementById("tableservice");
        serviceitem = document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLLISTUSERREQ();
        para.time = $("#recDate").val();
        para.tablename = tablename;
        ADMIN.adminGetAllUser(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat = resp.data;
            var data = dat.userlist;
            for (var i = 0; i < data.length; i++) {
                var userinfo = data[i];
                var item = serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#user_id").text(userinfo.userid);
                if (userinfo.nickname != null && userinfo.nickname != '') {
                    $(item).find("#user_nick").text((userinfo.nickname).substr(0, 15));
                }
                else {
                    $(item).find("#user_nick").text(userinfo.nickname);
                }
                if (userinfo.phone != null && userinfo.phone != '') {
                    $(item).find("#user_phone").text((userinfo.phone).substr(0, 15));
                }
                else {
                    $(item).find("#user_phone").text("未绑定");
                }
                if (userinfo.email == null) {
                    $(item).find("#user_weixin").text("未绑定");
                }
                else {
                    $(item).find("#user_weixin").text(userinfo.email);
                }
                $(item).find("#regest_time").text(new Date(userinfo.regtime).toLocaleString());
                $(item).find("#regest_ip").text(userinfo.regip);
                servicetable.appendChild(item);
                serviceitems.push(item);
                $(item).find("#user_id").click(function () {
                    window.location.href = "userDetail.html?userid=" + $(this).text();
                });
            }
        });
    }
    LISTUSER.loadUser = loadUser;
})(LISTUSER || (LISTUSER = {}));
//# sourceMappingURL=companyUser.js.map