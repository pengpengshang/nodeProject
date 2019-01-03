///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminexchange.LoadData();
    });
});
var adminexchange;
(function (adminexchange) {
    var goodstable;
    var goodsitem;
    var goodsitems = [];
    function LoadData() {
        goodstable = document.getElementById("goodstable");
        goodsitem = document.getElementById("goodsitem");
        goodsitem.style.display = "none";
        ADMIN.admingetExchangeRecord({ loginid: null, pwd: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < goodsitems.length; i++) {
                goodstable.removeChild(goodsitems[i]);
            }
            goodsitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.data.length; i++) {
                var data = dat.data[i];
                var item = goodsitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#createtime").text(new Date(data.createtime).toLocaleString());
                $(item).find("#userid").text(data.userid);
                $(item).find("#addrphone").text(data.addrphone);
                $(item).find("#goodsname").text(data.goodsname);
                $(item).find("#costgold").text(data.costgold);
                if (data.state == 0) {
                    $(item).find("#state").text("已兑换");
                    item.style.color = "red";
                    item.style.backgroundColor = "yellow";
                }
                else {
                    $(item).find("#state").text("兑换成功");
                }
                $(item).find("#message").text(data.message);
                (function (data) {
                    $(item).find("#btnmodify").click(function (ev) {
                        sessionStorage["EXCHANGERECORD"] = JSON.stringify(data);
                        window.location.href = "exchangeedit.shtml";
                    });
                })(data);
                goodstable.appendChild(item);
                goodsitems.push(item);
            }
        });
    }
    adminexchange.LoadData = LoadData;
})(adminexchange || (adminexchange = {}));
//# sourceMappingURL=exchange.js.map