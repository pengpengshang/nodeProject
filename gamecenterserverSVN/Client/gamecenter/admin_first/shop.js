///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
$(document).ready(function () {
    ADMIN.adminCheckLogin(function (userinfo) {
        adminshop.LoadData();
    });
});
var adminshop;
(function (adminshop) {
    var goodstable;
    var goodsitem;
    var goodsitems = [];
    function LoadData() {
        goodstable = document.getElementById("goodstable");
        goodsitem = document.getElementById("goodsitem");
        goodsitem.style.display = "none";
        ADMIN.adminGetShopGoodsList({ loginid: null, pwd: null }, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                return;
            }
            for (var i = 0; i < goodsitems.length; i++) {
                goodstable.removeChild(goodsitems[i]);
            }
            goodsitems.splice(0);
            var dat = resp.data;
            for (var i = 0; i < dat.goodslist.length; i++) {
                var data = dat.goodslist[i];
                var item = goodsitem.cloneNode(true);
                item.style.display = "";
                $(item).find("#goodsid").text(data.id);
                $(item).find("#goodsname").text(data.name);
                $(item).find("#price").text(data.price);
                $(item).find("#rmbprice").text(data.rmbprice);
                $(item).find("#stock").text(data.stock);
                //				$(item).find("#detail").text(data.detail);
                $(item).find("#notice").text(data.notice);
                (function (data) {
                    $(item).find("#btnmodify").click(function (ev) {
                        sessionStorage["SHOPGOODSINFO"] = JSON.stringify(data);
                        window.location.href = "goodsedit.shtml";
                    });
                    $(item).find("#btndel").click(function (ev) {
                        if (confirm("是否删除" + data.name + "?")) {
                            ADMIN.adminDelGoods({ loginid: null, pwd: null, id: data.id }, function (resp) {
                                if (resp.errno != 0) {
                                    alert(resp.message);
                                    return;
                                }
                                alert("删除成功!");
                                LoadData();
                            });
                        }
                    });
                })(data);
                goodstable.appendChild(item);
                goodsitems.push(item);
            }
        });
    }
    adminshop.LoadData = LoadData;
})(adminshop || (adminshop = {}));
//# sourceMappingURL=shop.js.map