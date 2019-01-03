$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        POINTREWARD.loadRechageRobot();
    });
});
var POINTREWARD;
(function (POINTREWARD) {
    var nick = document.getElementById("#user_nick");
    var headico = document.getElementById("#user_head");
    var pay = document.getElementById("#user_pay");
    function loadRechage() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getRechageReward(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
        });
    }
    POINTREWARD.loadRechage = loadRechage;
    function loadPoint() {
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getPointReward(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
        });
    }
    POINTREWARD.loadPoint = loadPoint;
    var rechagelist = document.getElementById("activityitems");
    var rechageitem = document.getElementById("activityitem");
    var rechageitems = [];
    function loadRechageRobot() {
        rechageitem.style.display = "none";
        for (var i = 0; i < rechageitems.length; i++) {
            rechagelist.removeChild(rechageitems[i]);
        }
        rechageitems.splice(0);
        var para = new ADMIN.ACTIVITYINFO();
        ADMIN.getRechagerobot(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var item = rechageitem.cloneNode(true);
                var rechageinfo = data[i];
                $(item).find("#user_nick").val(rechageinfo.nickname);
                $(item).find("#user_nick").addClass("" + rechageinfo.id + "");
                $(item).find("#user_pay").val(rechageinfo.paysum);
                $(item).find("#user_pay").addClass("pay" + "" + rechageinfo.id + "");
                $(item).find("#user_head").val(rechageinfo.headico);
                $(item).find("#user_head").addClass("head" + "" + rechageinfo.id + "");
                $(item).find("#user_id").val(rechageinfo.userid);
                (function fun(data) {
                    $(item).find("#user_save").click(function (ev) {
                        saveRechageRobot(data.id);
                    });
                })(rechageinfo);
                item.style.display = '';
                rechagelist.appendChild(item);
                rechageitems.push(item);
            }
        });
    }
    POINTREWARD.loadRechageRobot = loadRechageRobot;
    function saveRechageRobot(id) {
        var para = new ADMIN.RECHAGEROBOTREQ();
        para.id = id;
        para.nickname = $("." + id + "").val();
        para.headico = $(".head" + id + "").val();
        para.paysum = $(".pay" + id + "").val();
        ADMIN.saveRechageRobot(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            alert("保存成功！");
        });
    }
    POINTREWARD.saveRechageRobot = saveRechageRobot;
})(POINTREWARD || (POINTREWARD = {}));
//# sourceMappingURL=pointReward.js.map