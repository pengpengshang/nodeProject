$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        OPENTABLE.loadTable(null, null);
        OPENTABLE.loadGameList_new();
    });
});
module OPENTABLE {
    var service_name: HTMLInputElement = <any>document.getElementById("service_name");
    var open_table_name: HTMLInputElement = <any>document.getElementById("open_table_name");
    var table_game_name: HTMLInputElement = <any>document.getElementById("table_game_name");
    var table_add_time: HTMLInputElement = <any>document.getElementById("table_add_time");
    var table_open_time: HTMLInputElement = <any>document.getElementById("table_open_time");
    var service_type: HTMLInputElement = <any>document.getElementById("service_type");
    var servicetable: HTMLTableElement;
    var serviceitem: HTMLTableRowElement;
    var serviceitems: HTMLTableRowElement[] = [];
    export function loadTable(time, tablename) {
        servicetable = <any>document.getElementById("tableservice");
        serviceitem = <any>document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para: ADMIN.ADMINGETALLOPENTABLEREQ = new ADMIN.ADMINGETALLOPENTABLEREQ();
        para.time = time;
        para.tablename = tablename;
        ADMIN.adminGetAllTable(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat: ADMIN.ADMINGETALLTABLERESP = resp.data;
            var data = dat.tablelist;
            for (var i = 0; i < data.length; i++) {
                var tableinfo: ADMIN.ADMINGETALLOPENTABLEINFO = data[i];
                var item: HTMLTableRowElement = <any>serviceitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#service_name").val(tableinfo.serverName);
                $(item).find("#open_table_name").text(tableinfo.serverName);
                $(item).find("#table_game_name").text(tableinfo.appname);
                $(item).find("#table_add_time").text(new Date(tableinfo.createTime).toLocaleString());
               // console.log(tableinfo.createTime);
                $(item).find("#table_open_time").text(new Date(tableinfo.openTime).toLocaleString());
               // alert(Date.parse(tableinfo.openTime)/1000);
               // $(item).find("#service_type").text(tableinfo.gamename);
                if (Date.parse(tableinfo.openTime)/1000  < new Date().getTime()/1000) {
                    $(item).find("#service_type").text("已开新服");
                } else {
                    $(item).find("#service_type").text("新服预告");
                }
                servicetable.appendChild(item);
                serviceitems.push(item);
               (function (mdata: ADMIN.ADMINGETALLOPENTABLEINFO) {
                   $(item).find("#open_table_name").click(ev => {
                        sessionStorage["ADMINCPAPPINFO"] = JSON.stringify(mdata);
                        window.location.href = "edittable.html";
                    });
                    $("#del").click(ev => {
                        var para: ADMIN.ADMINGETCHECKGIFTTABLEREQ = new ADMIN.ADMINGETCHECKGIFTTABLEREQ();
                        var tablename = PUTILS_NEW.getCheckValues(document.getElementById('tableservice'));
                        para.tablename = tablename;
                        ADMIN.adminGetCheckTableList(para, resp => {
                            if (resp.errno != 0) {
                                alert(resp.message);
                                return;
                            }
                            var data: ADMIN.ADMINDELOPENTABLE[] = resp.data;
                            ADMIN.admindelTable(data, resp => {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                console.log("成功");
                                window.location.reload();
                            });
                        })
                    });
                })(tableinfo);
            }
        });
    }
    export function addTable() {//添加礼包
        var list_game = $("#gamelist option:selected");
        var para: ADMIN.ADMINADDOPENTABLEREQ = new ADMIN.ADMINADDOPENTABLEREQ();
        para.gamename = list_game.text();
        console.log(para.gamename);
        para.openTime = $("#recDate2").val();
        para.serverName =$("#name").val();

        console.log(para);
        ADMIN.adminAddTable(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            window.location.reload();
        });
    }
    export function loadGameList_new() {//加载游戏列表
        var selh5game: HTMLSelectElement = <any>document.getElementById("gamelist");
        GAMECENTER.gsUserGetH5AppList({ id: null }, resp => {
            if (resp.errno != 0) {
                utils.dialogBox(resp.message);
                return;
            }
            var dat: GAMECENTER.GSUSERGETH5APPLISTRESP = resp.data;
            var h5applist: GAMECENTER.H5APPINFO[] = dat.applist;
            for (var i = 0; i < h5applist.length; i++) {
                var opt: HTMLOptionElement = document.createElement("option");
                opt.innerText = h5applist[i].name;
                opt.value = h5applist[i].id.toString();
                selh5game.add(opt, i);
            }
        });
    }
}  