$(document).ready(() => {
    ADMIN.adminCheckLogin(userinfo => {
        COUNTBANNER.loadCount(new Date().toLocaleDateString());
    });
});
module COUNTBANNER {

    var servicetable: HTMLTableElement;
    var serviceitem: HTMLTableRowElement;
    var serviceitems: HTMLTableRowElement[] = [];
    export function loadCount(time) {
        servicetable = <any>document.getElementById("tableservice");
        serviceitem = <any>document.getElementById("tabledetail");
        serviceitem.style.display = "none";

        for (var i = 0; i < serviceitems.length; i++) {
            servicetable.removeChild(serviceitems[i]);
        }
        serviceitems.splice(0);

        var para: ADMIN.LISTCOUNTBANNERREQ = new ADMIN.LISTCOUNTBANNERREQ();
        para.time = time;
        ADMIN.getIndexCountBanner(para, resp => {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data: ADMIN.LISTCOUNTBANNERINFO[] = resp.data;
            for (var i = 0; i < data.length; i++) {
                var info: ADMIN.LISTCOUNTBANNERINFO = data[i];
                var item: HTMLTableRowElement = <any>serviceitem.cloneNode(true);
                $(item).find("#banner_addr").text(info.type);
                $(item).find("#banner_count").text(info.count);

                item.style.display = "";
                servicetable.appendChild(item);
                serviceitems.push(item);
            }
        })


    }
}