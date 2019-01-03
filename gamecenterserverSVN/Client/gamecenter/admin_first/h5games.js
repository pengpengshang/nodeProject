///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminh5games.LoadData();
    });
});
var adminh5games;
(function (adminh5games) {
    var gametable;
    var gameitem;
    var gameitems = [];
    function LoadData() {
        gametable = document.getElementById("gametable");
        gameitem = document.getElementById("gameitem");
        gameitem.style.display = "none";
        ADMIN.adminGetH5AppList({ loginid: ADMIN.userinfo.loginid, pwd: ADMIN.userinfo.pwd }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < gameitems.length; i++) {
                gametable.removeChild(gameitems[i]);
            }
            gameitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.applist.length; i++) {
                var data = dat.applist[i];
                var item = gameitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#appico").get(0)["src"] = data.ico + "?" + Math.random();
                $(item).find("#appname").text(data.name);
                $(item).find("#appdetail").text(data.detail);
                $(item).find("#orderby").text(data.orderby);
                $(item).find("#remark").text(data.remark);
                (function (data) {
                    $(item).find("#btnmodify").click(function (ev) {
                        sessionStorage["ADMINH5APPINFO"] = JSON.stringify(data);
                        window.location.href = "h5gameedit.shtml";
                    });
                    $(item).find("#btndel").click(function (ev) {
                        if (confirm("是否删除？")) {
                            ADMIN.adminDelH5App({ loginid: null, pwd: null, id: data.id }, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                LoadData();
                            });
                        }
                    });
                })(data);
                gametable.appendChild(item);
                gameitems.push(item);
            }
        });
    }
    adminh5games.LoadData = LoadData;
})(adminh5games || (adminh5games = {}));
//# sourceMappingURL=h5games.js.map