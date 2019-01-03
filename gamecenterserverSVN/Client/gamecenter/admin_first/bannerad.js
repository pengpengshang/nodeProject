///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminbannerad.LoadData();
    });
});
var adminbannerad;
(function (adminbannerad) {
    var weeklytable;
    var weeklyitem;
    var weeklyitems = [];
    var shopadtable;
    var shopaditem;
    var shopaditems = [];
    var activitytable;
    var activityitem;
    function LoadData() {
        weeklytable = document.getElementById("weeklytable");
        weeklyitem = document.getElementById("weeklyitem");
        weeklyitem.style.display = "none";
        shopadtable = document.getElementById("shopadtable");
        shopaditem = document.getElementById("shopaditem");
        shopaditem.style.display = "none";
        activitytable = document.getElementById("activitytable");
        activityitem = document.getElementById("activityitem");
        activityitem.style.display = "none";
        ADMIN.adminGetWeeklyGoodsList({ loginid: null, pwd: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < weeklyitems.length; i++) {
                weeklytable.removeChild(weeklyitems[i]);
            }
            weeklyitems.splice(0);
            var data = resp.data;
            for (var i = 0; i < data.data.length; i++) {
                var dat = data.data[i];
                var item = weeklyitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#goodsid").text(dat.goodsid);
                $(item).find("#goodsname").text(dat.name);
                $(item).find("#price").text(dat.price);
                $(item).find("#rmbprice").text(dat.rmbprice);
                $(item).find("#stock").text(dat.stock);
                $(item).find("#img").get(0)["src"] = dat.img + "?" + Math.random();
                $(item).find("#timestart").text(new Date(dat.timestart).toLocaleString());
                $(item).find("#timeend").text(new Date(dat.timeend).toLocaleString());
                (function (dat) {
                    $(item).find("#btnedit").click(function (ev) {
                        sessionStorage['ADMINWEEKLYGOODINFO'] = JSON.stringify(dat);
                        window.location.href = "weeklyedit.shtml";
                    });
                    $(item).find("#btndel").click(function (ev) {
                        if (confirm("是否删除" + dat.name)) {
                            ADMIN.adminDelWeeklyGoods({ loginid: null, pwd: null, id: dat.id }, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                alert("删除成功");
                                LoadData();
                            });
                        }
                    });
                })(dat);
                weeklytable.appendChild(item);
                weeklyitems.push(item);
            }
        });
        ADMIN.adminGetShopAdList({ loginid: null, pwd: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < shopaditems.length; i++) {
                shopadtable.removeChild(shopaditems[i]);
            }
            weeklyitems.splice(0);
            var data2 = resp.data;
            for (var i = 0; i < data2.data.length; i++) {
                var dat2 = data2.data[i];
                var item = shopaditem.cloneNode(true);
                item.style.display = "";
                item.querySelector("#goodsid").textContent = dat2.goodsid.toString();
                item.querySelector("#goodsname").textContent = dat2.goodsname;
                item.querySelector("#price").textContent = dat2.price.toString();
                item.querySelector("#rmbprice").textContent = dat2.rmbprice.toString();
                item.querySelector("#stock").textContent = dat2.stock.toString();
                item.querySelector("#img")["src"] = dat2.img + "?" + Math.random();
                (function (dat2) {
                    $(item).find("#btnedit").click(function (ev) {
                        sessionStorage['ADMINSHOPADINFO'] = JSON.stringify(dat2);
                        window.location.href = "shopadedit.shtml";
                    });
                    $(item).find("#btndel").click(function (ev) {
                        if (confirm("是否删除？")) {
                            ADMIN.adminDelShopAD({ loginid: null, pwd: null, id: dat2.id }, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                alert("删除成功");
                                LoadData();
                            });
                        }
                    });
                })(dat2);
                shopadtable.appendChild(item);
                shopaditems.push(item);
            }
        });
        ADMIN.adminGetActivityList({ loginid: null, pwd: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            while (activitytable.children.length > 1)
                activitytable.removeChild(activitytable.lastChild);
            var actdat = resp.data;
            for (var i = 0; i < actdat.data.length; i++) {
                var item = activityitem.cloneNode(true);
                var dat = actdat.data[i];
                var url;
                item.querySelector("#actimg")["src"] = dat.img + "?" + Math.random();
                if (dat.type == 0)
                    url = dat.url;
                else if (dat.type == 1)
                    url = utils.g_serverurl + "gsh5game?id=" + dat.url;
                item.querySelector("#actlink")["href"] = url;
                item.querySelector("#actlink").textContent = url;
                item.querySelector("#orderby").textContent = dat.orderby.toString();
                (function (dat) {
                    $(item).find("#actedit").click(function (ev) {
                        sessionStorage["ADMINACTIVITYINFO"] = JSON.stringify(dat);
                        window.location.href = "activityedit.shtml";
                    });
                    $(item).find("#actdel").click(function (ev) {
                        if (confirm("是否删除?")) {
                            ADMIN.adminDelActivity({ loginid: null, pwd: null, id: dat.id }, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                alert("删除成功");
                                LoadData();
                            });
                        }
                    });
                })(dat);
                item.style.display = "";
                activitytable.appendChild(item);
            }
        });
    }
    adminbannerad.LoadData = LoadData;
})(adminbannerad || (adminbannerad = {}));
//# sourceMappingURL=bannerad.js.map