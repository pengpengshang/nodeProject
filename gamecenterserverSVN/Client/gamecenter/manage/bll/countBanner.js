$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        COUNTBANNER.loadCount(new Date().toLocaleDateString());
    });
});
var COUNTBANNER;
(function (COUNTBANNER) {
    var servicetable;
    var serviceitem;
    var serviceitems = [];
    function loadCount(time) {
        servicetable = document.getElementById("tableservice");
        serviceitem = document.getElementById("tabledetail");
        serviceitem.style.display = "none";
        for (var i = 0; i < serviceitems.length; i++) {
            servicetable.removeChild(serviceitems[i]);
        }
        serviceitems.splice(0);
        var para = new ADMIN.LISTCOUNTBANNERREQ();
        para.time = time;
        ADMIN.getIndexCountBanner(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var info = data[i];
                var item = serviceitem.cloneNode(true);
                $(item).find("#banner_addr").text(info.type);
                $(item).find("#banner_count").text(info.count);
                item.style.display = "";
                servicetable.appendChild(item);
                serviceitems.push(item);
            }
        });
    }
    COUNTBANNER.loadCount = loadCount;
})(COUNTBANNER || (COUNTBANNER = {}));
//# sourceMappingURL=countBanner.js.map