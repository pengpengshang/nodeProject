$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        USERGAMEDETAIL.loadGame(null, null,null);
    });
});
module USERGAMEDETAIL {
    var servicetable: HTMLTableElement;
    var serviceitem: HTMLTableRowElement;
    var serviceitems: HTMLTableRowElement[] = [];
    export function loadGame(userid,time, tablename) {
        servicetable = <any>document.getElementById("tableservice");
        serviceitem = <any>document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        var para: ADMIN.ADMINGETALLLISTUSERGAMEREQ = new ADMIN.ADMINGETALLLISTUSERGAMEREQ();
        para.userid = utils.getQueryString("userid");
        para.time = time;
        para.tablename = tablename;
        ADMIN.adminGetAllUserGame(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < serviceitems.length; i++) {
                servicetable.removeChild(serviceitems[i]);
            }
            serviceitems.splice(0);
            var dat: ADMIN.ADMINGETALLLISTUSERGAMERESP = resp.data;
            var data = dat.usergamelist;
            for (var i = 0; i < data.length; i++) {
                var userinfo: ADMIN.ADMINGETALLLISTUSERGAMEINFO = data[i];
                var item: HTMLTableRowElement = <any>serviceitem.cloneNode(true);
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
}   