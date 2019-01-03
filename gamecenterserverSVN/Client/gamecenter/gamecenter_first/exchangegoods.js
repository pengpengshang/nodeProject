///<reference path='../jquery.d.ts' />
///<reference path='../5wansdk.ts' />
///<reference path='global.ts' />
$(document).ready(function () {
    GAMECENTER.UserAutoLogin(function (userinfo) {
        gcexchangegoods.LoadData();
    });
});
var gcexchangegoods;
(function (gcexchangegoods) {
    function LoadData() {
        var id = utils.getQueryString("id");
        if (!id) {
            history.back();
            return;
        }
        var para = new GAMECENTER.GSUSERGETSHOPGOODSLISTREQ();
        para.id = parseInt(id);
        GAMECENTER.gsUserGetShopGoodsList(para, function (resp) {
            if (resp.errno != 0) {
                alert(resp.message);
                history.back();
                return;
            }
            var dat = resp.data;
            if (dat.goodslist.length == 0) {
                alert("商品不存在！");
                history.back();
                return;
            }
            var goods = dat.goodslist[0];
            $("#goodsimg").get(0)["src"] = goods.img;
            $("#goodsname").text(goods.name);
            $("#rmbprice").text("价值" + goods.rmbprice + "元");
            $("#price").text(goods.price);
            $("#notice").text(goods.notice);
            $("#btnexchange").click(function (ev) {
                if (!GAMECENTER.userinfo) {
                    window.location.href = "login.shtml";
                    return;
                }
                if (GAMECENTER.userinfo.gold < goods.price) {
                    $(".box").show();
                }
                else {
                    sessionStorage["SHOPGOODSINFO"] = JSON.stringify(goods);
                    window.location.href = 'editaddress.shtml?id=' + id;
                }
            });
            /*			if (GAMECENTER.userinfo&&GAMECENTER.userinfo.gold < goods.price) {
                            var btnexchange: HTMLInputElement = <any>document.getElementById("btnexchange");
                            btnexchange.style.backgroundColor = "#d8d8d8";
                            btnexchange.style.color = "#ffffff";
                            btnexchange.value = "K币不足";
                        }
                        */
        });
    }
    gcexchangegoods.LoadData = LoadData;
})(gcexchangegoods || (gcexchangegoods = {}));
//# sourceMappingURL=exchangegoods.js.map