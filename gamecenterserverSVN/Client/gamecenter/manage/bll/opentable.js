$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        OPENTABLE.loadTable(null, null);
        OPENTABLE.loadGameList_new();
    });
});
var OPENTABLE;
(function (OPENTABLE) {
    var service_name = document.getElementById("service_name");
    var open_table_name = document.getElementById("open_table_name");
    var table_game_name = document.getElementById("table_game_name");
    var table_add_time = document.getElementById("table_add_time");
    var table_open_time = document.getElementById("table_open_time");
    var service_type = document.getElementById("service_type");
    var servicetable;
    var serviceitem;
    var serviceitems = [];
    function loadTable(time, tablename) {
        servicetable = document.getElementById("tableservice");
        serviceitem = document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para = new ADMIN.ADMINGETALLOPENTABLEREQ();
        para.time = time;
        para.tablename = tablename;
        ADMIN.adminGetAllTable(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat = resp.data;
            var data = dat.tablelist;
            for (var i = 0; i < data.length; i++) {
                var tableinfo = data[i];
                var item = serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#service_name").val(tableinfo.serverName);
                $(item).find("#open_table_name").text(tableinfo.serverName);
                $(item).find("#table_game_name").text(tableinfo.appname);
                $(item).find("#table_add_time").text(new Date(tableinfo.createTime).toLocaleString());
                // console.log(tableinfo.createTime);
                $(item).find("#table_open_time").text(new Date(tableinfo.openTime).toLocaleString());
                // alert(Date.parse(tableinfo.openTime)/1000);
                // $(item).find("#service_type").text(tableinfo.gamename);
                if (Date.parse(tableinfo.openTime) / 1000 < new Date().getTime() / 1000) {
                    $(item).find("#service_type").text("已开新服");
                }
                else {
                    $(item).find("#service_type").text("新服预告");
                }
                servicetable.appendChild(item);
                serviceitems.push(item);
                (function (mdata) {
                    $(item).find("#open_table_name").click(function (ev) {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        window.location.href = "edittable.html";
                    });
                    $("#del").click(function (ev) {
                        var para = new ADMIN.ADMINGETCHECKGIFTTABLEREQ();
                        var tablename = PUTILS_NEW.getCheckValues(document.getElementById('tableservice'));
                        para.tablename = tablename;
                        ADMIN.adminGetCheckTableList(para, function (resp) {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data = resp.data;
                            ADMIN.admindelTable(data, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        });
                    });
                })(tableinfo);
            }
        });
    }
    OPENTABLE.loadTable = loadTable;
    function addTable() {
        var list_game = $("#gamelist option:selected");
        var para = new ADMIN.ADMINADDOPENTABLEREQ();
        para.gamename = list_game.text();
        console.log(para.gamename);
        para.openTime = $("#recDate2").val();
        para.serverName = $("#name").val();
        console.log(para);
        ADMIN.adminAddTable(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    OPENTABLE.addTable = addTable;
    function loadGameList_new() {
        var selh5game = document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, function (resp) {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat = resp.data;
            var h5applist = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
    }
    OPENTABLE.loadGameList_new = loadGameList_new;
})(OPENTABLE || (OPENTABLE = {}));
//# sourceMappingURL=opentable.js.map